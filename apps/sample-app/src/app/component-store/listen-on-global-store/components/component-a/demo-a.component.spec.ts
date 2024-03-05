import { CommonModule } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { MultipleCounterStore } from '../../services/counter-service';
import { DemoAComponent } from './demo-a.component';
import createSpyObj = jasmine.createSpyObj;

describe('DemoAComponent', () => {
  let onReset: () => void;
  const multipleCounterStore = createSpyObj<MultipleCounterStore>(
    'GlobalCounterStore',
    {
      increment: undefined,
      ngOnDestroy: undefined,
      onReset: undefined,
      state: { counter: 0 },
    },
  );
  multipleCounterStore.onReset.and.callFake((cb: () => void) => (onReset = cb));

  const getComponent = (): DemoAComponent => {
    const fixture = TestBed.overrideComponent(DemoAComponent, {
      set: {
        imports: [CommonModule],
        providers: [
          {
            provide: MultipleCounterStore,
            useValue: multipleCounterStore,
          },
        ],
        schemas: [NO_ERRORS_SCHEMA],
      },
    }).createComponent(DemoAComponent);
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

  describe('onReset', () => {
    it('should increment counterReset', () => {
      const component = getComponent();
      component.counterReset = 0;

      onReset();

      expect(component.counterReset).toBe(1);
    });
  });
});
