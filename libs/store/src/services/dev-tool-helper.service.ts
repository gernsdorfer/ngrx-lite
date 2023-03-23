import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class DevToolHelper {
  private _isTimeTravelActive = false;

  setTimeTravelActive(isTimeTravelActive: boolean) {
    this._isTimeTravelActive = isTimeTravelActive;
  }

  isTimeTravelActive(): boolean {
    return this._isTimeTravelActive;
  }
}
