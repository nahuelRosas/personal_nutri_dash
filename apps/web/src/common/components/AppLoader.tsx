import React, { Fragment } from "react";
import { useAuthProvider } from "@/modules/auth/hooks/useAuthProvider";
import { Box, Spinner } from "@chakra-ui/react";

export function AppLoader({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): JSX.Element {
  const { statusState } = useAuthProvider();

  if (statusState.refreshSession.loading) {
    return (
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        width="full"
        height="100vh"
      >
        <Spinner size="lg" />
      </Box>
    );
  }

  return <Fragment>{children}</Fragment>;
}
