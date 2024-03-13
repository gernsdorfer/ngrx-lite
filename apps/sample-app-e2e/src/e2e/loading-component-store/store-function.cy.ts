describe('loading component Store', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  describe('Store as Function', () => {
    beforeEach(() => {
      cy.openLinkFromToolbar(' Loading-Component-Store', 'Functional Store');
    });
    it('should show initial state', () => {
      cy.get('.counter').should('have.text', '');
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
