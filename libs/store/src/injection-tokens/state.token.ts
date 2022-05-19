import { InjectionToken } from '@angular/core';

export const StateToken = new InjectionToken(
  'StateToken'
);
export const StoreNameToken = new InjectionToken<string>('StoreNameToken');
export const SkipLogForStore = new InjectionToken<boolean>('SkipLogForStore');
