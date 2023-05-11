import { CommonModule } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { CounterStore } from './counter-service';
import { DemoAComponent } from './demo-a.component';
import createSpyObj = jasmine.createSpyObj;

describe('DemoAComponent', () => {
  const counterStore = createSpyObj<CounterStore>('CounterStore', {
    increment: undefined,
    state: { counter: 0 },
  });

  const getComponent = (): DemoAComponent => {
    const fixture = TestBed.overrideComponent(DemoAComponent, {
      set: {
        imports: [CommonModule],
        providers: [
          {
            provide: CounterStore,
            useValue: counterStore,
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
      counterStore.increment.calls.reset();

      component.increment();

      expect(counterStore.increment).toHaveBeenCalled();
    });
  });
});
