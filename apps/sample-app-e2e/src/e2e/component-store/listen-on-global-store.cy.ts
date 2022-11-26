describe('component store', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  describe('Listen on global store', () => {
    beforeEach(() => {
      cy.openLinkFromToolbar('Component-Store', 'Listen on global store');
    });

    it('should show initial', () => {
      cy.get('.counter').first().should('have.text', '0');
      cy.get('.counter').last().should('have.text', '0');
    });

    it('should show incremented state', () => {
      cy.get('.increment').first().click();
      cy.get('.increment').first().click();
      cy.get('.increment').last().click();
      cy.get('.reset').last().click();

      cy.get('.counter').first().should('have.text', '0');
      cy.get('.counter').last().should('have.text', '0');
    });
  });
});
