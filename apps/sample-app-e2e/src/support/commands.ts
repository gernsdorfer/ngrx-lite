import { LiftedState } from '@ngrx/store-devtools';
import { lastValueFrom, take } from 'rxjs';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable<Subject> {
      importState: (stateFixture: string) => Chainable<Subject>;
      jumpToAction: (actionType: string) => Chainable<Subject>;
    }

    interface Chainable<Subject> {
      openLinkFromToolbar(
        menuName: string,
        menuItem: string,
      ): Chainable<Subject>;
    }
  }
}
Cypress.Commands.add(
  'openLinkFromToolbar',
  (menuName: string, menuItem: string) => {
    const toolbar = () => cy.get('.toolbar');
    return toolbar()
      .contains(menuName)
      .click()
      .get('.toolbar')
      .get('.menu-link')
      .contains(menuItem)
      .click()
      .wait(1000);
  },
);

Cypress.Commands.add('importState', (stateFixture: string) => {
  cy.window().then((window) => {
    console.log('import');
    cy.fixture(stateFixture).then((state: LiftedState) => {
      window.storeDevtools.importState(state);
      return Promise.resolve();
    });
  });
});
Cypress.Commands.add('jumpToAction', (actionType: string) =>
  cy.window().then(async (window) => {
    const liftetState = await lastValueFrom(
      window.storeDevtools.liftedState.pipe(take(1)),
    );
    const [actionId] = liftetState.stagedActionIds.filter((id) => {
      const { type } = liftetState.actionsById[id].action;
      return type === actionType;
    });

    cy.wrap(window.zone.run(() => window.storeDevtools.jumpToAction(actionId)));
  }),
);
