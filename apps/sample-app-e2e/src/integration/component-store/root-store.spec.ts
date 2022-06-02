describe('component store', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  describe('Root-Store', () => {
    beforeEach(() => {
      cy.openLinkFromToolbar('Component-Store', 'Root-Store');
    });
    it('should show initial state', () => {
      cy.get('mat-card-content').should('have.text', '0');
    });

    it('should show incremented state', () => {
      cy.get('mat-card-actions button').click();

      cy.get('mat-card-content').should('have.text', '1');
    });

    it('should restore state after revisit', () => {
      cy.get('mat-card-actions button').click();

      cy.openLinkFromToolbar('Component-Store', 'Basic');

      cy.openLinkFromToolbar('Component-Store', 'Root-Store');

      cy.get('mat-card-content').should('have.text', '1');
    });
  });
});
