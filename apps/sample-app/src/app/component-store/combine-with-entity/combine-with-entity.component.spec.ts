import { TestBed } from '@angular/core/testing';
import { CombineWithEntityComponent, MyState } from './combine-with-entity.component';
import { storeTestingFactory } from '@gernsdorfer/ngrx-lite/testing';
import { cold } from 'jasmine-marbles';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('BasicExampleComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CombineWithEntityComponent],
      providers: [storeTestingFactory()],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  const getComponent = (): CombineWithEntityComponent => {
    const fixture = TestBed.createComponent(CombineWithEntityComponent);
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
