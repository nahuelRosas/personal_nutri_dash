import { IApiResponse } from "@/config/axios/interfaces/IApiResponse";
import { apiService } from "@/config/axios/services/api.service";
import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import {
  FilteredResponseDto,
  NutrigeneticParameterEnum,
} from "./filtered-response.interface";

export function useGetFoodRecommendationsForUserQuery() {
  const query = useQuery<{
    recommendedFoods: FilteredResponseDto;
    avoidedFoods: FilteredResponseDto;
    user: {
      id: string;
      email: string;
      externalId: string;
    };
  }>({
    queryKey: ["recommendedFoods", "avoidedFoods", "user"],
    queryFn: async () =>
      apiService
        ?.get<
          IApiResponse<{
            recommendedFoods: FilteredResponseDto;
            avoidedFoods: FilteredResponseDto;
            user: {
              id: string;
              email: string;
              externalId: string;
            };
          }>
        >("/food-recommendations/user")
        .then((res) => {
          return res.payload;
        }),
  });
  return query;
}

export function useGetUserMeQuery() {
  const query = useQuery<{
    id: string;
    email: string;
    externalId: string;
    nutrigeneticParameters: NutrigeneticParameterEnum[];
  }>({
    queryKey: ["userMe"],
    queryFn: async () =>
      apiService
        ?.get<
          IApiResponse<{
            id: string;
            email: string;
            externalId: string;
            nutrigeneticParameters: NutrigeneticParameterEnum[];
          }>
        >("/user/me")
        .then((res) => res.payload),
  });
  return query;
}
export function useUpdateNutrigeneticParametersMutation() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (nutrigeneticParameters: NutrigeneticParameterEnum[]) => {
      const res = await apiService?.put<
        IApiResponse<{
          updatedUser: {
            id: string;
            nutrigeneticParameters: NutrigeneticParameterEnum[];
          };
        }>
      >("/user/update", { nutrigeneticParameters });

      return res?.payload;
    },
    onMutate: async (newParameters: NutrigeneticParameterEnum[]) => {
      await queryClient.cancelQueries({ queryKey: ["user"] });

      const previousUserData = queryClient.getQueryData<{
        nutrigeneticParameters: NutrigeneticParameterEnum[];
      }>(["user"]);

      queryClient.setQueryData(["user"], (oldData: any) => ({
        ...oldData,
        nutrigeneticParameters: newParameters,
      }));

      return { previousUserData };
    },
    onError: (_error, _newParameters, context) => {
      if (context?.previousUserData) {
        queryClient.setQueryData(["user"], context.previousUserData);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });

  return mutation;
}
