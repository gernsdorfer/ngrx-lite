describe('loading component Store:OptionSkipSamePendingActions', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  describe('Basic', () => {
    beforeEach(() => {
      cy.openLinkFromToolbar(
        ' Loading-Component-Store',
        'Option: skipSamePendingActions',
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
  });
});
