describe('component Forms', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  describe('BasicCounter', () => {
    beforeEach(() => {
      cy.openLinkFromToolbar('Component-Store', 'Basic');
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

      cy.openLinkFromToolbar('Component-Store', 'Basic');

      cy.get('mat-card-content').should('have.text', '0');
    });
  });
});
