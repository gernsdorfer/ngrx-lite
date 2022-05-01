import { TestBed } from '@angular/core/testing';
import { BasicComponent } from './basic.component';
import { storeTestingFactory } from '@gernsdorfer/ngrx-lite/testing';
import {cold} from "jasmine-marbles";
import {getDefaultState} from "@gernsdorfer/ngrx-lite";

describe('BasicExampleComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BasicComponent],
      providers: [storeTestingFactory()],
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

  describe('increment' , () => {
    it('should increment state', ( )=> {
      const component = getApp().component;

      component.increment();
      component.increment();

      expect(component.counterState$).toBeObservable(cold('a',{
        a: {
          ...getDefaultState(),
          item: 2
        }
      }))
    })
  })
});
