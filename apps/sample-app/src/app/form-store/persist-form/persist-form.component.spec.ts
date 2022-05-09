import { TestBed } from '@angular/core/testing';
import { PersistFormComponent } from './persist-form.component';
import { storeTestingFactory } from '@gernsdorfer/ngrx-lite/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('BasicExampleComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PersistFormComponent],
      providers: [storeTestingFactory()],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  const getComponent = (): PersistFormComponent => {
    const fixture = TestBed.createComponent(PersistFormComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();
    return component;
  };

  it('should be defined', () => {
    expect(getComponent()).toBeDefined();
  });
});
