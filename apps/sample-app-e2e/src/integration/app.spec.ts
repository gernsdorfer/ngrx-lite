import '../fixtures/component-loading.json';
import { StoreDevtools } from '@ngrx/store-devtools/src/devtools';
import { describe } from 'mocha';

declare global {
  interface Window {
    jumpToAction: StoreDevtools['jumpToAction'];
    importState: StoreDevtools['importState'];
  }
}
describe('sample-app', () => {
  beforeEach(() => {
    cy.visit('/');
  });
  describe('loadingComponentStore', () => {
    it('should show increment with loading indicator', () => {
      cy.runStorageFile('component-loading.json', (stateName) =>
        cy.percySnapshot(stateName)
      );
    });
  });
});
