import { Injector } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import {
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { Actions } from '@ngrx/effects';
import { provideMockStore } from '@ngrx/store/testing';
import { cold } from 'jasmine-marbles';
import { EMPTY } from 'rxjs';
import {
  SkipLogForStore,
  StateToken,
  StoreNameToken,
} from '../injection-tokens/state.token';
import { DevToolHelper } from './dev-tool-helper.service';
import { StoreFactory } from './store-factory.service';
import { Store } from './store.service';
import { ComponentLoadingStore } from './stores/component-loading-store.service';
import { ComponentStore } from './stores/component-store.service';

interface MyState {
  myState: string;
  optionalValue?: string;
}

const defaultMyState: MyState = { myState: '' };

describe('StoreFactory', () => {
  const devToolHelper = jasmine.createSpyObj<DevToolHelper>('storeDevtools', {
    isTimeTravelActive: false,
    setTimeTravelActive: undefined,
  });

  const store = jasmine.createSpyObj<Store>('Store', {
    createStoreByStoreType: undefined,
    addReducersForImportState: undefined,
    checkForTimeTravel: undefined,
  });
  const actions = jasmine.createSpyObj<Actions>('Actions', { lift: EMPTY }, {});
  let storeFactory: StoreFactory;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        StoreFactory,
        {
          provide: Store,
          useValue: store,
        },
        {
          provide: Actions,
          useValue: actions,
        },
        provideMockStore({
          initialState: {},
        }),
      ],
      teardown: { destroyAfterEach: false },
    });
    storeFactory = TestBed.inject(StoreFactory);

    store.createStoreByStoreType.and.callFake(
      ({ CreatedStore }) =>
        Injector.create({
          providers: [
            { provide: Actions, useValue: actions },
            { provide: CreatedStore },
            provideMockStore({
              initialState: {},
            }),
            {
              provide: DevToolHelper,
              useValue: devToolHelper,
            },
            { provide: StoreNameToken, useValue: 'Test' },
            { provide: StateToken, useValue: {} },
            { provide: SkipLogForStore, useValue: false },
          ],
        }).get(CreatedStore) as never,
    );
  });

  describe('createComponentStore', () => {
    it('should return a componentStore', () => {
      expect(
        storeFactory.createComponentStore<MyState>({
          storeName: 'myStore',
          defaultState: defaultMyState,
        }),
      ).toBeInstanceOf(ComponentStore);
    });
  });
  describe('createComponentLoadingStore', () => {
    it('should return a createComponentLoadingStore ', () => {
      expect(
        storeFactory.createComponentLoadingStore({
          storeName: 'myStore',
        }),
      ).toBeInstanceOf(ComponentLoadingStore);
    });
  });

  describe('createFormComponentStore', () => {
    const myForm = new UntypedFormGroup(<
      { [index in keyof MyState]: UntypedFormControl }
    >{
      myState: new UntypedFormControl('', [Validators.required]),
      optionalValue: new UntypedFormControl(''),
    });
    const defaultFormState = {
      ...defaultMyState,
      optionalValue: '',
    };
    beforeEach(() => {
      myForm.reset({ ...defaultMyState, optionalValue: '' });
    });

    describe('initialState', () => {
      beforeEach(() => {
        myForm.reset({ ...defaultFormState, optionalValue: '' });
      });

      it('should create  default initial state', () => {
        const store = storeFactory.createFormComponentStore<MyState>({
          storeName: 'myStore',
          formGroup: myForm,
        });

        expect(store).toBeInstanceOf(ComponentStore);
      });
    });

    it('should set formChanges to state', () => {
      const { state$ } = storeFactory.createFormComponentStore<MyState>({
        storeName: 'myStore',
        formGroup: myForm,
      });

      myForm.patchValue({ myState: 'Test' });

      expect(state$).toBeObservable(
        cold('a', {
          a: {
            ...defaultFormState,
            myState: 'Test',
          },
        }),
      );
    });

    it('should set stateChanges to form', () => {
      const store = storeFactory.createFormComponentStore<MyState>({
        storeName: 'myFormStore',
        formGroup: myForm,
      });

      store.setState(<MyState>{
        ...defaultFormState,
        myState: 'newValue',
      });

      expect(myForm.getRawValue()).toEqual({
        ...defaultFormState,
        myState: 'newValue',
      });
    });
  });
});
