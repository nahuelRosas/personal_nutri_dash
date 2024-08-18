import { useCallback, useReducer } from "react";

import {
  SET_STATUS,
  Action,
  IStatusState,
  type IStatus,
} from "../interfaces/IStatusState";

const initial = {
  status: false,
  error: null,
  loading: false,
};

const initialState: IStatusState = {
  signIn: initial,
  signUp: initial,
  refreshSession: initial,
  signOut: initial,
};

function reducer(state: IStatusState, action: Action): IStatusState {
  const statusType = action.payload;
  const updatedStatus = {
    ...state[statusType],
    ...action.value,
  };

  return {
    ...state,
    [statusType]: updatedStatus,
  };
}

export function useStatusState() {
  const [statusState, dispatch] = useReducer(reducer, initialState);

  const setStatusState = useCallback(
    (statusType: keyof IStatusState, value: Partial<IStatus>) => {
      dispatch({
        type: SET_STATUS,
        payload: statusType,
        value,
      });
    },
    []
  );

  return { statusState, setStatusState };
}
