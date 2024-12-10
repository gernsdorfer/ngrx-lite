import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'my-app-ui-card',
  styles: [
    `
      .demo-card {
        max-width: 400px;
      }
      .actions {
        display: flex;
        width: 100%;
        justify-content: space-around;
      }
    `,
  ],
  template: `
    <mat-card class="demo-card">
      <mat-card-header>
        <mat-card-title>
          <ng-content select="[title]"></ng-content>
        </mat-card-title>
        <mat-card-subtitle>
          <ng-content select="[subtitle]"></ng-content>
        </mat-card-subtitle>
      </mat-card-header>
      <mat-card-content>
        <ng-content select="[content]"></ng-content>
      </mat-card-content>
      <mat-card-actions class="actions">
        <ng-content select="[actions]"></ng-content>
      </mat-card-actions>
    </mat-card>
  `,
  imports: [MatCardModule, MatMenuModule, MatButtonModule],
})
export class UiCardComponent {}
