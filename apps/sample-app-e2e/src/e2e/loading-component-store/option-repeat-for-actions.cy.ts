describe('loading component Store:RepeatForAction', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  describe('Basic', () => {
    beforeEach(() => {
      cy.openLinkFromToolbar(
        ' Loading-Component-Store',
        'Option: RepeatForActions',
      );
    });
    it('should show initial state', () => {
      cy.get('#counter').should('have.text', '');
      cy.get('#run-effect').should('have.text', '0');
    });

    it('should run only one time', () => {
      cy.get('#actions').contains('1').click();

      cy.get('#run-effect').should('have.text', '1');
    });

    it('should rerun after sideEffect', () => {
      cy.get('#actions').contains('1').click();
      cy.get('#actions').contains('SideEffect').click();

      cy.get('#counter').should('have.text', '1');
      cy.get('#run-effect').should('have.text', '2');
    });

    it('should rerun last action after sideEffect', () => {
      cy.get('#actions').contains('1').click();
      cy.get('#actions').contains('2').click();
      cy.get('#actions').contains('SideEffect').click();

      cy.get('#counter').should('have.text', '2');
      cy.get('#run-effect').should('have.text', '3');
    });
  });
});
