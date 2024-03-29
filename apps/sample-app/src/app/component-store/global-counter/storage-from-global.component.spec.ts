import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { GlobalCounterStore } from './global-counter.service';
import { StorageFromGlobalComponent } from './storage-from-global.component';
import createSpyObj = jasmine.createSpyObj;

describe('StorageFromGlobalComponent', () => {
  const globalCounterStore = createSpyObj<GlobalCounterStore>(
    'GlobalCounterStore',
    {
      increment: undefined,
      state: { counter: 0 },
    },
    {}
  );
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: GlobalCounterStore, useValue: globalCounterStore },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    });
  });

  const getComponent = (): StorageFromGlobalComponent => {
    const fixture = TestBed.createComponent(StorageFromGlobalComponent);
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
      globalCounterStore.increment.calls.reset();

      component.increment();

      expect(globalCounterStore.increment).toHaveBeenCalled();
    });
  });
});
