import {
  useBreakpointValue,
  Grid,
  GridItem,
  Card,
  CardBody,
  Stack,
  Box,
  Text,
} from "@chakra-ui/react";
import { FoodDto, NutrientDto } from "../api/filtered-response.interface";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

export function FoodGrid({ cards }: { cards: FoodDto[] | undefined }) {
  const columns = useBreakpointValue({ base: 1, md: 2, lg: 3 });

  function getTopNutrients(nutrients: NutrientDto[], limit: number = 3) {
    return nutrients.sort((a, b) => b.value - a.value).slice(0, limit);
  }

  function getRandomColor() {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
  function capitalizeTitle(title?: string) {
    return title
      ?.toLowerCase()
      .trim()
      .replace(/-/g, " ")
      .replace(/_/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .toLowerCase()
      .replace(/\w\S*/g, (w) => w.replace(/^\w/, (c) => c.toUpperCase()));
  }

  return (
    <Grid templateColumns={`repeat(${columns}, 1fr)`} gap="6" p="4">
      {cards?.map((data) => (
        <GridItem key={data.id}>
          <Card
            maxW="full"
            p="4"
            variant="outline"
            display="flex"
            flexDirection="column"
            alignItems="start"
            justifyContent="center"
            h="auto"
            borderRadius="md"
            boxShadow="md"
            transition="all 0.2s"
            _hover={{ boxShadow: "lg", transform: "scale(1.02)" }}
          >
            <CardBody>
              <Stack spacing="1">
                <Text fontWeight="bold" fontSize="lg">
                  {capitalizeTitle(data.description)}
                </Text>
                <Text fontSize="sm" color="gray.600">
                  {capitalizeTitle(data.additionalDescription)}
                </Text>
                <Text fontSize="sm" color="gray.500">
                  {capitalizeTitle(data.foodCategory)}
                </Text>
                <Box mt="4" w="full" h="200px">
                  <Text fontWeight="bold" mb="2">
                    Top Nutrients:
                  </Text>

                  <BarChart
                    width={300}
                    height={200}
                    data={getTopNutrients(data.nutrients).map((nutrient) => ({
                      name: nutrient.nutrientName,
                      value: nutrient.value,
                    }))}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill={getRandomColor()} />
                  </BarChart>
                </Box>
              </Stack>
            </CardBody>
          </Card>
        </GridItem>
      ))}
    </Grid>
  );
}
