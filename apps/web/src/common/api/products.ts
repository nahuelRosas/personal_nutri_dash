import { IApiResponse } from "@/config/axios/interfaces/IApiResponse";
import { apiService } from "@/config/axios/services/api.service";
import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import {
  FilteredResponseDto,
  MacronutrientPreferenceEnum,
} from "./filtered-response.interface";

export function useGetProductsRecommendationsForUserQuery() {
  const query = useQuery<{
    recommendedProducts: FilteredResponseDto;
    avoidedProducts: FilteredResponseDto;
    user: {
      id: string;
      email: string;
      externalId: string;
    };
  }>({
    queryKey: ["recommendedProducts", "avoidedProducts", "user"],
    queryFn: async () =>
      apiService
        ?.get<
          IApiResponse<{
            recommendedProducts: FilteredResponseDto;
            avoidedProducts: FilteredResponseDto;
            user: {
              id: string;
              email: string;
              externalId: string;
            };
          }>
        >("/product-recommendations/user")
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
    macronutrientPreference: MacronutrientPreferenceEnum[];
  }>({
    queryKey: ["userMe"],
    queryFn: async () =>
      apiService
        ?.get<
          IApiResponse<{
            id: string;
            email: string;
            externalId: string;
            macronutrientPreference: MacronutrientPreferenceEnum[];
          }>
        >("/user/me")
        .then((res) => res.payload),
  });
  return query;
}
export function useUpdateMacronutrientPreferenceMutation() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (
      macronutrientPreference: MacronutrientPreferenceEnum[]
    ) => {
      const res = await apiService?.put<
        IApiResponse<{
          updatedUser: {
            id: string;
            macronutrientPreference: MacronutrientPreferenceEnum[];
          };
        }>
      >("/user/update", { macronutrientPreference });

      return res?.payload;
    },
    onMutate: async (newParameters: MacronutrientPreferenceEnum[]) => {
      await queryClient.cancelQueries({ queryKey: ["user"] });

      const previousUserData = queryClient.getQueryData<{
        macronutrientPreference: MacronutrientPreferenceEnum[];
      }>(["user"]);

      queryClient.setQueryData(["user"], (oldData: any) => ({
        ...oldData,
        macronutrientPreference: newParameters,
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
