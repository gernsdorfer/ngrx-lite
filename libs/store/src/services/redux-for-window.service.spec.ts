import { TestBed } from '@angular/core/testing';
import { ReduxForWindowModule } from '@gernsdorfer/ngrx-lite';
import { StoreDevtools } from '@ngrx/store-devtools';

describe('ReduxForWindowModule', () => {
  const storeDevtools = jasmine.createSpyObj<StoreDevtools>(
    'storeDevtools',
    {
      jumpToAction: undefined,
      importState: undefined,
    },
    {}
  );
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ReduxForWindowModule],
      providers: [
        {
          provide: StoreDevtools,
          useValue: storeDevtools,
        },
      ],
      teardown: { destroyAfterEach: false },
    });
  });
  it('should create ', () => {
    const module = TestBed.inject(ReduxForWindowModule);

    expect(module).toBeDefined();
  });

  it('should importState via window', () => {
    TestBed.inject(ReduxForWindowModule);

    window.importState('liftedState');

    expect(storeDevtools.importState).toHaveBeenCalledWith('liftedState');
  });

  it('should jumpToAction via window', () => {
    TestBed.inject(ReduxForWindowModule);

    window.jumpToAction(1);

    expect(storeDevtools.jumpToAction).toHaveBeenCalledWith(1);
  });
});
