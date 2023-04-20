describe('forms component Store', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  const FormNameInput = () => cy.get('.form-input[formcontrolname=name]');
  const FormLastNameInput = () =>
    cy.get('.form-input[formcontrolname=lastName]');

  describe('Basic', () => {
    beforeEach(() => {
      cy.openLinkFromToolbar(' Forms-Component-Store', 'Basic');
    });
    it('should show initial state', () => {
      FormNameInput().clear().type('test');
      FormLastNameInput().clear().type('lastName');

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
