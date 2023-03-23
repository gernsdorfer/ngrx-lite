import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { storeTestingFactory } from '@gernsdorfer/ngrx-lite/testing';
import { cold } from 'jasmine-marbles';
import { MyState, SharedActionComponent } from './shared-action.component';

describe('SharedActionComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SharedActionComponent],
      providers: [storeTestingFactory()],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  const getComponent = (): SharedActionComponent => {
    const fixture = TestBed.createComponent(SharedActionComponent);
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

      component.increment();

      expect(component.counterState$).toBeObservable(
        cold('a', {
          a: <MyState>{
            counter: 1,
          },
        })
      );
    });
  });
});
