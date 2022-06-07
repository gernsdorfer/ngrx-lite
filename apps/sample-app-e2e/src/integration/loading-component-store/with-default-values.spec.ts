describe('loading component Store', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  describe('BasicCounter', () => {
    beforeEach(() => {
      cy.openLinkFromToolbar(' Loading-Component-Store', 'Loading with default values');
    });
    it('should show initial state', () => {
      cy.get('.counter').should('have.text', '0');
    });

    it('should show incremented state', () => {
      cy.get('.increment').click();

      cy.get('my-app-ui-spinner').should('exist');
      cy.get('.counter').should('have.text', '1');
    });

    it('should reset state after revisit', () => {
      cy.get('.increment').click();

      cy.openLinkFromToolbar('Component-Store', 'Custom-Action');

      cy.openLinkFromToolbar('Loading-Component-Store', 'Loading with default values');

      cy.get('.counter').should('have.text', '0');
    });
  });
});
