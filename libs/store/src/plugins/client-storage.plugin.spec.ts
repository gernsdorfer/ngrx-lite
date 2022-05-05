import {
  localStoragePlugin,
  sessionStoragePlugin,
} from './client-storage.plugin';

const getSpyGetItem = (storage: Storage) => spyOn(storage, 'getItem');
const getSpySetItem = (storage: Storage) => spyOn(storage, 'setItem');

interface MyState {
  myState: string;
  optionalValue?: string;
}

describe('sessionStorageHandlerForStores', () => {
  let storage: Storage;
  beforeEach(() => {
    storage = window.sessionStorage;
  });

  describe('getDefaultState', () => {
    describe('load data from storage', () => {
      it('should return default state', () => {
        const spyGetItem = getSpyGetItem(storage);

        spyGetItem.and.returnValue(null);

        expect(
          sessionStoragePlugin.getDefaultState<MyState>('testStore1')
        ).toEqual(undefined);
      });

      it('should return state from storage', () => {
        const spyGetItem = getSpyGetItem(storage);
        spyGetItem.and.returnValue(
          JSON.stringify(<MyState>{ myState: 'testValue' })
        );

        expect(
          sessionStoragePlugin.getDefaultState<MyState>('testStore1')
        ).toEqual({ myState: 'testValue' });
      });
    });
  });

  describe('onStateChange', () => {
    it('should set state to storage', () => {
      const spySetItem = getSpySetItem(storage);
      sessionStoragePlugin.setStateToStorage<MyState>('testStore1', {
        myState: 'testValue',
      });

      expect(spySetItem).toHaveBeenCalledWith(
        'testStore1',
        JSON.stringify(<MyState>{ myState: 'testValue' })
      );
    });
  });
});

describe('localStorageHandlerForStores', () => {
  let storage: Storage;
  beforeEach(() => {
    storage = window.localStorage;
  });

  describe('getDefaultState', () => {
    describe('load data from storage', () => {
      it('should return default state', () => {
        const spyGetItem = getSpyGetItem(storage);

        spyGetItem.and.returnValue(null);

        expect(localStoragePlugin.getDefaultState('testStore1')).toEqual(
          undefined
        );
      });

      it('should return state from storage', () => {
        const spyGetItem = getSpyGetItem(storage);
        spyGetItem.and.returnValue(
          JSON.stringify(<MyState>{ myState: 'testValue' })
        );

        expect(
          localStoragePlugin.getDefaultState<MyState>('testStore1')
        ).toEqual({
          myState: 'testValue',
        });
      });
    });
  });

  describe('onStateChange', () => {
    it('should set state to storage', () => {
      const spySetItem = getSpySetItem(storage);
      localStoragePlugin.setStateToStorage('testStore1', { isLoading: false });

      expect(spySetItem).toHaveBeenCalledWith(
        'testStore1',
        JSON.stringify({ isLoading: false })
      );
    });
  });
});
