import { StoreState } from '../models';
import { createAction, props } from '@ngrx/store';
import { EffectStates } from '../enums';

export const getEffectAction = <P extends StoreState<unknown, unknown>>({
  storeName,
  effectName,
  type,
}: {
  storeName: string;
  effectName?: string;
  type: EffectStates;
}) => getCustomAction<P>({ storeName, actionName: `${effectName}:${type}` });

export const getCustomAction = <P extends StoreState<unknown, unknown>>({
  storeName,
  actionName,
}: {
  storeName: string;
  actionName?: string;
}) =>
  createAction<string, { payload: P }>(`[${storeName}] ${actionName}`, props());
