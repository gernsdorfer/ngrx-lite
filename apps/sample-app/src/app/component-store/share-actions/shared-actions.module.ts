import { importProvidersFrom } from '@angular/core';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { Routes } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';
import { DemoEffect } from './my-effect.effect';

export default <Routes>[
  {
    path: '',
    loadComponent: () => import('./shared-action.component'),
    providers: [
      importProvidersFrom(
        MatSnackBarModule,
        EffectsModule.forFeature([DemoEffect])
      ),
    ],
  },
];
