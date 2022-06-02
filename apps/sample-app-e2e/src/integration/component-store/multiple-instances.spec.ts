describe('component Forms', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  describe('Multiple-Store Instances', () => {
    beforeEach(() => {
      cy.openLinkFromToolbar('Component-Store', 'Multiple-Store instances');
    });

    it('should show initial', () => {
      cy.get('mat-card-content').first().should('have.text', '0');
      cy.get('mat-card-content').last().should('have.text', '0');
    });

    it('should show incremented card 1', () => {
      console.log(cy.get('mat-card-actions button'));
      cy.get('mat-card-actions button').first().click();
      cy.get('mat-card-actions button').first().click();
      cy.get('mat-card-actions button').last().click();

      cy.get('mat-card-content').first().should('have.text', '2');
      cy.get('mat-card-content').last().should('have.text', '1');
    });

    it('should restore state after revisit', () => {
      cy.get('mat-card-actions button').first().click();
      cy.get('mat-card-actions button').last().click();

      cy.openLinkFromToolbar('Component-Store', 'Basic');

      cy.openLinkFromToolbar('Component-Store', 'Multiple-Store instances');

      cy.get('mat-card-content').first().should('have.text', '0');
      cy.get('mat-card-content').last().should('have.text', '0');
    });
  });
});
