import { TestBed } from '@angular/core/testing';
import { RouterStore } from './router-service';
import { RouterStoreModule } from './router-store.module';

describe('RouterStoreModule', () => {
  const routerStore = jasmine.createSpyObj<RouterStore>('router', {
    init: undefined,
  });
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterStoreModule],
      providers: [{ provide: RouterStore, useValue: routerStore }],
      teardown: { destroyAfterEach: false },
    });
  });
  it('should create ', () => {
    const module = TestBed.inject(RouterStoreModule);

    expect(module).toBeDefined();
    expect(routerStore.init).toHaveBeenCalled();
  });
});
