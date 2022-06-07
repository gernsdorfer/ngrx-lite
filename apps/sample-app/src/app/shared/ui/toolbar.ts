import { Component } from '@angular/core';


@Component({
  selector: 'my-app-ui-toolbar',
  template: `
    <mat-toolbar class="toolbar" >
      <button [matMenuTriggerFor]="menuComponentStore" mat-button>
        Component-Store
      </button>
      <mat-menu #menuComponentStore="matMenu">
        <a mat-menu-item class="menu-link" routerLink="/">Basic</a>
        <a mat-menu-item class="menu-link" routerLink="/custom-action">Custom-Action</a>
        <a mat-menu-item class="menu-link" routerLink="/storage-from-global-service">
          Root-Store
        </a>
        <a mat-menu-item class="menu-link" routerLink="/multiple-storage-instances">
          Multiple-Store instances
        </a>
        <a mat-menu-item class="menu-link" routerLink="/storage-from-service">
          Share Store to ChildComponents
        </a>
        <a mat-menu-item class="menu-link" routerLink="/share-actions">
          Share with @ngrx/Effects
        </a>
        <a mat-menu-item class="menu-link" routerLink="/storage">Sync with Storage</a>
        <a mat-menu-item class="menu-link" routerLink="/combine-with-entity">Entity</a>
        <a mat-menu-item class="menu-link" routerLink="/store-without-log">Without Log</a>
      </mat-menu>

      <button [matMenuTriggerFor]="menuLoadingComponentStore" mat-button>
        Loading-Component-Store
      </button>
      <mat-menu #menuLoadingComponentStore="matMenu">
        <a mat-menu-item class="menu-link" routerLink="/loading-basic">Basic</a>
        <a mat-menu-item class="menu-link" routerLink="/loading-with-default-values">
          Loading with default values
        </a>
      </mat-menu>
      <button [matMenuTriggerFor]="menuFormsComponentStore" mat-button>
        Forms-Component-Store
      </button>
      <mat-menu #menuFormsComponentStore="matMenu">
        <a mat-menu-item class="menu-link" routerLink="/persist-form">Basic</a>
      </mat-menu>
    </mat-toolbar>
  `,

})
export class UiToolbarComponent {}
