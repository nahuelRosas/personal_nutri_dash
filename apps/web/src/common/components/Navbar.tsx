import { Link as RouterLink, useLocation } from "react-router-dom";
import { Box, Flex, Link, Text, Button } from "@chakra-ui/react";
import { useAuthProvider } from "@/modules/auth/hooks/useAuthProvider";

function Navbar() {
  const location = useLocation();
  const { handleSignOut } = useAuthProvider();

  const handleSignOutClick = async () => {
    try {
      handleSignOut();
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  if (location.pathname === "/") {
    return null;
  }

  return (
    <Box bg="teal.500" p={4} color="white">
      <Flex align="center" justify="space-between">
        <Text fontSize="lg" fontWeight="bold">
          Personal Nutri Dashboard
        </Text>
        <Flex gap={4} align="center">
          <Link
            as={RouterLink}
            to="/product-recommender"
            _hover={{ textDecoration: "none", color: "teal.200" }}
          >
            Product Recommender
          </Link>
          <Link
            as={RouterLink}
            to="/nutrigenetic"
            _hover={{ textDecoration: "none", color: "teal.200" }}
          >
            Nutrigenetic
          </Link>
          <Button
            onClick={handleSignOutClick}
            bg="teal.600"
            color="white"
            _hover={{ bg: "teal.700" }}
          >
            Sign Out
          </Button>
        </Flex>
      </Flex>
    </Box>
  );
}

export default Navbar;
