describe('loading component Store', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  describe('BasicCounter', () => {
    beforeEach(() => {
      cy.openLinkFromToolbar(' Loading-Component-Store', 'with Signal Effects');
    });
    it('should show initial state', () => {
      cy.get('.counter').should('have.text', '0');
    });

    it('should show incremented state', () => {
      cy.get('.increment').click();

      cy.get('.counter').should('have.text', '1');
    });
  });
});
