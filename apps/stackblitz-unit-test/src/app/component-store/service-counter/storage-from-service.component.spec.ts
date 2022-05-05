import { TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { EMPTY } from 'rxjs';
import { StorageFromServiceComponent } from './storage-from-service.component';
import { CounterStore } from './counter-service';
import createSpyObj = jasmine.createSpyObj;

describe('StorageFromServiceComponent', () => {
  const counterStore = createSpyObj<CounterStore>(
    'CounterStore',
    {
      increment: undefined,
    },
    {
      counterState$: EMPTY,
    }
  );
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StorageFromServiceComponent],
      providers: [{ provide: CounterStore, useValue: counterStore }],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  const getComponent = (): StorageFromServiceComponent => {
    const fixture = TestBed.createComponent(StorageFromServiceComponent);
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
