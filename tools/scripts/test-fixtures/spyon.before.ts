import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

describe('NavigationComponent', () => {
  it('should navigate', () => {
    const navigateSpy = spyOn(TestBed.inject(Router), 'navigate');
    navigateSpy.and.returnValue(Promise.resolve(true));

    component.goToPage('/home');

    expect(navigateSpy).toHaveBeenCalledWith(['/home']);
  });
});
