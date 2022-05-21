import '../fixtures/component-loading.json';
import { StoreDevtools } from '@ngrx/store-devtools/src/devtools';

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

  it('Change UI after Store is updated', () => {
    cy.runStorageFile('component-loading.json', (stateName) =>
      cy.percySnapshot(stateName)
    );
  });
});
