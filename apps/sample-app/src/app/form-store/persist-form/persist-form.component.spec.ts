import { TestBed } from '@angular/core/testing';
import { PersistFormComponent } from './persist-form.component';
import { storeTestingFactory } from '@gernsdorfer/ngrx-lite/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

describe('BasicExampleComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [storeTestingFactory()],
      schemas: [NO_ERRORS_SCHEMA],
    });
  });

  const getComponent = (): PersistFormComponent => {
    const fixture = TestBed.overrideComponent(PersistFormComponent, {
      set: {
        imports: [CommonModule],
        schemas: [NO_ERRORS_SCHEMA],
      },
    }).createComponent(PersistFormComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();
    return component;
  };

  it('should be defined', () => {
    expect(getComponent()).toBeDefined();
  });
});
