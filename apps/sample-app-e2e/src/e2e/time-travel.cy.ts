import { NgZone } from '@angular/core';
import { StoreDevtools } from '@ngrx/store-devtools/src/devtools';
import '../fixtures/component-loading.json';

declare global {
  interface Window {
    storeDevtools: StoreDevtools;
    zone: NgZone;
  }
}
describe('TimeTravel with different routes', () => {
  beforeEach(() => {
    cy.visit('/');
  });
  describe('load State from ', () => {
    it('should jump to loading_basic INCREMENT:SUCCESS', () => {
      cy.importState('component-loading.json').then(() => {
        cy.jumpToAction('[COMPONENT_STORE][LOADING_BASIC] INCREMENT:SUCCESS');

        cy.location('hash').should('eq', '#/loading-basic');
        cy.get('.counter').should('have.text', '1');
      });
    });
  });
});
