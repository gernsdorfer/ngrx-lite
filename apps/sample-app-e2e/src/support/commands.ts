// eslint-disable-next-line @typescript-eslint/no-namespace
import { LiftedState } from '@ngrx/store-devtools';
import Chainable = Cypress.Chainable;

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface Chainable<Subject> {
      runStorageFile(
        stateFixture: string,
        callback: (stateName: string) => Chainable<Subject>
      ): void;
    }

    interface Chainable<Subject> {
      openLinkFromToolbar(menuName: string , menuItem: string): void;
    }
  }
}
Cypress.Commands.add('openLinkFromToolbar', (menuName: string , menuItem: string) => {
  cy.get('mat-toolbar')
    .contains(menuName)
    .click()
    .get('mat-toolbar')
    .get('a')
    .contains(menuItem)
    .click();
});

Cypress.Commands.add(
  'runStorageFile',
  <T>(stateFixture: string, callback: (stateName: string) => Chainable<T>) => {
    cy.window().then((window) => {
      cy.fixture(stateFixture).then((state: LiftedState) => {
        window.importState(state);
        state.stagedActionIds
          .filter((id) =>
            state.actionsById[id]?.action?.type.startsWith('[COMPONENT_STORE]')
          )
          .forEach((id) => {
            const stateName = `${id} - ${state.actionsById[id]?.action?.type} `;
            cy.wrap(stateName)
              .then(() => window.jumpToAction(id))
              .then(() => callback(stateName));
          });
      });
    });
  }
);
