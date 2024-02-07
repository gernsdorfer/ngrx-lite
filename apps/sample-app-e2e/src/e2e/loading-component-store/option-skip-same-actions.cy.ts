describe('loading component Store::OptionSkipSameActions', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  describe('Basic', () => {
    beforeEach(() => {
      cy.openLinkFromToolbar(
        ' Loading-Component-Store',
        'Option: skipSameActions',
      );
    });
    it('should show initial state', () => {
      cy.get('#counter').should('have.text', '');
      cy.get('#run-effect').should('have.text', '0');
    });

    it('should run only one time', () => {
      cy.get('#actions').contains('1').click();
      cy.get('#actions').contains('1').click();
      cy.get('#actions').contains('1').click();

      cy.get('#counter').should('have.text', '1');
      cy.get('#run-effect').should('have.text', '1');
    });

    it('should set last click value', () => {
      cy.get('#actions').contains('1').click();
      cy.get('#actions').contains('1').click();
      cy.get('#actions').contains('1').click();
      cy.get('#actions').contains('2').click();

      cy.get('#counter').should('have.text', '2');
      cy.get('#run-effect').should('have.text', '2');
    });

    it('should increment without payload', () => {
      cy.get('#empty-payload').contains('auto 1').click();

      cy.get('#counter').should('have.text', '1');
      cy.get('#run-effect').should('have.text', '1');
    });
  });
});
