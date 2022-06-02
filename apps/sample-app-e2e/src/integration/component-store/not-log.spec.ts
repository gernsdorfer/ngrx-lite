import { LiftedState } from '@ngrx/store-devtools';

declare global {
  interface Window {
    getLiftedState: (callback: (state: LiftedState) => void) => void;
  }
}
describe('component Forms', () => {
  beforeEach(() => {
    cy.visit('/', {});
    cy.window().then((win) => {
      win.sessionStorage.clear();
    });
  });

  describe('BasicCounter', () => {
    beforeEach(() => {
      cy.openLinkFromToolbar('Component-Store', 'Without Log');
    });
    it('should show initial state', () => {
      cy.get('mat-card-content').should('have.text', '0');
    });

    it('should show incremented state', () => {
      cy.get('mat-card-actions button').click();

      cy.get('mat-card-content').should('have.text', '1');
    });

    it('should reset state after revisit', () => {
      cy.get('mat-card-actions button').click();

      cy.openLinkFromToolbar('Component-Store', 'Custom-Action');

      cy.openLinkFromToolbar('Component-Store', 'Without Log');
      cy.window().then((window) => {
        console.log('window');
        window.getLiftedState((state) => {
          console.log('state', state);
        });
      });

      //cy.get(window.getLiftedState).should('have.text', '1');
    });
  });
});
