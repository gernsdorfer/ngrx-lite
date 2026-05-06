describe('loading component Store::OptionSkipWhen', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  describe('Basic', () => {
    beforeEach(() => {
      cy.openLinkFromToolbar(' Loading-Component-Store', 'Option: skipWhen');
    });

    it('should show initial state', () => {
      cy.get('#run-effect').should('have.text', '0');
      cy.get('#value').should('have.text', '');
      cy.get('#skip-flag').should('have.text', 'false');
    });

    it('should load when skip flag is false', () => {
      cy.get('.load').click();

      cy.get('#run-effect').should('have.text', '1');
      cy.get('#value').should('have.text', 'loaded #1');
    });

    it('should not load when skip flag is true', () => {
      cy.get('.toggle-skip').click();
      cy.get('#skip-flag').should('have.text', 'true');

      cy.get('.load').click();

      cy.get('#run-effect').should('have.text', '0');
      cy.get('#value').should('have.text', '');
    });

    it('should resume loading after skip flag is toggled back', () => {
      cy.get('.toggle-skip').click();
      cy.get('.load').click();
      cy.get('.toggle-skip').click();

      cy.get('.load').click();

      cy.get('#run-effect').should('have.text', '1');
      cy.get('#value').should('have.text', 'loaded #1');
    });
  });
});
