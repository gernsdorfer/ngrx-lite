import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'my-app-ui-toolbar',
  template: `
    <mat-toolbar class="toolbar">
      <button [matMenuTriggerFor]="menuComponentStore" mat-button>
        Component-Store
      </button>
      <mat-menu #menuComponentStore="matMenu">
        <a class="menu-link" mat-menu-item routerLink="/">Basic</a>
        <a class="menu-link" mat-menu-item routerLink="/custom-action"
          >Custom-Action</a
        >
        <a
          class="menu-link"
          mat-menu-item
          routerLink="/storage-from-global-service"
        >
          Root-Store
        </a>
        <a
          class="menu-link"
          mat-menu-item
          routerLink="/multiple-storage-instances"
        >
          Multiple-Store instances
        </a>
        <a class="menu-link" mat-menu-item routerLink="/storage-from-service">
          Share Store to ChildComponents
        </a>
        <a class="menu-link" mat-menu-item routerLink="/listen-on-global-store">
          Listen on global store
        </a>

        <a class="menu-link" mat-menu-item routerLink="/share-actions">
          Share with &#64;ngrx/Effects
        </a>
        <a class="menu-link" mat-menu-item routerLink="/storage"
          >Sync with Storage</a
        >
        <a class="menu-link" mat-menu-item routerLink="/combine-with-entity"
          >Entity</a
        >
        <a class="menu-link" mat-menu-item routerLink="/store-without-log"
          >Without Log</a
        >
      </mat-menu>

      <button [matMenuTriggerFor]="menuLoadingComponentStore" mat-button>
        Loading-Component-Store
      </button>
      <mat-menu #menuLoadingComponentStore="matMenu">
        <a class="menu-link" mat-menu-item routerLink="/loading-basic">Basic</a>
        <a
          class="menu-link"
          mat-menu-item
          routerLink="/loading-with-default-values"
        >
          Loading with default values
        </a>
        <a
          class="menu-link"
          mat-menu-item
          routerLink="/loading-with-signal-effects"
          >with Signal Effects</a
        >
      </mat-menu>
      <button [matMenuTriggerFor]="menuFormsComponentStore" mat-button>
        Forms-Component-Store
      </button>
      <mat-menu #menuFormsComponentStore="matMenu">
        <a class="menu-link" mat-menu-item routerLink="/persist-form">Basic</a>
      </mat-menu>
    </mat-toolbar>
  `,
  standalone: true,
  imports: [MatToolbarModule, MatMenuModule, MatButtonModule, RouterModule],
})
export class UiToolbarComponent {}
