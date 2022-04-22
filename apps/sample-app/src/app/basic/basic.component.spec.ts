import { TestBed } from '@angular/core/testing';
import { BasicExampleComponent } from './basic.component';
import { storeTestingFactory } from '@gernsdorfer/ngrx-lite/testing';
import {cold} from "jasmine-marbles";
import {getDefaultState} from "@gernsdorfer/ngrx-lite";

describe('BasicExampleComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BasicExampleComponent],
      providers: [storeTestingFactory()],
    }).compileComponents();
  });

  const getApp = () => {
    const fixture = TestBed.createComponent(BasicExampleComponent);
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

      component.increment(undefined);
      component.increment(1);

      expect(component.counterState$).toBeObservable(cold('a',{
        a: {
          ...getDefaultState(),
          item: 2
        }
      }))
    })
  })
});
