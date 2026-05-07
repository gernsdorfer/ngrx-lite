# PRD: Reactive Loading & Auto-Load für `ComponentLoadingStore`

## Problem Statement

Container-Components in Angular-Apps, die `@gernsdorfer/ngrx-lite` benutzen, schreiben heute manuelle `effect()`-Blöcke, um Signal-Quellen mit `loadingEffect`-Dispatches zu verdrahten. Das führt zu drei wiederkehrenden Schmerzen:

1. **Effect-Code lebt im Container, nicht im Store** — der Container kennt das Loading-Lifecycle, sollte aber nur Source-Signals reichen.
2. **Vergiss-Falle** — wer einen Signal-Read im `effect()` vergisst, kriegt keinen Re-Trigger und merkt es spät.
3. **Init-Loads als `effect()` sind ein Anti-Pattern** — `effect()` ist für „state X → side-effect Y", nicht für „lade einmal beim Mount".

Konkretes Beispiel aus einem konsumierenden Frontend (Angular 21 + SSR):

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

## Solution

Zwei additive Erweiterungen an `ComponentLoadingStore`:

1. **`loadingEffect`-Options** um `autoLoad` (einmaliger Trigger beim Mount für param-freie Effects) und `skipWhen` (Pre-Flight-Skip für SSR-Hydration, fehlende Params, Cache-Hits etc.).
2. **Neue Methode `reactiveLoadingEffect`** — bindet eine `Signal<P>`-Source an den Loading-Lifecycle. Wrapper-Store stellt die Mechanik bereit, Container reicht nur die Source.

Container schreiben kein eigenes `effect()` mehr fürs Daten-Laden. Loading-Lifecycle (was/wann/warum geladen wird) lebt im Wrapper-Store. Existierende Internas (Action-Stream, DevTools, `skipSamePendingActions`, `repeatActions`) werden wiederverwendet — keine zweite Wahrheit.

Keine Breaking Changes — Minor-Bump 21.0.0 → 21.1.0.

## User Stories

1. Als Lib-Konsument möchte ich, dass ein param-freier `loadingEffect` automatisch einmal beim Mount feuert, damit ich keinen manuellen `effect()`-Block im Container für Init-Loads schreiben muss.
2. Als Lib-Konsument möchte ich einen `skipWhen`-Callback bereitstellen, der jeden Dispatch (autoLoad + manuell + reaktiv) blockt, damit ich Lade-Versuche unterdrücken kann, wenn State bereits aus SSR-Hydration befüllt ist oder Params fehlen.
3. Als Lib-Konsument möchte ich eine Methode `reactiveLoadingEffect`, die ein `Signal<P>` an den Loading-Lifecycle bindet, damit der Container nur die Source bereitstellt und der Store die Lade-Mechanik besitzt.
4. Als Lib-Konsument möchte ich, dass nur ein „Owner"-Container per `connect()` das Laden steuert, während beliebig viele „Consumer"-Komponenten den State lesen, damit Lese- und Steuerverantwortung sauber getrennt sind.
5. Als Lib-Konsument möchte ich, dass die Lib mich zur Dev-Time warnt, wenn ich versehentlich zwei parallele Sources an denselben Store hänge, damit ich den Bug erkenne, bevor er sich als stiller State-Stomp manifestiert.
6. Als Lib-Konsument möchte ich, dass der `connect`-Slot beim Container-Destroy wieder freigegeben wird, damit ein nachfolgender Container ohne manuellen Cleanup neu binden kann.
7. Als Lib-Konsument möchte ich, dass `autoLoad: true` an einem param-tragenden Effect ein Compile-Error ist, damit Tippfehler vor der Laufzeit gefangen werden.
8. Als Lib-Konsument möchte ich, dass mein Server-Side-Render initial Daten lädt und mein Client-Hydration den Doppel-Fetch skippt, damit SSR mit den neuen APIs funktioniert.
9. Als Lib-Konsument möchte ich identische aufeinanderfolgende Param-Werte optional vom Loader-Call ausnehmen können, damit signal-derivierte Sources keine redundanten API-Calls auslösen.
10. Als Lib-Konsument möchte ich, dass ein neuer Param-Wert während eines Pending-Requests den laufenden Request automatisch verwirft, damit veraltete Responses nie frischen State überschreiben.
11. Als Lib-Konsument möchte ich, dass die `connect`-Cleanup-Logik am `DestroyRef` der aufrufenden Komponente hängt, damit es bei Component-Unmount keine Memory-Leaks gibt.
12. Als Lib-Konsument möchte ich, dass Action-Stream, Redux-DevTools-Integration und `repeatActions` mit `reactiveLoadingEffect` identisch zu `loadingEffect` funktionieren, damit Debug- und Effects-Chain-Workflows unverändert bleiben.
13. Als Lib-Konsument möchte ich klare README-Sections und Sample-App-Demos für beide neuen APIs, damit ich kanonische Patterns sehe, bevor ich eigene schreibe.
14. Als Lib-Autor möchte ich Version `21.1.0` (Minor) bumpen, damit Konsumenten den additiven Charakter erkennen und keine Brüche erwarten.
15. Als Lib-Autor möchte ich einen Helper `Store.checkConnect` als Deep Module mit kleiner Schnittstelle, damit der Single-Connect-Guard isoliert testbar und wiederverwendbar ist.
16. Als Lib-Konsument möchte ich, dass die Type-Definitionen den `autoLoad`-Constraint via Conditional Types erzwingen, damit ich IDE-Feedback an der Aufrufstelle bekomme.
17. Als Lib-Konsument möchte ich beim Wrapper-Schreiben frei sein, wie ich die zurückgegebene `connect`-Funktion benenne, damit ich domänenspezifische Namen wählen kann (z.B. `loadFrom`, `bindTo`).
18. Als Lib-Konsument möchte ich Multi-Source-Bindung explizit per `computed()` machen, statt sie als API-Knopf zu kriegen, damit das Mental Model „eine Source pro Store" erhalten bleibt.

## Implementation Decisions

### Module — modifiziert

- **`ComponentLoadingStore.loadingEffect`** — Erweiterung der Options-Bag um `autoLoad?: [P] extends [void] ? boolean : never` und `skipWhen?: () => boolean`. Beide optional. Der `autoLoad`-Trigger benutzt `queueMicrotask()` im Konstruktor des Wrapper-Stores (SSR-korrekt: feuert auf Server _und_ Client; Konsument unterdrückt bei Bedarf via `skipWhen`). `skipWhen` wird vor jedem `runEffect`-Call ausgewertet — blockt `autoLoad`, manuelle `dispatch()`-Calls und reaktive Trigger gleichermaßen. Schnittstelle bleibt vollständig rückwärtskompatibel.

- **`Store`-Service** — neuer Helper `checkConnect`, der eine Set/Map der aktuell-belegten Store-Namen verwaltet. Beim Register: ist der Slot belegt und `isDevMode()` true → `console.error` (konsistent mit existierendem `addStoreNameToInternalCache`-Pattern). Cleanup via `DestroyRef.onDestroy` der aufrufenden Komponente gibt den Slot frei. **Deep Module:** kleine Schnittstelle (`register`/internes Tracking), interne Datenstruktur, ohne Angular-Component-Setup testbar.

### Module — neu

- **`ComponentLoadingStore.reactiveLoadingEffect`** — neue Methode auf `ComponentLoadingStore`. Signatur:
  ```
  (name, loader, options?) => (source: Signal<P>) => void
  ```
  Der Wrapper-Store-Autor bindet die zurückgegebene Funktion an die Consumer-Source-Signal-Variable. Intern:
  - Aufgebaut auf `loadingEffect` (kein Code-Duplikat; nutzt `skipSamePendingActions`, Action-Stream, DevTools, `repeatActions` 1:1).
  - Eigenes `effect()`-Setup, das die Source liest und an `loadingEffect`'s Dispatch reicht.
  - Ruft `Store.checkConnect` für den Single-Connect-Guard.
  - Cleanup via `inject(DestroyRef).onDestroy` räumt Effect und Connect-Slot ab.
  - `skipWhen?: (p: P) => boolean` mit Param-Zugriff (asymmetrisch zu `loadingEffect`, weil intern dispatcht wird).
  - Default `skipSameActions: false` (konsistent mit `loadingEffect`); README empfiehlt `true` für Signal-derivierte Sources.

### API-Contract

- Die Lib gibt **keinen Namen** für die zurückgegebene Connect-Funktion vor. Wrapper-Autoren wählen selbst; README-Konvention ist `connect`.
- Multi-Source-Bindung wird durch den Konsumenten via `computed()` gelöst (vor dem `connect`-Aufruf). Kein API-Knopf in der Lib.
- Lib bleibt SSR-agnostisch — kein Import von `isPlatformBrowser`, `TransferState` oder ähnlichem. SSR-spezifische Logik wird per `skipWhen` an Konsumenten delegiert.
- Equality-Semantik für `skipSameActions` benutzt den existierenden Deep-`JSON.stringify`-mit-sortierten-Keys-Comparator. Kein Drift zwischen `loadingEffect` und `reactiveLoadingEffect`.
- Das `switchMap`-basierte Cancel-Pending-Verhalten ist implizit aktiv, nicht abschaltbar, nicht als Option exponiert (wäre irreführend).

### Mental Model — dokumentiert

- **Owner / Driver:** der eine Container, der `connect(source)` aufruft. Verantwortlich für „wann/wie wird geladen".
- **Consumer:** beliebig viele Komponenten, die `inject(Store)` und `state()` lesen — read-only.
- Single-Connect-Guard erzwingt diese Konvention statt sie nur implizit zu erwarten.

### Versionierung

- `libs/store/package.json` und Root-`package.json`: Bump `21.0.0` → `21.1.0`.
- CHANGELOG-Eintrag im bestehenden ` :rocket: Enhancement`-Format mit PR-Verlinkung.

## Testing Decisions

### Was einen guten Test in diesem Repo ausmacht

- Tests adressieren **externes Verhalten** der öffentlichen API (`loadingEffect`, `reactiveLoadingEffect`, `Store.checkConnect`), nicht Implementierungs-Interna.
- Vitest via `@analogjs/vite-plugin-angular`, Konfiguration pro Projekt in `vitest.config.ts`.
- Mocks via `createVitestSpyObj` aus `@ngrx-lite/testing` (nicht Jasmine-Spies), trotz `jasmine-marbles` als devDependency.
- Store-aware Tests via `storeTestingFactory()` aus `@gernsdorfer/ngrx-lite/testing`. Dispatched über das exportierte `actions$`-`Subject`.
- Test-Bootstrap in `libs/store/src/test-setup.ts` initialisiert das `BrowserTestingModule`-Test-Environment — keine Re-Init in Specs.
- 100% Line/Branch/Function/Statement-Coverage-Gate via `vitest.config.ts`-Thresholds. Jeder neue Code-Pfad braucht Coverage; intentional-untestable braucht Eintrag in `exclude` mit Justification.

### Module mit Tests

- **`ComponentLoadingStore.loadingEffect` mit neuen Options:**
  - `autoLoad: true` feuert genau einmal beim Mount via `queueMicrotask`.
  - `autoLoad: true` wird geblockt, wenn `skipWhen()` `true` zurückgibt.
  - `skipWhen()` blockt manuelle `dispatch()`-Calls.
  - Type-Test (`*.spec-d.ts` oder `@ts-expect-error`-Annotation): `autoLoad` an einem param-tragenden Effect ist Compile-Error.

- **`ComponentLoadingStore.reactiveLoadingEffect`:**
  - Source-Signal-Änderung triggert Loader-Call mit neuen Params.
  - Identische aufeinanderfolgende Params (mit `skipSameActions: true`) lösen keinen Doppel-Call aus.
  - Neuer Param während Pending-Request verwirft den laufenden (`switchMap`-Verhalten).
  - `DestroyRef.onDestroy` der Aufruf-Komponente räumt Effect und Connect-Slot ab — kein Leak.
  - Action-Stream, DevTools-State und `repeatActions`-Integration matchen `loadingEffect`.
  - `skipWhen` empfängt den Param und blockt den Dispatch.

- **`Store.checkConnect`:**
  - Erster `register` für einen Store-Namen erfolgreich.
  - Zweiter `register` für denselben Namen logged `console.error` im Dev-Mode; Prod-Mode silent.
  - `DestroyRef`-Cleanup gibt den Slot für nachfolgende `register`-Calls frei.

### Prior Art

- `component-loading-store.service.spec.ts` und `store.service.spec.ts` decken bereits Tests derselben Form ab (Effect-Dispatch, Action-Stream-Assertions, DevTools-Integration).
- `addStoreNameToInternalCache` hat existierende Unit-Test-Coverage in `store.service.spec.ts` — `checkConnect` folgt demselben Muster.

## Out of Scope

- Migration konsumierender Stores (z.B. `belowie/frontend`) auf die neuen APIs — separater Consumer-Side-Rollout, nicht Teil dieses PRDs.
- Ablösung von `loadingEffect` durch `reactiveLoadingEffect` — `loadingEffect` bleibt für imperative Mutationen (`add`, `remove`, `save`) und event-getriggerte Reads erhalten.
- Konkurrenz zu Angular `resource()` — ngrx-lite-Stores haben SSR-Hydration, DevTools, Storage-Plugins out of the box; das ist der Existenzgrund.
- SSR-Awareness in der Lib einbauen. Kein Import von `isPlatformBrowser` oder `TransferState`. SSR-Skip bleibt Konsumenten-Verantwortung via `skipWhen` + eigener `TransferState`-Integration.
- Custom-Equality-Comparator-Option (`equal`, `comparator`) — YAGNI; der Deep-Equal-Default wird seit `loadingEffect` benutzt und ist dokumentiertes Verhalten.
- `cancelPending`-Option — das aktuelle `switchMap`-Verhalten cancelt Pending-Requests bei neuem Param schon implizit; eine Flag würde fälschlich suggerieren, das ließe sich abschalten.
- API-Knopf für Multi-Source-Merging — Konsumenten komponieren mit `computed()` vor `connect`.
- Cypress-E2E-Tests für die neuen Sample-App-Demos — out of scope; existierende E2E deckt die Patterns indirekt ab.
- Refactoring der `loadingEffect`-Internas jenseits der additiven Options-Bag-Erweiterung.

## Further Notes

- `connect` als Konventionsname für die zurückgegebene Funktion ist Doku-Konvention. Die Lib gibt eine unbenannte Funktion zurück; Wrapper-Autoren benennen sie domänen-passend.
- Der `[P] extends [void] ? boolean : never`-Conditional benutzt Tuple-Wrap, um TypeScripts Distributive-Conditional-Types zu vermeiden.
- Der Single-Connect-Guard benutzt `console.error` in `isDevMode()` (kein `throw`) aus zwei Gründen: (1) konsistent mit dem existierenden `addStoreNameToInternalCache` „warn-don't-throw"-Muster; (2) vermeidet überraschende Crashes bei race-igen Route-Transitions, wo Container A's `DestroyRef.onDestroy` nach Container B's `connect.register` läuft.
- Implementierungs-Roadmap (aus dem Spec):
  - **Schritt 1:** `autoLoad` + `skipWhen` an `loadingEffect`. Tests + README.
  - **Schritt 2:** `reactiveLoadingEffect` neu, intern auf `loadingEffect` aufgebaut, plus `Store.checkConnect`. Tests + README.
  - **Schritt 3:** Sample-App-Demos (drei: `autoLoad`, `reactiveLoadingEffect`, `skipWhen`), CHANGELOG, Version-Bump.
  - Pro Schritt: User-Review abwarten, kein `git commit` ohne explizites OK.
- Designentscheidungen sind in `.claude/spec-reactive-loading.md` als D1–D8 dokumentiert.
- Drei Sample-App-Demos: (1) `autoLoad` — App-Konfiguration beim Mount laden; (2) `reactiveLoadingEffect` — Suchfeld mit Debounce-Signal als Source → Filter steuert Liste; (3) `skipWhen` — Detail-Lade nur wenn ID-Signal gesetzt.
