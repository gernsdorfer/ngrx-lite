import '../fixtures/component-loading.json';
import { StoreDevtools } from '@ngrx/store-devtools/src/devtools';

declare global {
  interface Window {
    jumpToAction: StoreDevtools['jumpToAction'];
    importState: StoreDevtools['importState'];
  }
}
describe('TimeTravel with different routes', () => {
  beforeEach(() => {
    cy.visit('/');
  });
  describe('load State from ', () => {
    it('should show increment with loading indicator', () => {
      cy.runStorageFile('component-loading.json', (stateName) =>
        cy.percySnapshot(stateName)
      );
    });
  });
});
