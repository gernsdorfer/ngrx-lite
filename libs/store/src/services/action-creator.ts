import { createAction, props } from '@ngrx/store';
import { EffectStates } from '../enums';
import { LoadingStoreState } from '../models';
export const getEffectActionName = (effectName: string, type: EffectStates) =>
  `${effectName}:${type}`;

export const getFullStoreName = (
  storeName: string,
  dynamicStoreName?: string | null,
) => [storeName, dynamicStoreName].filter((name) => name !== null).join('');

export const getEffectAction = <
  ARGS extends string = never,
  P extends LoadingStoreState<unknown, unknown> = LoadingStoreState<
    unknown,
    unknown
  >,
>({
  storeName,
  effectName,
  dynamicStoreName,
  type,
}: {
  storeName: string;
  dynamicStoreName?: ARGS;
  effectName: string;
  type: EffectStates;
}) =>
  getCustomAction<P>({
    storeName,
    dynamicStoreName,
    actionName: `${getEffectActionName(effectName, type)}`,
  });

export const getCustomAction = <P extends object>({
  storeName,
  dynamicStoreName,
  actionName,
}: {
  storeName: string;
  dynamicStoreName?: string;
  actionName?: string;
}) =>
  createAction<string, { payload: P }>(
    `[COMPONENT_STORE][${getFullStoreName(
      storeName,
      dynamicStoreName,
    )}] ${actionName}`,
    props(),
  );
