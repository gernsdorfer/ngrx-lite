import { CommonModule } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { CounterStore } from './counter-service';
import { StorageFromServiceComponent } from './storage-from-service.component';
import createSpyObj = jasmine.createSpyObj;

describe('StorageFromServiceComponent', () => {
  const counterStore = createSpyObj<CounterStore>(
    'CounterStore',
    {
      increment: undefined,
      state: undefined,
    },
    {}
  );
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [],
      providers: [{ provide: CounterStore, useValue: counterStore }],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  const getComponent = (): StorageFromServiceComponent => {
    const fixture = TestBed.overrideComponent(StorageFromServiceComponent, {
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
    }).createComponent(StorageFromServiceComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();
    return component;
  };
  it('should be defined', () => {
    expect(getComponent()).toBeDefined();
  });
});
