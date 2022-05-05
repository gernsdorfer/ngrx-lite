import { TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { EMPTY } from 'rxjs';
import { MultipleCounterStore } from './counter-service';
import { DemoBComponent } from './demo-b.component';
import createSpyObj = jasmine.createSpyObj;

describe('DemoBComponent', () => {
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
      declarations: [DemoBComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
    TestBed.overrideProvider(MultipleCounterStore, {
      useValue: multipleCounterStore,
    });
  });

  const getComponent = (): DemoBComponent => {
    const fixture = TestBed.createComponent(DemoBComponent);
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
