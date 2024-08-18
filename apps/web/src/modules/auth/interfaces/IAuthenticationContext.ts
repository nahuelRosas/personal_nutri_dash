import { IStatusState } from "./IStatusState";

export interface IAuthenticationContext {
  handleSignIn: (email: string, password: string) => Promise<void>;
  handleSignUp: (email: string, password: string) => Promise<void>;
  handleRefreshSession: () => Promise<void>;
  handleSignOut: () => void;
  statusState: IStatusState;
}
