import { TestBed } from '@angular/core/testing';
import { StoreDevtools } from '@ngrx/store-devtools';
import { ReduxForWindowModule } from './redux-for-window.service';

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
});
