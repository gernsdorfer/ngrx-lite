describe('component store', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  describe('Custom-Action', () => {
    beforeEach(() => {
      cy.openLinkFromToolbar('Component-Store', 'Custom-Action');
    });
    it('should show initial state', () => {
      cy.get('.counter').should('have.text', '0');
    });

    it('should show incremented state', () => {
      cy.get('.increment').click();

      cy.get('.counter').should('have.text', '1');
    });

    it('should reset state after revisit', () => {
      cy.get('.increment').click();

      cy.openLinkFromToolbar('Component-Store', 'Basic');

      cy.openLinkFromToolbar('Component-Store', 'Custom-Action');

      cy.get('.counter').should('have.text', '0');
    });
  });
});
