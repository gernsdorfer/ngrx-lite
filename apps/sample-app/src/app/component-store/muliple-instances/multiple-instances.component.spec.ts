import { TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MultipleInstancesComponent } from './multiple-instances.component';
import { StorageFromGlobalComponent } from '../global-counter/storage-from-global.component';
import { CommonModule } from '@angular/common';

describe('MultipleInstancesComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  const getComponent = (): MultipleInstancesComponent => {
    const fixture = TestBed.overrideComponent(MultipleInstancesComponent, {
      set: {
        imports: [CommonModule],
        providers: [],
        schemas: [NO_ERRORS_SCHEMA],
      },
    }).createComponent(MultipleInstancesComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();
    return component;
  };
  it('should be defined', () => {
    expect(getComponent()).toBeDefined();
  });
});
