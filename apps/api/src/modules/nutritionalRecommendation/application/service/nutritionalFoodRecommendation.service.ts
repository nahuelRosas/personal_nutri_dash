import { Inject, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { patternCriteria, NutrigeneticParameter } from '../../domain/domain';
import { FoodSearchCriteria } from '../interface/foodSearchCriteria.interface';
import { NutritionalFoodRecommendationMapper } from '../mapper/nutritionalFoodRecommendation.mapper';
import { User } from '@/modules/user/domain/user.domain';
import {
  RESPONSE_SERVICE,
  IResponseService,
} from '@/common/response_service/interface/response.interface';
import {
  USER_SERVICE,
  IUserService,
} from '@/modules/user/application/interfaces/user.service.interfaces';

@Injectable()
export class NutritionalFoodRecommendationService {
  private readonly usdaApiUrl = 'https://api.nal.usda.gov/fdc/v1/foods/search';
  private readonly apiKey = process.env.USDA_API_KEY;

  constructor(
    private readonly responseMapperService: NutritionalFoodRecommendationMapper,
    private readonly httpService: HttpService,
    @Inject(RESPONSE_SERVICE)
    private readonly responseService: IResponseService,
    @Inject(USER_SERVICE)
    private readonly userService: IUserService,
  ) {
    this.responseService.setContext(NutritionalFoodRecommendationService.name);
  }

  async searchFoodsByNutrigeneticParameter(
    nutrigeneticParameter: NutrigeneticParameter,
    pageNumber: number = 1,
    randomize = true,
    limit?: number,
  ) {
    return this.searchFoodsByParameters(
      [nutrigeneticParameter],
      pageNumber,
      randomize,
      limit,
    );
  }

  async searchFoodsByMultipleParameters(
    nutrigeneticParameters: NutrigeneticParameter[],
    pageNumber: number = 1,
    randomize = true,
    limit?: number,
  ) {
    return this.searchFoodsByParameters(
      nutrigeneticParameters,
      pageNumber,
      randomize,
      limit,
    );
  }

  async searchFoodsForUserProfile(
    user: User,
    pageNumber: number = 1,
    randomize = true,
    limit?: number,
  ) {
    const nutriGeneticProfile =
      (await this.userService.getNutrigeneticParameters(user)) ?? [];
    const response = await this.searchFoodsByParameters(
      nutriGeneticProfile,
      pageNumber,
      randomize,
      limit,
    );

    return this.responseService.createResponse({
      type: 'OK',
      message: 'Foods retrieved successfully for user',
      payload: {
        user: { id: user.id, email: user.email, externalId: user.externalId },
        ...response.payload,
      },
    });
  }

  private async searchFoodsByParameters(
    nutrigeneticParameters: NutrigeneticParameter[],
    pageNumber: number,
    randomize: boolean,
    limit?: number,
  ) {
    const recommendedFoodsQuery = this.buildQuery(
      nutrigeneticParameters,
      'recommended',
    );
    const avoidedFoodsQuery = this.buildQuery(
      nutrigeneticParameters,
      'avoided',
    );

    try {
      const [recommendedFoodsResponse, avoidedFoodsResponse] =
        await Promise.all([
          this.fetchFoods(recommendedFoodsQuery, pageNumber),
          this.fetchFoods(avoidedFoodsQuery, pageNumber),
        ]);

      const mappedRecommendedFoods =
        this.responseMapperService.filterSearchResponse(
          recommendedFoodsResponse,
          nutrigeneticParameters,
          randomize,
          limit,
        );

      const mappedAvoidedFoods =
        this.responseMapperService.filterSearchResponse(
          avoidedFoodsResponse,
          nutrigeneticParameters,
          randomize,
          limit,
        );

      return this.responseService.createResponse({
        type: 'OK',
        message: 'Foods retrieved successfully',
        payload: {
          recommendedFoods: mappedRecommendedFoods,
          avoidedFoods: mappedAvoidedFoods,
        },
      });
    } catch (error) {
      console.log(error);
      this.handleApiError(error);
    }
  }

  private async fetchFoods(query: string, pageNumber: number) {
    const dataTypes = ['Foundation', 'Survey (FNDDS)', 'SR Legacy'].join(', ');

    return firstValueFrom(
      this.httpService.get(this.usdaApiUrl, {
        params: {
          query,
          api_key: this.apiKey,
          pageNumber,
          dataType: dataTypes,
          pageSize: 200,
        } as FoodSearchCriteria,
      }),
    );
  }

  private buildQuery(
    nutrigeneticParameters: NutrigeneticParameter[],
    queryType: 'recommended' | 'avoided',
  ): string {
    const wrapPhrase = (phrase: string) => `"${phrase}"`;
    const wrapPartial = (word: string) => `*${word}`;
    const splitPhrase = (phrase: string) => phrase.split(' ');

    const buildIndividualQuery = (parameter: NutrigeneticParameter) => {
      const { recommendedFoods, avoidedFoods } = patternCriteria[parameter];
      const foods =
        queryType === 'recommended' ? recommendedFoods : avoidedFoods;
      const uniqueFoods = Array.from(new Set(foods));

      const queryWords = uniqueFoods.flatMap((food) =>
        food.includes(' ')
          ? [wrapPhrase(food)]
          : splitPhrase(food).map(wrapPartial),
      );

      return queryWords.map((word) => word.toLocaleLowerCase());
    };

    const allQueryWords = new Set(
      nutrigeneticParameters.flatMap(buildIndividualQuery),
    );

    return Array.from(allQueryWords).join(' ');
  }

  private handleApiError(error: Error): void {
    this.responseService.errorHandler({
      type: 'INTERNAL_SERVER_ERROR',
      error,
    });
  }
}
