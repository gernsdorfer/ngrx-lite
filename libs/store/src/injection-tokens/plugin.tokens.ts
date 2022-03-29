import { InjectionToken } from '@angular/core';
import { ClientStoragePlugin } from '../models';

export const SessionStoragePlugin = new InjectionToken<ClientStoragePlugin>(
  'SessionStoragePlugin'
);
export const LocalStoragePlugin = new InjectionToken<ClientStoragePlugin>(
  'LocalStoragePlugin'
);
