import { CommonModule } from '@angular/common';
import { NO_ERRORS_SCHEMA, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { createVitestSpyObj } from '../../../test-setup';
import { CounterStore } from './counter-service';
import { StorageFromServiceComponent } from './storage-from-service.component';

describe('StorageFromServiceComponent', () => {
  const counterStore = createVitestSpyObj<CounterStore>({
    increment: vi.fn(),
    state: signal({ counter: 0 }),
  });
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
