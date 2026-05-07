import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { storeTestingFactory } from '@gernsdorfer/ngrx-lite/testing';
import { OptionAutoLoadComponent } from './option-auto-load.component';

describe('OptionAutoLoadComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [storeTestingFactory()],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  const getComponent = (): OptionAutoLoadComponent => {
    const fixture = TestBed.createComponent(OptionAutoLoadComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();
    return component;
  };

  it('should be defined', () => {
    expect(getComponent()).toBeDefined();
  });

  it('should auto-load on mount', async () => {
    const component = getComponent();

    await Promise.resolve();

    expect(component.executeCount).toBe(1);
    expect(component.configState().item?.config).toMatch(/loaded at/);
  });

  it('should reload on demand', async () => {
    const component = getComponent();
    await Promise.resolve();

    component.reload();

    expect(component.executeCount).toBe(2);
  });
});
