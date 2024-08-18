export type ErrorValue = string[] | string | null;

export interface IStatus {
  status: boolean;
  error: ErrorValue;
  loading: boolean;
}

export interface IStatusState {
  signIn: IStatus;
  signUp: IStatus;
  refreshSession: IStatus;
  signOut: IStatus;
}

export type ActionType = "SET_STATUS";
export const SET_STATUS = "SET_STATUS";

export interface Action {
  type: ActionType;
  payload: keyof IStatusState;
  value: Partial<IStatus>;
}
