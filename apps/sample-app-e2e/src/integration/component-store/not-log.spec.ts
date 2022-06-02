import { LiftedState } from '@ngrx/store-devtools';

declare global {
  interface Window {
    getLiftedState: (callback: (state: LiftedState) => void) => void;
  }
}
describe('component store', () => {
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
      cy.get('mat-card-content').should('have.text', '1');
    });
  });
});
