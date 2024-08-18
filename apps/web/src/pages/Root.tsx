import { AppLoader } from "@/common/components/AppLoader";
import { Outlet } from "react-router-dom";
import { Box } from "@chakra-ui/react";

export default function Root() {
  return (
    <Box minH="100vh" bg="lightgray">
      <AppLoader>
        <Outlet />
      </AppLoader>
    </Box>
  );
}
