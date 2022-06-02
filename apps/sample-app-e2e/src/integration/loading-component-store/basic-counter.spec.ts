describe('loading component Store', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  describe('Basic', () => {
    beforeEach(() => {
      cy.openLinkFromToolbar(' Loading-Component-Store', 'Basic');
    });
    it('should show initial state', () => {
      cy.get('mat-card-content').should('have.text', '');
    });

    it('should show incremented state', () => {
      cy.get('mat-card-actions button').click();

      cy.get('my-app-ui-spinner').should('exist');
      cy.get('mat-card-content').should('have.text', '1');
    });

    it('should reset state after revisit', () => {
      cy.get('mat-card-actions button').click();

      cy.openLinkFromToolbar('Component-Store', 'Custom-Action');

      cy.openLinkFromToolbar('Loading-Component-Store', 'Basic');

      cy.get('mat-card-content').should('have.text', '');
    });
  });
});
