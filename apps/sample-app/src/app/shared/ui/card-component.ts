import { Component } from '@angular/core';

@Component({
  selector: 'my-app-ui-card',
  styles: [
    `
      .demo-card {
        max-width: 400px;
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
      <mat-card-actions>
        <ng-content select="[actions]"></ng-content>
      </mat-card-actions>
    </mat-card>
  `,
})
export class UiCardComponent {}
