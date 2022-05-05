import { TestBed } from '@angular/core/testing';
import { BasicComponent, MyState } from './basic.component';
import { storeTestingFactory } from '@gernsdorfer/ngrx-lite/testing';
import { cold } from 'jasmine-marbles';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('BasicExampleComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BasicComponent],
      providers: [storeTestingFactory()],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  const getApp = () => {
    const fixture = TestBed.createComponent(BasicComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();
    return {
      component,
    };
  };
  it('should be defined', () => {
    expect(getApp()).toBeDefined();
  });

  describe('increment', () => {
    it('should increment state', () => {
      const component = getApp().component;

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
