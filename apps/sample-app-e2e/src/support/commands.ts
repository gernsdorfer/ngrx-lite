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
      openLinkFromToolbar(menuName: string, menuItem: string): void;
    }
  }
}
Cypress.Commands.add(
  'openLinkFromToolbar',
  (menuName: string, menuItem: string) => {
    cy.get('mat-toolbar')
      .contains(menuName)
      .click()
      .get('mat-toolbar')
      .get('a')
      .contains(menuItem)
      .click();
  }
);

Cypress.Commands.add(
  'importState',
  <T>(
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
