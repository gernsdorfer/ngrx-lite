import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { storeTestingFactory } from '@gernsdorfer/ngrx-lite/testing';
import { OptionSkipWhenComponent } from './option-skip-when.component';

describe('OptionSkipWhenComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [storeTestingFactory()],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  const getComponent = (): OptionSkipWhenComponent => {
    const fixture = TestBed.createComponent(OptionSkipWhenComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();
    return component;
  };

  it('should be defined', () => {
    expect(getComponent()).toBeDefined();
  });

  it('should load when skip flag is false', () => {
    const component = getComponent();

    component.load();

    expect(component.executeCount).toBe(1);
    expect(component.state().item?.value).toBe('loaded #1');
  });

  it('should not load when skip flag is true', () => {
    const component = getComponent();
    component.toggleSkip();

    component.load();

    expect(component.executeCount).toBe(0);
    expect(component.state().item).toBeUndefined();
  });

  it('should resume loading after skip flag is toggled back', () => {
    const component = getComponent();
    component.toggleSkip();
    component.load();
    component.toggleSkip();

    component.load();

    expect(component.executeCount).toBe(1);
  });
});
