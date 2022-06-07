describe('component store', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  describe('Shared with Effects', () => {
    beforeEach(() => {
      cy.openLinkFromToolbar('Component-Store', 'Share with @ngrx/Effects');
    });
    it('should show initial state', () => {
      cy.get('.counter').should('have.text', '0');
    });

    it('should show incremented state', () => {
      cy.get('.increment').click();

      cy.get('.counter').should('have.text', '1');
      cy.get('.snackbar').should('have.text', 'counter increment: 1');
    });
  });
});
