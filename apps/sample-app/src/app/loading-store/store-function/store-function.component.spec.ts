import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import {
  createStoreAsFnTest,
  storeTestingFactory,
} from '@gernsdorfer/ngrx-lite/testing';
import { myFactoryStore } from './dynamic-store';
import { StoreFunctionComponent } from './store-function.component';
import createSpyObj = jasmine.createSpyObj;

describe('LoadingWithSignalEffectsComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [storeTestingFactory()],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });
  const store = createSpyObj<createStoreAsFnTest<typeof myFactoryStore>>({});
  const getComponent = (): StoreFunctionComponent => {
    const fixture = TestBed.createComponent(StoreFunctionComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();
    return component;
  };

  it('should be defined', () => {
    expect(getComponent()).toBeDefined();
  });
});
