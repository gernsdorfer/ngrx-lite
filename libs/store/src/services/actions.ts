import { EffectStates } from './store';
import {  StoreState } from '../models';
import { createAction, props } from '@ngrx/store';

export const getEffectAction = <P extends StoreState<unknown, unknown>>({
  storeName,
  effectName,
  type,
}: {
  storeName: string;
  effectName?: string;
  type: EffectStates;
}) =>
  createAction<string, { payload: P }>(
    `[${storeName}] ${effectName}:${type}`,
    props()
  );

export const getCustomAction = <P extends StoreState<unknown, unknown>>({
  storeName,
  actionName,
}: {
  storeName: string;
  actionName?: string;
}) =>
  createAction<string, { payload: P }>(`[${storeName}] ${actionName}`, props());