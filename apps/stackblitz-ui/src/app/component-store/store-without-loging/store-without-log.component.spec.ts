import { TestBed } from '@angular/core/testing';
import { StoreWithoutLogComponent, MyState } from './store-without-log.component';
import { storeTestingFactory } from '@gernsdorfer/ngrx-lite/testing';
import { cold } from 'jasmine-marbles';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('StoreWithoutLogComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StoreWithoutLogComponent],
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
