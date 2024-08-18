import {
  SimpleGrid,
  Card,
  CardBody,
  Text,
  Button,
  Center,
} from "@chakra-ui/react";
import { useNavigate, type To } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();

  const handleNavigate = (path: To) => {
    navigate(path);
  };

  return (
    <Center h="100%" p={6}>
      <SimpleGrid
        columns={{ base: 1, md: 2 }}
        spacing={{ base: 6, md: 8 }}
        maxW="900px"
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
            <Text fontSize="lg" mb={4}>
              Manage and View Personalized Nutritional Recommendations
            </Text>
            <Text mb={4}>
              Manage and visualize customized nutritional recommendations based
              on nutrigenetic data.
            </Text>
            <Button
              colorScheme="teal"
              onClick={() => handleNavigate("/nutrigenetic")}
            >
              Go to Nutrigenetic Recommendations
            </Button>
          </CardBody>
        </Card>

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
            <Text fontSize="lg" mb={4}>
              Product Recommender Based on Macronutrient Preferences
            </Text>
            <Text mb={4}>
              Discover products based on your macronutrient preferences and
              adjust filters to refine recommendations.
            </Text>
            <Button
              colorScheme="teal"
              onClick={() => handleNavigate("/product-recommender")}
            >
              Go to Product Recommender
            </Button>
          </CardBody>
        </Card>
      </SimpleGrid>
    </Center>
  );
};

export default HomePage;
