// eslint-disable-next-line @typescript-eslint/no-namespace
import {LiftedState} from '@ngrx/store-devtools';
import {lastValueFrom, take} from 'rxjs';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface Chainable<Subject> {
      importState: (stateFixture: string) => Chainable<Subject>;
      jumpToAction: (actionType: string) => Chainable<Subject>;
    }

    interface Chainable<Subject> {
      openLinkFromToolbar(menuName: string, menuItem: string): Chainable<Subject>;
    }
  }
}
Cypress.Commands.add(
  'openLinkFromToolbar',
  (menuName: string, menuItem: string) =>
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.get('.toolbar')
      .contains(menuName)
      .click()
      .get('.toolbar')
      .get('.menu-link')
      .contains(menuItem)
      .click()
      .wait(1000)
);

Cypress.Commands.add(
  'importState', (
    stateFixture: string
  ) => {
    cy.window().then((window) => {
      cy.fixture(stateFixture).then((state: LiftedState) => {
        window.storeDevtools.importState(state);
        return Promise.resolve();
      });
    });
  }
);
Cypress.Commands.add('jumpToAction', (actionType: string) => cy.window().then(async (window) => {
    const liftetState = await lastValueFrom(window.storeDevtools.liftedState.pipe(take(1)));
    const [actionId] = liftetState.stagedActionIds
      .filter((id) => liftetState.actionsById[id]?.action?.type === actionType);
    cy.wrap(window.zone.run(() => window.storeDevtools.jumpToAction(actionId)));
  })
)
;
