import { Box, Spinner } from "@chakra-ui/react";

function FullscreenLoading() {
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      width="100vw"
      height="100vh"
    >
      <Spinner size="lg" />
    </Box>
  );
}

export default FullscreenLoading;
