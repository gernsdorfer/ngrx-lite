describe('component store', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  describe('Store from Service', () => {
    beforeEach(() => {
      cy.openLinkFromToolbar(
        'Component-Store',
        'Store from Service (Provided in Module)'
      );
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

      cy.openLinkFromToolbar(
        'Component-Store',
        'Store from Service (Provided in Module)'
      );

      cy.get('mat-card-content').should('have.text', '1');
    });
  });
});
