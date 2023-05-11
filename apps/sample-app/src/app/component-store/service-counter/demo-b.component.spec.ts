import { CommonModule } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { CounterStore } from './counter-service';
import { DemoBComponent } from './demo-b.component';
import createSpyObj = jasmine.createSpyObj;

describe('DemoBComponent', () => {
  const counterStore = createSpyObj<CounterStore>('CounterStore', {
    increment: undefined,
    state: { counter: 0 },
  });

  const getComponent = (): DemoBComponent => {
    const fixture = TestBed.overrideComponent(DemoBComponent, {
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
    }).createComponent(DemoBComponent);
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
