import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { resetAction } from '../../actions/reset.action';
import { ResetComponent } from './reset.component';
import createSpyObj = jasmine.createSpyObj;

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
  const store = createSpyObj<Store>('Store', {
    dispatch: undefined,
  });

  it('should dispatch reset', () => {
    const component = getComponent();
    store.dispatch.calls.reset();

    component.reset();

    expect(store.dispatch).toHaveBeenCalledWith(resetAction());
  });
});
