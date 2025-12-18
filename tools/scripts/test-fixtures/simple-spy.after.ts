import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { vi } from 'vitest';
import { resetAction } from '../../actions/reset.action';
import { ResetComponent } from './reset.component';

describe('MultipleInstancesComponent', () => {
  const store = vi.mocked<Store>({
    dispatch: vi.fn(),
  });

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

  it('should dispatch reset', () => {
    const component = getComponent();
    vi.clearAllMocks();

    component.reset();

    expect(store.dispatch).toHaveBeenCalledWith(resetAction());
  });
});
