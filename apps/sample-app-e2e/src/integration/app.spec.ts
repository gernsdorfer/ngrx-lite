import '../fixtures/component-loading.json';
import { LiftedState } from '@ngrx/store-devtools';
import { StoreDevtools } from '@ngrx/store-devtools/src/devtools';

declare global {
  interface Window {
    jumpToAction: StoreDevtools['jumpToAction'];
    importState: StoreDevtools['importState'];
  }
}
describe('sample-app', () => {
  beforeEach(() => {
    cy.visit('/#/loading-basic');
  });

  it('Change UI after Store is updated', () => {
    cy.fixture('component-loading.json').then((state: LiftedState) => {
      cy.window().then((window) => {
        window.importState(state);
        state.stagedActionIds
          .filter((id) =>
            state.actionsById[id]?.action?.type.startsWith('[COMPONENT_STORE]')
          )
          .forEach((id) => {
            const stateName = `${id} - ${state.actionsById[id]?.action?.type} `;
            cy.wrap(stateName)
              .then(() => window.jumpToAction(id))
              .percySnapshot(stateName);
          });
      });
    });
  });
});
