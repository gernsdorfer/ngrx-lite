describe('component store', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  describe('Sync with Storage', () => {
    beforeEach(() => {
      cy.openLinkFromToolbar('Component-Store', 'Sync with Storage');
    });
    it('should show initial state', () => {
      cy.get('.counter').should('have.text', '0');
    });

    it('should show incremented state', () => {
      cy.get('.increment').click();

      cy.get('.counter').should('have.text', '1');
    });

    it('should restore state after revisit', () => {
      cy.get('.increment').click();

      cy.reload();

      cy.openLinkFromToolbar('Component-Store', 'Sync with Storage');

      cy.get('.counter').should('have.text', '1');
    });
  });
});
