import { createAction, props } from '@ngrx/store';
import { EffectStates } from '../enums';
import { LoadingStoreState } from '../models';
export const getEffectActionName = (effectName: string, type: EffectStates) =>
  `${effectName}:${type}`;
export const getEffectAction = <P extends LoadingStoreState<unknown, unknown>>({
  storeName,
  effectName,
  type,
}: {
  storeName: string;
  effectName: string;
  type: EffectStates;
}) =>
  getCustomAction<P>({
    storeName,
    actionName: `${getEffectActionName(effectName, type)}`,
  });

export const getCustomAction = <P extends object>({
  storeName,
  actionName,
}: {
  storeName: string;
  actionName?: string;
}) =>
  createAction<string, { payload: P }>(
    `[COMPONENT_STORE][${storeName}] ${actionName}`,
    props(),
  );
