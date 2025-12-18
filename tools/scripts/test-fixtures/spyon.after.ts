import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { vi } from 'vitest';

describe('NavigationComponent', () => {
  it('should navigate', () => {
    const navigateSpy = vi.spyOn(TestBed.inject(Router), 'navigate');
    navigateSpy.mockReturnValue(Promise.resolve(true));

    component.goToPage('/home');

    expect(navigateSpy).toHaveBeenCalledWith(['/home']);
  });
});
