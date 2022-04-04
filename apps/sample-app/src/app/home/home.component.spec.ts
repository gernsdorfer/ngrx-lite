import { TestBed } from '@angular/core/testing';
import { getDefaultState, StoreState } from '@gernsdorfer/ngrx-lite';
import { cold } from 'jasmine-marbles';
import { storeTestingFactory } from '@gernsdorfer/ngrx-lite/testing';
import {HomeComponent} from "./home.component";

describe('HomeComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HomeComponent],
      providers: [storeTestingFactory()],
    }).compileComponents();
  });

  const getComponent = () => {
    const fixture = TestBed.createComponent(HomeComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();
    return {
      component,
    };
  };

  it('should be defined', () => {
    expect(getComponent()).toBeDefined();
  });
});
