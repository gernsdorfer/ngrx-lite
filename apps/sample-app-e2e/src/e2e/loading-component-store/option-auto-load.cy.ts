describe('loading component Store::OptionAutoLoad', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  describe('Basic', () => {
    beforeEach(() => {
      cy.openLinkFromToolbar(' Loading-Component-Store', 'Option: autoLoad');
    });

    it('should auto-load on mount', () => {
      cy.get('#run-effect').should('have.text', '1');
      cy.get('#config').should('contain.text', 'loaded at');
    });

    it('should reload on demand', () => {
      cy.get('.reload').click();

      cy.get('#run-effect').should('have.text', '2');
    });
  });
});
