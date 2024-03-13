describe('component store', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  describe('Store as Function', () => {
    beforeEach(() => {
      cy.openLinkFromToolbar(' Component-Store', 'Functional Store');
    });
    it('should show initial state', () => {
      cy.get('.counter').should('have.text', '0');
    });

    it('should show incremented state', () => {
      cy.get('.increment').click();

      cy.get('.counter').should('have.text', '1');
      cy.get('.message').should(
        'have.text',
        'Root Store knows the StoreA Increment Successfully',
      );
    });
  });
});
