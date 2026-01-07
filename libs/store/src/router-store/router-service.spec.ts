import { TestBed } from '@angular/core/testing';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { cold, getTestScheduler } from 'jasmine-marbles';
import { defer, EMPTY } from 'rxjs';
import { storeTestingFactory } from '../../testing';
import { RouterStore } from './router-service';

describe('RouterStore', () => {
  let events$: Router['events'] = EMPTY;
  const router = {
    navigateByUrl: vi
      .fn()
      .mockName('router.navigateByUrl')
      .mockReturnValue(undefined),
    url: '/my-current-curl',
    events: defer(() => events$),
  };

  let routerStore: RouterStore;
  beforeEach(() => {
    router.navigateByUrl.mockResolvedValue(true);
    TestBed.configureTestingModule({
      providers: [storeTestingFactory(), { provide: Router, useValue: router }],
      teardown: { destroyAfterEach: false },
    });
    routerStore = TestBed.inject<RouterStore>(RouterStore);
  });
  it('should be created', () => {
    expect(routerStore).toBeDefined();
  });

  it('should navidate and setState for URL Change', () => {
    events$ = cold('a-b--c', {
      a: new NavigationStart(1, '/myPath'),
      b: new NavigationEnd(1, '/myPath', 'my-current-curl'),
      c: new NavigationEnd(1, '/myPath', 'new-url'),
    });

    getTestScheduler().run(({ flush }) => {
      routerStore.init();
      flush();

      expect(routerStore.state$).toBeObservable(
        cold('51ms a', {
          a: {
            url: 'new-url',
          },
        }),
      );
      expect(router.navigateByUrl).toHaveBeenCalledWith('new-url');
    });
  });
});
