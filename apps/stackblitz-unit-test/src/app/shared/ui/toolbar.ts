import { Component } from '@angular/core';

@Component({
  selector: 'my-app-ui-toolbar',

  template: `
    <mat-toolbar>
      <button [matMenuTriggerFor]="menuComponentStore" mat-button>
        Component-Store
      </button>
      <mat-menu #menuComponentStore="matMenu">
        <a mat-menu-item routerLink="/">Basic</a>
        <a mat-menu-item routerLink="/custom-action">Custom-Action</a>
        <a mat-menu-item routerLink="/storage-from-global-service">
          Root-Store
        </a>
        <a mat-menu-item routerLink="/multiple-storage-instances">
          Multiple-Store instances
        </a>
        <a mat-menu-item routerLink="/storage-from-service">
          Store from Service (Provided in Module)
        </a>
        <a mat-menu-item routerLink="/share-actions">
          Share with @ngrx/Effects
        </a>
        <a mat-menu-item routerLink="/storage">Sync with Storage</a>
        <a mat-menu-item routerLink="/combine-with-entity">Entity</a>
      </mat-menu>

      <button [matMenuTriggerFor]="menuLoadingComponentStore" mat-button>
        Loading-Component-Store
      </button>
      <mat-menu #menuLoadingComponentStore="matMenu">
        <a mat-menu-item routerLink="/loading-basic">Basic</a>
        <a mat-menu-item routerLink="/loading-with-default-values">
          Loading with default values
        </a>
      </mat-menu>
      <button [matMenuTriggerFor]="menuFormsComponentStore" mat-button>
        Forms-Component-Store
      </button>
      <mat-menu #menuFormsComponentStore="matMenu">
        <a mat-menu-item routerLink="/persist-form">Basic</a>
      </mat-menu>
    </mat-toolbar>
  `,
})
export class UiToolbarComponent {}