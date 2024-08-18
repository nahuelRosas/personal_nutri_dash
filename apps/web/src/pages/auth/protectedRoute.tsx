import { ReactElement, ReactNode, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { Flex } from "@chakra-ui/react";

import { useAuthProvider } from "@/modules/auth/hooks/useAuthProvider";
import FullscreenLoading from "@/common/components/FullscreenLoading";
import Navbar from "@/common/components/Navbar";

function ProtectedRoute({
  children,
}: Readonly<{
  children: ReactNode;
}>): ReactElement | null {
  const { handleRefreshSession, statusState } = useAuthProvider();
  useEffect(() => {
    handleRefreshSession();
  }, [handleRefreshSession]);

  if (statusState.refreshSession.loading) {
    return <FullscreenLoading />;
  }

  if (statusState.refreshSession.status) {
    return (
      <Flex flexDir="column" h="-webkit-fit-content" bg="gray.100">
        <Navbar />
        {children}
      </Flex>
    );
  } else {
    return <Navigate to="auth/login" replace />;
  }
}

export default ProtectedRoute;
