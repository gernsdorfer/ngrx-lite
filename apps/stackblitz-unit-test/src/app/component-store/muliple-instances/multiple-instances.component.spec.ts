import { TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MultipleInstancesComponent } from './multiple-instances.component';

describe('StorageFromGlobalServiceComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MultipleInstancesComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  const getComponent = (): MultipleInstancesComponent => {
    const fixture = TestBed.createComponent(MultipleInstancesComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();
    return component;
  };
  it('should be defined', () => {
    expect(getComponent()).toBeDefined();
  });
});
