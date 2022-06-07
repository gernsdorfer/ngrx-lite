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
      cy.get('.counter').should('have.text', '0');
    });

    it('should show incremented state', () => {
      cy.get('.increment').click();

      cy.get('.counter').should('have.text', '1');
    });

    it('should restore state after revisit', () => {
      cy.get('.increment').click();

      cy.openLinkFromToolbar('Component-Store', 'Basic');

      cy.openLinkFromToolbar(
        'Component-Store',
        'Share Store to ChildComponents'
      );

      cy.get('.counter').should('have.text', '1');
    });
  });
});
