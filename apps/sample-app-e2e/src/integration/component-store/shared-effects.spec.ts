describe('component store', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  describe('Shared with Effects', () => {
    beforeEach(() => {
      cy.openLinkFromToolbar('Component-Store', 'Share with @ngrx/Effects');
    });
    it('should show initial state', () => {
      cy.get('mat-card-content').should('have.text', '0');
    });

    it('should show incremented state', () => {
      cy.get('mat-card-actions button').click();

      cy.get('mat-card-content').should('have.text', '1');
      cy.get('simple-snack-bar').should('have.text', 'counter increment: 1');
    });
  });
});
