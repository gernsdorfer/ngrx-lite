import '../fixtures/component-loading.json';
import { StoreDevtools } from '@ngrx/store-devtools/src/devtools';
import {NgZone} from "@angular/core";

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

    it('should jump to loading_basic INCREMENT:SUCCESS', () => {
      cy.importState('component-loading.json').then(() => {

        cy.jumpToAction('[COMPONENT_STORE][LOADING_WITH_DEFAULT_VALUES] INCREMENT:SUCCESS');

        cy.location('hash').should('eq', '#/loading-with-default-values')
        cy.get('.counter').should('have.text', '1');
      });
    });
  });
});
