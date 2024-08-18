import { useEffect, useState } from "react";
import {
  Box,
  Flex,
  VStack,
  Checkbox,
  Text,
  Divider,
  Heading,
  Spinner,
} from "@chakra-ui/react";
import {
  useGetFoodRecommendationsForUserQuery,
  useGetUserMeQuery,
  useUpdateNutrigeneticParametersMutation,
} from "@/common/api/nutrigenetic";
import {
  NutrigeneticParameter,
  NutrigeneticParameterEnum,
} from "@/common/api/filtered-response.interface";
import { FoodGrid } from "@/common/components/foodGrid";

function FilterPanel({
  onFilterChange,
}: {
  onFilterChange: (options: NutrigeneticParameterEnum[]) => void;
}) {
  const [selectedOptions, setSelectedOptions] = useState<
    NutrigeneticParameterEnum[]
  >([]);
  const { data, isLoading, isError } = useGetUserMeQuery();

  useEffect(() => {
    if (data?.nutrigeneticParameters) {
      setSelectedOptions(data.nutrigeneticParameters);
    }
  }, [data]);

  const { mutateAsync } = useUpdateNutrigeneticParametersMutation();

  const handleFilterChange = (option: NutrigeneticParameterEnum) => {
    setSelectedOptions((prev) => {
      const updatedOptions = prev.includes(option)
        ? prev.filter((selected) => selected !== option)
        : [...prev, option];
      mutateAsync(updatedOptions).then(() => onFilterChange(updatedOptions));
      return updatedOptions;
    });
  };

  const formatOption = (text: string) =>
    text.replace(/([a-z])([A-Z])/g, "$1 $2");

  return (
    <Box
      p="6"
      bg="white"
      borderWidth="1px"
      borderColor="gray.200"
      borderRadius="md"
      shadow="md"
      _hover={{ shadow: "lg" }}
      transition="all 0.2s"
    >
      <Heading as="h3" size="lg" mb="4" color="gray.700">
        Filter by Nutrigenetic Parameters
      </Heading>
      <Divider mb="4" />

      {isLoading ? (
        <Flex align="center" justify="center" h="100%">
          <Spinner size="lg" />
        </Flex>
      ) : isError ? (
        <Text color="red.500" textAlign="center">
          Error loading parameters.
        </Text>
      ) : (
        <VStack spacing="4" align="start">
          {NutrigeneticParameter.map((option) => (
            <Checkbox
              key={option}
              isChecked={selectedOptions.includes(
                option as NutrigeneticParameterEnum
              )}
              onChange={() =>
                handleFilterChange(option as NutrigeneticParameterEnum)
              }
              colorScheme="teal"
              size="lg"
              w="full"
            >
              {formatOption(option)}
            </Checkbox>
          ))}
        </VStack>
      )}
    </Box>
  );
}

function NutrigeneticDashboard() {
  const [filterOptions, setFilterOptions] = useState<
    NutrigeneticParameterEnum[]
  >([]);
  const { data, isLoading, refetch, isFetching } =
    useGetFoodRecommendationsForUserQuery();
  useEffect(() => {
    refetch();
  }, [filterOptions, refetch]);
  return (
    <Flex>
      <Box flexShrink="0" w="300px" p="4">
        <FilterPanel onFilterChange={setFilterOptions} />
      </Box>
      <Box flex="1" p="4">
        {isFetching ? (
          <Flex align="center" justify="center" h="100%">
            <Spinner size="lg" />
          </Flex>
        ) : isLoading ? (
          <Text textAlign="center">Loading...</Text>
        ) : (
          <Flex direction="column" w="full" gap="6">
            <Text fontSize="2xl" fontWeight="bold" mb="4">
              Recommended Foods
            </Text>
            <FoodGrid cards={data?.recommendedFoods.foods} />

            {data?.recommendedFoods.searchCriteria.query && (
              <>
                <Text fontSize="2xl" fontWeight="bold" mb="4">
                  Not Recommended Foods
                </Text>
                <FoodGrid cards={data?.avoidedFoods.foods} />
              </>
            )}
          </Flex>
        )}
      </Box>
    </Flex>
  );
}

export default NutrigeneticDashboard;
