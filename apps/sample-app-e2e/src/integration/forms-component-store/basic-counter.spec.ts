describe('forms component Store', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  describe('Basic', () => {
    beforeEach(() => {
      cy.openLinkFromToolbar(' Forms-Component-Store', 'Basic');
    });
    it('should show initial state', () => {
      cy.get('.form-input[formcontrolname=name]').clear().type('test');
      cy.get('.form-input[formcontrolname=lastName]').clear().type('lastName');

      cy.openLinkFromToolbar('Component-Store', 'Custom-Action');
      cy.openLinkFromToolbar('Forms-Component-Store', 'Basic');

      cy.get('.form-input[formcontrolname=name]').should('have.value', 'test');
      cy.get('.form-input[formcontrolname=lastName]').should(
        'have.value',
        'lastName'
      );
    });
  });
});
