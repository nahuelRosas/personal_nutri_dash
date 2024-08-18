import { Injectable } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { FilteredResponseDto } from '../dto/filtered-response.dto';
import { MacronutrientPreference } from '../../domain/domain';
import { stringSimilarity } from 'string-similarity-js';

@Injectable()
export class ProductRecommendationMapper {
  filterSearchResponse(
    response: AxiosResponse<any>,
    nutrigeneticParameters: MacronutrientPreference | MacronutrientPreference[],
    randomize = true,
    limit?: number,
    query?: string,
  ): FilteredResponseDto {
    const { foods, foodSearchCriteria } = response.data;

    const normalizedFoods = this.removeDuplicateFoods(foods);

    const shuffledFoods = randomize
      ? [...normalizedFoods].sort(() => Math.random() - 0.5)
      : normalizedFoods;

    const limitedFoods = limit ? shuffledFoods.slice(0, limit) : shuffledFoods;

    return this.mapToFilteredResponse(
      limitedFoods,
      nutrigeneticParameters,
      query,
      foodSearchCriteria,
    );
  }

  private removeDuplicateFoods(foods: any[]): any[] {
    return foods.filter(
      (food, index, self) =>
        !self.some(
          (otherFood, otherIndex) =>
            index !== otherIndex && this.areFoodsSimilar(food, otherFood),
        ),
    );
  }

  private areFoodsSimilar(foodA: any, foodB: any): boolean {
    return (
      this.calculateTextSimilarity(foodA.description, foodB.description) >
        0.8 ||
      this.calculateTextSimilarity(
        foodA.additionalDescription ?? '',
        foodB.additionalDescription ?? '',
      ) > 0.8
    );
  }

  private calculateTextSimilarity(textA: string, textB: string): number {
    return stringSimilarity(
      this.normalizeText(textA),
      this.normalizeText(textB),
    );
  }

  private normalizeText(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .trim();
  }

  private mapToFilteredResponse(
    foods: any[],
    nutrigeneticParameters: MacronutrientPreference | MacronutrientPreference[],
    query?: string,
    foodSearchCriteria?: any,
  ): FilteredResponseDto {
    return {
      foods: foods.map((food) => ({
        id: food.fdcId,
        description: food.description,
        additionalDescription: food.additionalDescriptions,
        foodCategory: food.foodCategory,
        nutrients: food.foodNutrients,
      })),
      length: foods.length,
      searchCriteria: {
        parameterQuery: Array.isArray(nutrigeneticParameters)
          ? nutrigeneticParameters.map((param) => this.splitCamelCase(param))
          : this.splitCamelCase(nutrigeneticParameters),
        query: query ?? foodSearchCriteria?.query,
        pageNumber: foodSearchCriteria?.pageNumber,
      },
    };
  }

  private splitCamelCase(text: string): string {
    return text.split(/(?=[A-Z])/).join(' ');
  }
}
