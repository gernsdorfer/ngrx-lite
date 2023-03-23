import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { storeTestingFactory } from '@gernsdorfer/ngrx-lite/testing';
import { cold } from 'jasmine-marbles';
import {
  MyState,
  StoreWithoutLogComponent,
} from './store-without-log.component';

describe('StoreWithoutLogComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [],
      providers: [storeTestingFactory()],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  const getComponent = (): StoreWithoutLogComponent => {
    const fixture = TestBed.createComponent(StoreWithoutLogComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();
    return component;
  };

  it('should be defined', () => {
    expect(getComponent()).toBeDefined();
  });

  describe('increment', () => {
    it('should increment state', () => {
      const component = getComponent();

      component.increment(2);

      expect(component.counterState$).toBeObservable(
        cold('a', {
          a: <MyState>{
            counter: 2,
          },
        })
      );
    });
  });
});
