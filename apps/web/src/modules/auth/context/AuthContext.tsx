import { createContext, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";

import { useStatusState } from "../hooks/useStatusState";
import { IAuthenticationContext } from "../interfaces/IAuthenticationContext";
import {
  CONFIRMATION_SENT_MESSAGE,
  SIGN_IN_SUCCESS_MESSAGE,
  SIGN_OUT_SUCCESS_MESSAGE,
  SIGN_UP_SUCCESS_MESSAGE,
  UNRECOGNIZED_TOKEN_ERROR,
} from "../message/auth-messages";
import { authService } from "../services/auth.service";

import { ApiResponseError } from "@/config/axios/errors/ApiResponseError";
import { apiService } from "@/config/axios/services/api.service";
import { StoredCookies } from "@/modules/cookies/interfaces/cookies.enum";
import { cookieService } from "@/modules/cookies/services/cookie.service";
import { useToast } from "@chakra-ui/react";

export const AuthContext = createContext<IAuthenticationContext | null>(null);

export function AuthProvider({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const { statusState, setStatusState } = useStatusState();

  const navigate = useNavigate();
  const toast = useToast();

  const handleSignUp = useCallback(
    async (email: string, password: string) => {
      async function signUp(email: string, password: string) {
        setStatusState("signUp", {
          loading: true,
        });
        try {
          const response = await authService.signUp(email, password);
          if (response.success && response.statusCode === 201) {
            toast({
              title: SIGN_UP_SUCCESS_MESSAGE,
              description: CONFIRMATION_SENT_MESSAGE,
              status: "success",
            });
            setStatusState("signUp", {
              status: true,
              error: null,
              loading: false,
            });
            navigate("/auth/login");
          } else {
            throw new Error("Failed to sign up");
          }
        } catch (error) {
          setStatusState("signUp", {
            status: false,
            error: null,
            loading: false,
          });
          if (error instanceof ApiResponseError) {
            setStatusState("signUp", { error: error.details.description });
            toast({
              title: `${error.error} - ${error.message}`,
              description: error.details.description,
              status: "error",
            });
          } else {
            toast({
              title: "Error",
              description: `Unknown error when requesting creation of user: ${error}`,
              status: "error",
            });
          }
        } finally {
          setStatusState("signUp", {
            loading: false,
          });
        }
      }
      return signUp(email, password);
    },
    [navigate, setStatusState, toast]
  );

  const handleSignIn = useCallback(
    async (email: string, password: string) => {
      async function signIn(email: string, password: string) {
        setStatusState("signIn", {
          loading: true,
          error: null,
        });
        try {
          const response = await authService.signIn(email, password);
          const { payload } = response;
          const { accessToken, refreshToken } = payload;

          const decodedToken = cookieService.decodeToken(refreshToken);
          if (!decodedToken) throw new Error(UNRECOGNIZED_TOKEN_ERROR);

          cookieService.setAccessTokenCookie(accessToken);
          cookieService.setRefreshTokenCookie(refreshToken, decodedToken.exp);
          cookieService.setEmailCookie(email, decodedToken.exp);
          apiService.setAuthentication(accessToken);
          toast({
            title: SIGN_IN_SUCCESS_MESSAGE,
            description: `Welcome back, ${email}`,
            status: "success",
          });
          setStatusState("signIn", { status: true });
          navigate("/");
        } catch (error) {
          setStatusState("signIn", { status: false });
          if (error instanceof ApiResponseError) {
            setStatusState("signIn", { error: error.details.description });
            toast({
              title: `${error.error} - ${error.message}`,
              description: error.details.description,
              status: "error",
            });
          } else {
            toast({
              title: "Error",
              description: `Unknown error when requesting user sign in: ${error}`,
              status: "error",
            });
          }
        } finally {
          setStatusState("signIn", {
            loading: false,
          });
        }
      }
      return signIn(email, password);
    },
    [setStatusState, toast, navigate]
  );

  const handleRefreshSession = useCallback(() => {
    async function refreshSession() {
      setStatusState("refreshSession", { loading: true });
      try {
        const email: string =
          cookieService.getCookie(StoredCookies.EMAIL) ?? "";
        const accessToken: string =
          cookieService.getCookie(StoredCookies.ACCESS_TOKEN) ?? "";
        const refreshToken: string =
          cookieService.getCookie(StoredCookies.REFRESH_TOKEN) ?? "";

        if (!email || !refreshToken) {
          setStatusState("refreshSession", {
            status: false,
            loading: false,
          });
          return;
        }

        if (!accessToken && (email || refreshToken)) {
          const { payload } = await authService.refreshToken(
            email,
            refreshToken
          );
          cookieService.setAccessTokenCookie(accessToken);
          apiService.setAuthentication(payload.accessToken);
          setStatusState("refreshSession", {
            status: true,
            loading: false,
          });
          return;
        }

        setStatusState("refreshSession", {
          status: true,
          loading: false,
        });
      } catch (error) {
        setStatusState("refreshSession", {
          status: false,
          loading: false,
        });
        if (error instanceof ApiResponseError) {
          setStatusState("refreshSession", {
            error: error.details.description,
          });
          if (error.details.description === "User not authorized") {
            return;
          }
          if (error.details.description !== "Invalid refresh token") {
            toast({
              title: `${error.error} - ${error.message}`,
              description: error.details.description,
              status: "error",
            });
          }
        } else {
          toast({
            title: "Error",
            description: `Unknown error when refreshing session: ${error}`,
            status: "error",
          });
        }

        navigate("auth/login");
      }
    }
    return refreshSession();
  }, [setStatusState, navigate, toast]);

  const handleSignOut = useCallback(() => {
    setStatusState("signOut", {
      loading: true,
    });
    try {
      cookieService.removeAll();
      apiService.setAuthentication("");
      toast({
        title: "Sign out",
        description: SIGN_OUT_SUCCESS_MESSAGE,
      });
      setStatusState("signOut", {
        status: true,
        loading: false,
      });
      navigate("/auth/login");
    } catch (error) {
      setStatusState("signOut", {
        status: false,
        loading: false,
      });
      toast({
        title: "Error",
        description: `Unknown error when signing out: ${error}`,
        status: "error",
      });
    }
  }, [navigate, setStatusState, toast]);

  const contextValue = useMemo(
    () => ({
      handleRefreshSession,
      handleSignOut,
      handleSignUp,
      handleSignIn,
      statusState,
    }),
    [
      handleRefreshSession,
      handleSignOut,
      handleSignUp,
      handleSignIn,
      statusState,
    ]
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}
