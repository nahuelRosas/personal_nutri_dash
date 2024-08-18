import { Inject, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { patternCriteria, MacronutrientPreference } from '../../domain/domain';
import { ProductRecommendationMapper } from '../mapper/productRecommendation.mapper';
import { User } from '@/modules/user/domain/user.domain';
import {
  RESPONSE_SERVICE,
  IResponseService,
} from '@/common/response_service/interface/response.interface';
import {
  USER_SERVICE,
  IUserService,
} from '@/modules/user/application/interfaces/user.service.interfaces';
import { ProductSearchCriteria } from '../interface/foodSearchCriteria.interface';

@Injectable()
export class ProductRecommendationService {
  private readonly usdaApiUrl = 'https://api.nal.usda.gov/fdc/v1/foods/search';
  private readonly apiKey = process.env.USDA_API_KEY;

  constructor(
    private readonly responseMapperService: ProductRecommendationMapper,
    private readonly httpService: HttpService,
    @Inject(RESPONSE_SERVICE)
    private readonly responseService: IResponseService,
    @Inject(USER_SERVICE)
    private readonly userService: IUserService,
  ) {
    this.responseService.setContext(ProductRecommendationService.name);
  }

  async searchProductsByMacronutrientPreference(
    macronutrientPreference: MacronutrientPreference,
    pageNumber: number = 1,
    randomize = true,
    limit?: number,
  ) {
    return this.searchProductsByPreferences(
      [macronutrientPreference],
      pageNumber,
      randomize,
      limit,
    );
  }

  async searchProductsByMultiplePreferences(
    macronutrientPreferences: MacronutrientPreference[],
    pageNumber: number = 1,
    randomize = true,
    limit?: number,
  ) {
    return this.searchProductsByPreferences(
      macronutrientPreferences,
      pageNumber,
      randomize,
      limit,
    );
  }

  async searchProductsForUserProfile(
    user: User,
    pageNumber: number = 1,
    randomize = true,
    limit?: number,
  ) {
    const macronutrientProfile =
      (await this.userService.getMacronutrientPreference(user)) ?? [];
    const response = await this.searchProductsByPreferences(
      macronutrientProfile,
      pageNumber,
      randomize,
      limit,
    );

    return this.responseService.createResponse({
      type: 'OK',
      message: 'Products retrieved successfully for user',
      payload: {
        user: { id: user.id, email: user.email, externalId: user.externalId },
        ...response.payload,
      },
    });
  }

  private async searchProductsByPreferences(
    macronutrientPreferences: MacronutrientPreference[],
    pageNumber: number,
    randomize: boolean,
    limit?: number,
  ) {
    const recommendedProductsQuery = this.buildQuery(
      macronutrientPreferences,
      'recommended',
    );
    const avoidedProductsQuery = this.buildQuery(
      macronutrientPreferences,
      'avoided',
    );

    try {
      const [recommendedProductsResponse, avoidedProductsResponse] =
        await Promise.all([
          this.fetchProducts(recommendedProductsQuery, pageNumber),
          this.fetchProducts(avoidedProductsQuery, pageNumber),
        ]);

      const mappedRecommendedProducts =
        this.responseMapperService.filterSearchResponse(
          recommendedProductsResponse,
          macronutrientPreferences,
          randomize,
          limit,
        );

      const mappedAvoidedProducts =
        this.responseMapperService.filterSearchResponse(
          avoidedProductsResponse,
          macronutrientPreferences,
          randomize,
          limit,
        );

      return this.responseService.createResponse({
        type: 'OK',
        message: 'Products retrieved successfully',
        payload: {
          recommendedProducts: mappedRecommendedProducts,
          avoidedProducts: mappedAvoidedProducts,
        },
      });
    } catch (error) {
      console.log(error);
      this.handleApiError(error);
    }
  }

  private async fetchProducts(query: string, pageNumber: number) {
    const dataTypes = ['Branded'].join(', ');

    return firstValueFrom(
      this.httpService.get(this.usdaApiUrl, {
        params: {
          query,
          api_key: this.apiKey,
          pageNumber,
          dataType: dataTypes,
          pageSize: 200,
        } as ProductSearchCriteria,
      }),
    );
  }

  private buildQuery(
    macronutrientPreferences: MacronutrientPreference[],
    queryType: 'recommended' | 'avoided',
  ): string {
    const wrapPhrase = (phrase: string) => `"${phrase}"`;
    const wrapPartial = (word: string) => `*${word}`;
    const splitPhrase = (phrase: string) => phrase.split(' ');

    const buildIndividualQuery = (preference: MacronutrientPreference) => {
      const { recommendedKeywords, avoidedKeywords } =
        patternCriteria[preference];
      const products =
        queryType === 'recommended' ? recommendedKeywords : avoidedKeywords;
      const uniqueProducts = Array.from(new Set(products));

      const queryWords = uniqueProducts.flatMap((product) =>
        product.includes(' ')
          ? [wrapPhrase(product)]
          : splitPhrase(product).map(wrapPartial),
      );

      return queryWords.map((word) => word.toLocaleLowerCase());
    };

    const allQueryWords = new Set(
      macronutrientPreferences.flatMap(buildIndividualQuery),
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
