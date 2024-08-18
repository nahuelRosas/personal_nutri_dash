import { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { Box, Card, CardBody, Center } from "@chakra-ui/react";
import { useAuthProvider } from "@/modules/auth/hooks/useAuthProvider";
import FullscreenLoading from "@/common/components/FullscreenLoading";

function AuthPage() {
  const { handleRefreshSession, statusState } = useAuthProvider();

  useEffect(() => {
    handleRefreshSession();
  }, [handleRefreshSession]);

  if (statusState.refreshSession.loading) {
    return <FullscreenLoading />;
  }

  if (statusState.refreshSession.status) {
    return <Navigate replace to="/" />;
  }

  return (
    <Center h="100vh" bg="lightgray" p={6}>
      <Box
        display="flex"
        flexDirection={{ base: "column", md: "row" }}
        overflow="hidden"
        borderRadius="md"
        shadow="2xl"
      >
        <Card
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          boxShadow="2xl"
          borderRadius="md"
        >
          <CardBody
            textAlign="center"
            alignItems="center"
            alignContent="center"
            justifyContent="center"
          >
            <Center width={{ base: "full", md: "3/5" }} padding="10">
              <Outlet />
            </Center>
          </CardBody>
        </Card>
      </Box>
    </Center>
  );
}

export default AuthPage;
