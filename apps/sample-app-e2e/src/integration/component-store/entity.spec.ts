describe('component store', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  describe('entity', () => {
    beforeEach(() => {
      cy.openLinkFromToolbar('Component-Store', 'Entity');
    });

    it('should have 3 Product after load', () => {

      cy.get('.product-list').should('contain.text', 'Product 1');
      cy.get('.product-list').should('contain.text', 'Product 2');
      cy.get('.product-list').should('contain.text', 'Product 3');
    });

    it('should add new product', () => {
      cy.get('mat-card-actions button').click();
      cy.get('input').type('Product 4');

      cy.get('mat-card-content button').contains('save').click();

      cy.get('.product-list').should('contain.text', 'Product 4');
    });

    it('should update product', () => {
      cy.get('mat-card-content button').contains('edit').click();
      cy.get('input').type('Product 1 New');

      cy.get('mat-card-content button').contains('save').click();

      cy.get('.product-list').should('contain.text', 'Product 1 New');
    });

    it('should remove product', () => {
      cy.get('mat-card-content button').contains('delete').click();

      cy.get('mat-card-content button').contains('save').click();

      cy.get('.product-list').should('not.contain.text', 'Product 1');
    });
  });
});
