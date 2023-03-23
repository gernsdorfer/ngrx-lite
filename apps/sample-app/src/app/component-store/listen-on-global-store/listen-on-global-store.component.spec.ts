import { CommonModule } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ListenOnGlobalStoreComponent } from './listen-on-global-store.component';

describe('MultipleInstancesComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  const getComponent = (): ListenOnGlobalStoreComponent => {
    const fixture = TestBed.overrideComponent(ListenOnGlobalStoreComponent, {
      set: {
        imports: [CommonModule],
        providers: [],
        schemas: [NO_ERRORS_SCHEMA],
      },
    }).createComponent(ListenOnGlobalStoreComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();
    return component;
  };
  it('should be defined', () => {
    expect(getComponent()).toBeDefined();
  });
});
