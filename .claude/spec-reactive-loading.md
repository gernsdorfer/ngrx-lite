# Spec: Reactive Loading & Auto-Load für `ComponentLoadingStore`

> **Status:** Diskussions-Grundlage. Vor der Implementation mit `grill-me` durchgehen oder via `to-prd` in ein formales PRD überführen. Nicht als fertiges Implementations-Briefing lesen — die Designfragen unten sind absichtlich offen.

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

| Store | Pattern |
|---|---|
| `professionalListStore` (filter+pagination+searchId) | `reactiveLoadingEffect` |
| `bookmarkSearchResource` (searchId) | `reactiveLoadingEffect` + `skipWhen: !p` |
| `skillListStore` (param-frei) | `loadingEffect({ autoLoad: true })` |
| `bookmarkListStore` (param-frei) | `loadingEffect({ autoLoad: true })` |
| `locationListStore` (Output-Event) | bleibt imperativ |
| `bookmarkAdminStore` (add/remove) | bleibt imperativ |

→ 4 von 6 Stores ziehen Nutzen, zwei bleiben unverändert. Faustregel:
- **Read mit reaktiver Quelle** → `reactiveLoadingEffect`
- **Read param-frei beim Mount** → `loadingEffect({ autoLoad: true })`
- **Mutation oder Event-getriggerter Read** → `loadingEffect` imperativ (heute)

## Offene Designfragen (für `grill-me`)

1. **`autoLoad`-Trigger-Mechanismus** — `queueMicrotask` im Constructor? `afterNextRender`? Beim ersten `state()`-Read (lazy)? Trade-off: SSR-Verhalten + Test-Ergonomie + Konsistenz mit existierenden Patterns in der Lib.

2. **Mehrfacher `connect`-Call** — Was passiert, wenn zwei Container denselben Singleton-Store mit `connect(sourceA)` und `connect(sourceB)` verbinden? Last-wins? Beide aktiv? Fehler? **Wahrscheinlich ein Footgun.** API-Design entscheidet hier über Sicherheit.

3. **`skipSameActions` semantisch** — heute existiert die Option, aber wie wird Equality geprüft? Reference, deep, custom comparator? Für `reactiveLoadingEffect` mit Signal-Source ist die Antwort wichtig (Filter-Objekte werden bei jedem `computed`-Read neu erzeugt → reference-equal ist hier untauglich, deep wäre teuer).

4. **`cancelPending`-Default** — `true` für reaktive Quelle ist intuitiv (alte Antwort verwerfen). Aber: `skipSamePendingActions` heute bedeutet was anderes (skip wenn gleiche Action schon pending). Sind beide Konzepte das gleiche oder unterschiedlich? Naming?

5. **`autoLoad` nur für `P extends void`** — Type-Constraint via Conditional Type. Funktioniert das mit der existierenden generischen Signatur ohne TS-Tricks zu brauchen? Fallback: Runtime-Check + Doc.

6. **SSR-Skip standardisieren?** — Aktuell muss jeder Wrapper-Store `skipWhen: () => this.ssrState.hasRestored()` selbst angeben. Sollte die Lib das übernehmen, wenn ein `StoreTransferState` injiziert wird? Oder bleibt das im Frontend? (Argument für „bleibt": ngrx-lite kennt `StoreTransferState` nicht, das ist Frontend-Code.)

7. **Versions-Strategie** — Minor-Bump ausreichend? Beide Erweiterungen sind additiv. Falls jemand bereits eine Methode `reactiveLoadingEffect` außerhalb der Lib monkey-patcht: kein Schutz möglich, akzeptables Risiko.

8. **Doku-Stil** — README-Section pro Methode mit Mini-Beispiel? TypeDoc-Kommentare? Konsistent mit existierender Lib-Doku — vor dem ersten Schreibvorgang `README.md` lesen.

## Acceptance Criteria (für `to-prd`)

- [ ] `loadingEffect` akzeptiert `autoLoad: true` für param-freie Effects, feuert genau einmal beim Mount.
- [ ] `loadingEffect` akzeptiert `skipWhen: () => boolean`, blockt `autoLoad` und manuelle Dispatches.
- [ ] `autoLoad` an einem param-tragenden Effect ist Compile-Fehler (oder klare Runtime-Warnung).
- [ ] `reactiveLoadingEffect` returnt eine Connect-Funktion, die mit einem `Signal<P>` aufgerufen wird.
- [ ] Source-Signal-Änderung triggert Loader-Call mit neuen Params.
- [ ] Identische aufeinanderfolgende Param-Werte triggern keinen Doppel-Call (`skipSameActions: true` Default).
- [ ] Source-Änderung während Pending-Request verwirft das alte Request (`cancelPending: true` Default).
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
