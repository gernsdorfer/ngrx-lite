describe('component store', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  describe('Store from Service', () => {
    beforeEach(() => {
      cy.openLinkFromToolbar(
        'Component-Store',
        'Share Store to ChildComponents'
      );
    });

    it('should show initial state', () => {
      cy.get('.counter').first().should('have.text', '0');
      cy.get('.counter').last().should('have.text', '0');
    });

    it('should show incremented state', () => {
      cy.get('.increment').first().click();
      cy.get('.increment').first().click();
      cy.get('.increment').last().click();

      cy.get('.counter').first().should('have.text', '3');
      cy.get('.counter').last().should('have.text', '3');
    });

    it('should restore state after revisit', () => {
      cy.get('.increment').first().click();

      cy.openLinkFromToolbar('Component-Store', 'Basic');

      cy.openLinkFromToolbar(
        'Component-Store',
        'Share Store to ChildComponents'
      );

      cy.get('.counter').first().should('have.text', '0');
      cy.get('.counter').last().should('have.text', '0');
    });
  });
});
