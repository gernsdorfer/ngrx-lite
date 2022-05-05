import { TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { EMPTY } from 'rxjs';
import { MultipleCounterStore } from './counter-service';
import { DemoAComponent } from './demo-a.component';
import createSpyObj = jasmine.createSpyObj;

describe('DemoAComponent', () => {
  const multipleCounterStore = createSpyObj<MultipleCounterStore>(
    'GlobalCounterStore',
    {
      increment: undefined,
    },
    {
      counterState$: EMPTY,
    }
  );
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DemoAComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
    TestBed.overrideProvider(MultipleCounterStore, {
      useValue: multipleCounterStore,
    });
  });

  const getComponent = (): DemoAComponent => {
    const fixture = TestBed.createComponent(DemoAComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();
    return component;
  };
  it('should be defined', () => {
    expect(getComponent()).toBeDefined();
  });

  describe('increment', () => {
    it('should call increment', () => {
      const component = getComponent();
      multipleCounterStore.increment.calls.reset();

      component.increment();

      expect(multipleCounterStore.increment).toHaveBeenCalled();
    });
  });
});
