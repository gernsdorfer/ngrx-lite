# Spec: Reactive Loading & Auto-Load für `ComponentLoadingStore`

> **Status:** Designfragen via `grill-me` durchgegrillt (siehe Abschnitt „Designentscheidungen"). Bereit für Implementation oder Überführung in formales PRD via `to-prd`.

## Problem

Nutzer der Lib (konkret: `belowie/frontend`, Angular 21, Signals, SSR) schreiben in Container-Components händische `effect()`-Blöcke, um Signal-Quellen mit `loadingEffect`-Dispatchern zu verdrahten. Beispiel:

```ts
private loadCompanies = effect(() =>
  this.professionalListStore.load({
    pagination: this.pagination(),
    filter: this.filter(),
    searchId: this.searchId(),
  }),
);
private loadSkills = effect(() => this.skillListStore.load());
private loadBookmarks = effect(() => this.bookmarkListStore.load());
```

Drei wiederkehrende Schmerzen:

1. **Effect-Code lebt im Container, nicht im Store** — der Container kennt das Loading-Lifecycle, sollte aber nur Source-Signals reichen.
2. **Vergiss-Falle** — wer einen Signal-Read im Effect vergisst, kriegt keinen Re-Trigger und merkt es spät.
3. **Init-Loads als `effect()` sind ein Anti-Pattern** — `effect()` ist für „state X → side-effect Y", nicht für „lade einmal beim Mount".

## Goals

- Container schreiben kein eigenes `effect()` mehr fürs Daten-Laden.
- Loading-Lifecycle (was/wann/warum geladen wird) lebt im Store-Wrapper.
- Existierende `loadingEffect`-Internas (Action-Stream, DevTools, `skipSamePendingActions`, `repeatActions`) werden wiederverwendet — keine zweite Wahrheit.
- Keine Breaking Changes — Minor-Bump, additiv.

## Non-Goals

- Migration der bestehenden Frontend-Stores (passiert in einem separaten Repo/Schritt).
- Ablösung von `loadingEffect` — bleibt für imperative Mutationen (`add`, `remove`, `save`) und event-getriggerte Reads erhalten.
- Konkurrenz zu Angular's `resource()` — ngrx-lite-Stores haben SSR-Hydration, DevTools, Storage-Plugins out of the box, das ist der Existenzgrund.

## Vorschlag — zwei Erweiterungen

### Erweiterung 1: `loadingEffect`-Options um `autoLoad` + `skipWhen`

Aktuelle Signatur:

```ts
loadingEffect<P>(name, fn, options?: {
  skipSameActions?: boolean;
  skipSamePendingActions?: boolean;
  repeatActions?: ActionCreator[];
})
```

Neu:

```ts
loadingEffect<P>(name, fn, options?: {
  ...
  autoLoad?: P extends void ? boolean : never;  // nur param-frei, sonst Compile-Fehler
  skipWhen?: () => boolean;                     // pre-flight skip (SSR-Restore, …)
})
```

`autoLoad: true` → einmaliger Trigger im Constructor (Mechanismus offen, siehe Designfragen).
`skipWhen` → wird vor `runEffect` ausgewertet, blockt auch den `autoLoad`-Trigger.

### Erweiterung 2: Neue Methode `reactiveLoadingEffect`

```ts
reactiveLoadingEffect<P, ITEM>(
  name: string,
  loader: (params: P) => Observable<ITEM>,
  options?: {
    skipSameActions?: boolean;     // Default: true
    skipWhen?: (p: P) => boolean;
    cancelPending?: boolean;       // Default: true
    repeatActions?: ActionCreator[];
  },
): (source: Signal<P>) => void
```

Aufruf-Site (Wrapper-Store, NICHT Container direkt):

```ts
private connect = this.store.reactiveLoadingEffect(
  'load',
  ({ filter, pagination, searchId }) => this.api.search(...).pipe(...),
  { skipWhen: (p) => this.ssrState.hasRestored() },
);

// Im Wrapper-Factory:
export const ProfessionalList = {
  getStore: (source: Signal<{ filter, pagination, searchId }>) => {
    const service = professionalListStore.inject();
    service.connect(source);             // läuft im Container-Injection-Context
    return { state: service.state };
  },
};
```

Implementations-Skizze:

```ts
reactiveLoadingEffect(name, loader, options) {
  const dispatch = this.loadingEffect(name, loader, {
    skipSameActions: options?.skipSameActions ?? true,
    skipSamePendingActions: options?.cancelPending ?? true,
    repeatActions: options?.repeatActions,
  });
  return (source) => {
    effect(() => {
      const params = source();
      if (options?.skipWhen?.(params)) return;
      dispatch(params);
    });
  };
}
```

Der Trick: `effect()` greift sich den `DestroyRef` der **Aufrufstelle** (Container), nicht des root-Singletons → Cleanup automatisch beim Component-Destroy.

## Use-Case-Mapping (zur Validierung)

Aus dem Frontend-Container `professional/feature-search/.../list-container.component.ts`:

| Store                                                | Pattern                                  |
| ---------------------------------------------------- | ---------------------------------------- |
| `professionalListStore` (filter+pagination+searchId) | `reactiveLoadingEffect`                  |
| `bookmarkSearchResource` (searchId)                  | `reactiveLoadingEffect` + `skipWhen: !p` |
| `skillListStore` (param-frei)                        | `loadingEffect({ autoLoad: true })`      |
| `bookmarkListStore` (param-frei)                     | `loadingEffect({ autoLoad: true })`      |
| `locationListStore` (Output-Event)                   | bleibt imperativ                         |
| `bookmarkAdminStore` (add/remove)                    | bleibt imperativ                         |

→ 4 von 6 Stores ziehen Nutzen, zwei bleiben unverändert. Faustregel:

- **Read mit reaktiver Quelle** → `reactiveLoadingEffect`
- **Read param-frei beim Mount** → `loadingEffect({ autoLoad: true })`
- **Mutation oder Event-getriggerter Read** → `loadingEffect` imperativ (heute)

## Designentscheidungen

Aus dem `grill-me`-Durchlauf vom 2026-05-06. Entscheidungen sind verbindlich, bevor implementiert wird.

### D1 — Lifecycle & `connect`-Identität (Footgun-Schutz)

- **Store** bleibt `providedIn: 'root'` (Singleton pro Store-Name). Kein Bruch mit existierenden Patterns.
- **Mental Model:** ein **Owner/Driver** ruft `connect(source)` (steuert Loading-Lifecycle), beliebig viele **Consumer** lesen `state()`.
- **`connect()` ist exklusiv:** zweiter parallel-aktiver Aufruf → `console.error` im `isDevMode()` (konsistent mit `addStoreNameToInternalCache` in `store.service.ts:186`). Im Prod-Build kein Throw.
- **Cleanup:** `inject(DestroyRef).onDestroy(() => connected = false)` — Owner-Container darf nach Destroy von einem anderen Container ersetzt werden.
- **Naming:** Lib-Methode heißt `reactiveLoadingEffect`; sie gibt eine Funktion zurück, die der Wrapper-Autor selbst benennt. Konventionsname in der Doku: `connect`.
- **Multi-Source:** kein API-Knopf. Konsumenten mergen Signal-Sources mit `computed()` außerhalb.

### D2 — `autoLoad`-Trigger-Mechanismus

- **Mechanismus:** `queueMicrotask(() => dispatch())` im Konstruktor des Wrapper-Stores.
- **Begründung:** SSR-korrekt (feuert auf Server _und_ Client), async (matcht `asapScheduler`-Pattern in `component-store.service.ts:88`), keine neue SSR-Awareness in der Lib.
- **Verworfen:** `afterNextRender` (browser-only → bricht SSR-Hydration), sync-Constructor (synchrone Side-Effects vor Konsumenten-Referenz), lazy-on-first-read (zu magisch).

### D3 — Equality-Semantik für `skipSameActions`

- **Default-Comparator:** `JSON.stringify` Deep-Equal mit sortierten Keys (übernommen aus `component-loading-store.service.ts:28-43`, kein Drift zu `loadingEffect`).
- **Keine separate Comparator-Option** in V1 (YAGNI; additiv nachrüstbar).
- **`skipSameActions` Default = `false`** auch in `reactiveLoadingEffect` (konsistent mit `loadingEffect`). README empfiehlt `true` für reaktive Signal-Sources, weil `computed()`-Werte bei jedem Dependency-Update neue Referenzen erzeugen.

### D4 — `cancelPending` vs. `skipSamePendingActions`

- **Kein neues `cancelPending`-Flag.** Das `switchMap`-Verhalten in `component-loading-store.service.ts:89` cancelt heute schon implizit jeden pending Request bei neuem Param.
- **`skipSamePendingActions` wird durchgereicht** (für Mutation-artige Reads, falls jemand opt-in will).
- **Doku** erklärt das implizite `switchMap`-Verhalten und die Differenz zu `skipSamePendingActions`.

### D5 — Type-Constraint `autoLoad` nur bei `P extends void`

- **Conditional Type mit Tuple-Wrap gegen Distributive:**
  ```ts
  autoLoad?: [P] extends [void] ? boolean : never;
  ```
- Compile-Error bei param-tragenden Effects. **Kein Runtime-Backup** — wer per `@ts-ignore` umgeht, hat sich's verdient.
- **Type-Tests** (`*.spec-d.ts` oder `expectError`) fixieren das Constraint.

### D6 — `skipWhen`-Scope + SSR-Standardisierung

- **`skipWhen` blockt alle Dispatches** (autoLoad + manuelle Calls + reaktive Trigger). Es ist ein Pre-Flight-Hook für: „Param fehlt", „SSR-Hydration hat State schon befüllt", „Cache-Hit", etc.
- **Asymmetrische Signatur** (passt zur Realität):
  - `loadingEffect<P>`: `skipWhen?: () => boolean` (kein Param-Zugriff; bei `P != void` prüft Konsument den Param vor `dispatch()` selbst)
  - `reactiveLoadingEffect<P>`: `skipWhen?: (p: P) => boolean` (Param-Zugriff, weil intern dispatcht wird)
- **SSR-Logik bleibt im Frontend.** Lib bleibt SSR-agnostisch (kein `isPlatformBrowser`/`TransferState`-Import). README zeigt das `skipWhen` + `StoreTransferState`-Pattern als Beispiel.

### D7 — Versionierung

- **`21.0.0` → `21.1.0`** (Minor). Beide Erweiterungen sind additiv, keine bestehende Signatur ändert sich. Convention: Major an Angular-Major gekoppelt, Feature-Adds = Minor.

### D8 — Doku-Stil

- **README** (`libs/store/README.md`): neue Section „Auto-Load & Reactive Loading" im bestehenden Stil (Markdown + Emojis + Code-Beispiele).
- **Sample-App** (`apps/sample-app`): drei neue Demos:
  1. `autoLoad` — App-Konfiguration beim Mount laden
  2. `reactiveLoadingEffect` — Suchfeld mit Debounce-Signal als Source
  3. `skipWhen` — Detail-Lade nur wenn ID gesetzt
- **CHANGELOG** im bestehenden Stil: ` :rocket: Enhancement` mit PR-Link.
- **Keine ausführlichen TypeDoc-/JSDoc-Kommentare** auf Methoden (Lib-Konvention: Doku in README, nicht in Code-Kommentaren). Ausnahme: `@deprecated` für ersetzte Optionen — hier nicht zutreffend.

## Acceptance Criteria (für `to-prd`)

- [ ] `loadingEffect` akzeptiert `autoLoad: true` für param-freie Effects, feuert genau einmal beim Mount.
- [ ] `loadingEffect` akzeptiert `skipWhen: () => boolean`, blockt `autoLoad` und manuelle Dispatches.
- [ ] `autoLoad` an einem param-tragenden Effect ist Compile-Fehler (oder klare Runtime-Warnung).
- [ ] `reactiveLoadingEffect` returnt eine Connect-Funktion, die mit einem `Signal<P>` aufgerufen wird.
- [ ] Source-Signal-Änderung triggert Loader-Call mit neuen Params.
- [ ] Identische aufeinanderfolgende Param-Werte triggern keinen Doppel-Call, wenn `skipSameActions: true` gesetzt ist (Default: `false`, README empfiehlt `true` für Signal-Sources).
- [ ] Source-Änderung während Pending-Request verwirft das alte Request automatisch (`switchMap`-Verhalten, nicht abschaltbar).
- [ ] Zweiter parallel-aktiver `connect()`-Aufruf am selben Store loggt `console.error` im Dev-Mode.
- [ ] `skipWhen` blockt `autoLoad`, manuelle Dispatches und reaktive Trigger gleichermaßen.
- [ ] `autoLoad` feuert via `queueMicrotask` auf Server _und_ Client (SSR-Skip via `skipWhen`).
- [ ] Component-Destroy räumt `effect()`-Subscription ab, kein Memory-Leak.
- [ ] Action-Stream / DevTools / `repeatActions` funktionieren identisch zu `loadingEffect`.
- [ ] CHANGELOG-Eintrag, Minor-Bump, README-Update mit Beispielen.
- [ ] Tests decken die Edge-Cases aus „Offene Designfragen" ab — sobald die Antworten stehen.

## Risiken

- **Misuse durch mehrfachen `connect`** → API-Design (Designfrage 2) muss das adressieren, sonst tickende Bombe.
- **Equality-Semantik** (Designfrage 3) → falsche Default-Wahl macht das Feature in der Praxis unbrauchbar (entweder zu viele Calls oder fehlende Updates).
- **`effect()` muss in Injection-Context aufgerufen werden** → Wrapper-Stores müssen das in der Doku klar markieren, sonst kryptische Errors zur Laufzeit.

## Vorgehen (kleinschrittig)

1. **Designfragen mit User klären** (`grill-me`) — vor jedem Code-Change.
2. **Schritt 1:** `loadingEffect` um `autoLoad` + `skipWhen` erweitern. Tests + README.
3. **Schritt 2:** `reactiveLoadingEffect` neu, intern auf `loadingEffect` aufgebaut. Tests + README.
4. **Schritt 3:** CHANGELOG + Version-Bump.

Pro Schritt: User-Review abwarten, kein `git commit` ohne explizites OK.

## Quellen

- Frontend-Beispiel-Container: `belowie/frontend` → `libs/professional/feature-search/src/container/list/list-container.component.ts`
- Existierender Wrapper mit `autoLoad`-Hack (zu ersetzen): `belowie/frontend` → `libs/shared/util-skill/src/skill-list.store.ts:62-71`
- Existierender SSR-Skip (Vorbild für `skipWhen`): `belowie/frontend` → `libs/professional/domain/src/lib/professional/professional-list.store.ts:71-74`
