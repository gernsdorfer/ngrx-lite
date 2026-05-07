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
      cy.get('#query').type('foo', { force: true });

      cy.get('.hit').should('have.length', 3);
      cy.get('.hit').first().should('contain.text', 'foo-1');
    });

    it('should keep previous hits when query is cleared (skipWhen blocks the load)', () => {
      cy.get('#query').type('foo', { force: true });
      cy.get('.hit').should('have.length', 3);

      cy.get('#query').clear({ force: true });

      // skipWhen blocks the loader on empty query; state is not reset.
      cy.get('.hit').should('have.length', 3);
      cy.get('.hit').first().should('contain.text', 'foo-1');
    });
  });
});
