import { NO_ERRORS_SCHEMA } from '@angular/core';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { storeTestingFactory } from '@gernsdorfer/ngrx-lite/testing';
import { ReactiveLoadingComponent } from './reactive-loading.component';

describe('ReactiveLoadingComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [storeTestingFactory()],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  const getComponent = (): ReactiveLoadingComponent => {
    const fixture = TestBed.createComponent(ReactiveLoadingComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();
    return component;
  };

  it('should be defined', () => {
    expect(getComponent()).toBeDefined();
  });

  it('should expose the connected store state', () => {
    const component = getComponent();

    expect(component.listStore.state()).toBeDefined();
  });

  it('should populate hits when the query signal is set', fakeAsync(() => {
    const component = getComponent();

    component.query.set('foo');
    TestBed.tick();
    tick(200);

    expect(component.listStore.state().item?.hits).toEqual([
      'foo-1',
      'foo-2',
      'foo-3',
    ]);
  }));
});
