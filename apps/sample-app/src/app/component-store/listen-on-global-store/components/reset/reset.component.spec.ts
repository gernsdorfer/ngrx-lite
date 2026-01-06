import { CommonModule } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { createVitestSpyObj } from '@ngrx-lite/testing';
import { Store } from '@ngrx/store';
import { vi } from 'vitest';
import { resetAction } from '../../actions/reset.action';
import { ResetComponent } from './reset.component';

describe('MultipleInstancesComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        {
          provide: Store,
          useValue: store,
        },
      ],
    });
  });
  const store = createVitestSpyObj<Store>({
    dispatch: vi.fn(),
  });
  const getComponent = (): ResetComponent => {
    const fixture = TestBed.overrideComponent(ResetComponent, {
      set: {
        imports: [CommonModule],
        providers: [
          {
            provide: Store,
            useValue: store,
          },
        ],
        schemas: [NO_ERRORS_SCHEMA],
      },
    }).createComponent(ResetComponent);
    const component = fixture.componentInstance;

    fixture.detectChanges();
    return component;
  };
  it('should be defined', () => {
    expect(getComponent()).toBeDefined();
  });

  describe('reset', () => {
    it('should dispatch reset', () => {
      const component = getComponent();
      store.dispatch.mockClear();

      component.reset();

      expect(store.dispatch).toHaveBeenCalledWith(resetAction());
    });
  });
});
