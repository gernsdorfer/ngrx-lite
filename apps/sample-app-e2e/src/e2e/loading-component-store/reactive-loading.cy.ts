describe('loading component Store::ReactiveLoading', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  describe('Basic', () => {
    beforeEach(() => {
      cy.openLinkFromToolbar(' Loading-Component-Store', 'Reactive Loading');
    });

    it('should show empty state initially', () => {
      cy.get('#empty').should('exist');
      cy.get('.hit').should('not.exist');
    });

    it('should load hits when query is typed', () => {
      cy.get('#query').click().type('foo');

      cy.get('.hit').should('have.length', 3);
      cy.get('.hit').first().should('contain.text', 'foo-1');
    });

    it('should reset to empty state when query is cleared', () => {
      cy.get('#query').click().type('foo');
      cy.get('.hit').should('have.length', 3);

      cy.get('#query').clear();

      cy.get('#empty').should('exist');
    });
  });
});
