import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { NutritionalFoodRecommendationService } from '../application/service/nutritionalFoodRecommendation.service';
import { Auth } from '@/modules/auth/application/decorator/auth.decorator';
import { AuthType } from '@/modules/auth/domain/auth_type.enum';
import { CurrentUser } from '@/modules/user/application/decorator/current_user.decorator';
import { User } from '@/modules/user/domain/user.domain';
import { IResponse } from '@/common/response_service/interface/response.interface';
import { FoodRecommendationParamsDto } from '../application/dto/foodRecommendationParams.dto';
import { FoodRecommendationMultipleParamsDto } from '../application/dto/foodRecommendationMultipleParams.dto ';
import { UserFoodRecommendationParamsDto } from '../application/dto/userFoodRecommendationParams.dto';

@Controller('food-recommendations')
export class NutritionalRecommendationController {
  constructor(
    private readonly foodRecommendationService: NutritionalFoodRecommendationService,
  ) {}

  @Auth(AuthType.None)
  @Get()
  async getFoodRecommendations(@Query() params: FoodRecommendationParamsDto) {
    const results =
      await this.foodRecommendationService.searchFoodsByNutrigeneticParameter(
        params.nutrigeneticParameter,
        params.pageNumber,
        params.randomize,
        params.limit,
      );
    return results;
  }

  @Auth(AuthType.None)
  @Post('multiple')
  async getMultipleFoodRecommendations(
    @Body() params: FoodRecommendationMultipleParamsDto,
  ) {
    const results =
      await this.foodRecommendationService.searchFoodsByMultipleParameters(
        params.nutrigeneticParameter,
        params.pageNumber,
        params.randomize,
        params.limit,
      );
    return results;
  }

  @Auth(AuthType.Bearer)
  @Get('user')
  async getFoodRecommendationsForUser(
    @Query() params: UserFoodRecommendationParamsDto,
    @CurrentUser() user: IResponse<User>,
  ) {
    const results =
      await this.foodRecommendationService.searchFoodsForUserProfile(
        user.payload,
        params.pageNumber,
        params.randomize,
        params.limit,
      );
    return results;
  }
}
