import { nanoid } from 'nanoid';

import { FlashState, State } from '../../../redux/types';
import { playTone } from '../../../utils/tone';
import { FlashMessages } from './flash-messages';

export const FlashApp = 'flash';

export const sagas = [];

export const flashMessageSelector = (state: State): FlashState['message'] =>
  state[FlashApp].message;

// ACTION DEFINITIONS

enum FlashActionTypes {
  CreateFlashMessage = 'createFlashMessage',
  RemoveFlashMessage = 'removeFlashMessage'
}

export type FlashMessageArg = {
  type: string;
  message: FlashMessages;
  variables?: Record<string, unknown>;
};

const initialState = {
  message: {
    id: '',
    type: '',
    message: FlashMessages.None
  }
};

export const createFlashMessage = (
  flash: FlashMessageArg
): ReducerPayload<FlashActionTypes.CreateFlashMessage> => {
  // Do not play tone if flash comes from Nightmode toggle
  console.log('flash, aaah', flash);
  if (flash.message !== FlashMessages.None && !flash.variables?.theme) {
    void playTone(flash.message);
  }
  return {
    type: FlashActionTypes.CreateFlashMessage,
    payload: { ...flash, id: nanoid() }
  };
};

export const removeFlashMessage =
  (): ReducerPayload<FlashActionTypes.RemoveFlashMessage> => ({
    type: FlashActionTypes.RemoveFlashMessage
  });

// REDUCER
type ReducerBase<T> = { type: T };
type ReducerPayload<T extends FlashActionTypes> =
  T extends FlashActionTypes.CreateFlashMessage
    ? ReducerBase<T> & {
        payload: FlashState['message'];
      }
    : ReducerBase<T>;

// Does reducer return FlashState or AppState (whole app)?
export const reducer = (
  state: FlashState = initialState,
  action: ReducerPayload<FlashActionTypes>
): FlashState => {
  switch (action.type) {
    case FlashActionTypes.CreateFlashMessage:
      return { ...state, message: action.payload };
    case FlashActionTypes.RemoveFlashMessage:
      return { ...state, message: initialState.message };
    default:
      return state;
  }
};
