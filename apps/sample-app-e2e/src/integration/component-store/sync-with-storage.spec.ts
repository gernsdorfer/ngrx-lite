describe('component Forms', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  describe('Sync with Storage', () => {
    beforeEach(() => {
      cy.openLinkFromToolbar('Component-Store', 'Sync with Storage');
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

      cy.reload();

      cy.openLinkFromToolbar('Component-Store', 'Sync with Storage');

      cy.get('mat-card-content').should('have.text', '1');
    });
  });
});
