describe('component store', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  describe('Multiple-Store Instances', () => {
    beforeEach(() => {
      cy.openLinkFromToolbar('Component-Store', 'Multiple-Store instances');
    });

    it('should show initial', () => {
      cy.get('.counter').first().should('have.text', '0');
      cy.get('.counter').last().should('have.text', '0');
    });

    it('should show incremented card 1', () => {
      console.log(cy.get('mat-card-actions button'));
      cy.get('.increment').first().click();
      cy.get('.increment').first().click();
      cy.get('.increment').last().click();

      cy.get('.counter').first().should('have.text', '2');
      cy.get('.counter').last().should('have.text', '1');
    });

    it('should restore state after revisit', () => {
      cy.get('.increment').first().click();
      cy.get('.increment').last().click();

      cy.openLinkFromToolbar('Component-Store', 'Basic');

      cy.openLinkFromToolbar('Component-Store', 'Multiple-Store instances');

      cy.get('.counter').first().should('have.text', '0');
      cy.get('.counter').last().should('have.text', '0');
    });
  });
});
