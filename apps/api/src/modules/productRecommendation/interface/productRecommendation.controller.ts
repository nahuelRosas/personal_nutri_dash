import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ProductRecommendationService } from '../application/service/productRecommendation.service';
import { Auth } from '@/modules/auth/application/decorator/auth.decorator';
import { AuthType } from '@/modules/auth/domain/auth_type.enum';
import { CurrentUser } from '@/modules/user/application/decorator/current_user.decorator';
import { User } from '@/modules/user/domain/user.domain';
import { IResponse } from '@/common/response_service/interface/response.interface';
import { ProductRecommendationParamsDto } from '../application/dto/productRecommendationParams.dto';
import { ProductRecommendationMultipleParamsDto } from '../application/dto/productRecommendationMultipleParams.dto ';
import { UserProductRecommendationParamsDto } from '../application/dto/userProductRecommendationParams.dto';

@Controller('product-recommendations')
export class ProductRecommendationController {
  constructor(
    private readonly productRecommendationService: ProductRecommendationService,
  ) {}

  @Auth(AuthType.None)
  @Get()
  async getProductRecommendations(
    @Query() params: ProductRecommendationParamsDto,
  ) {
    const results =
      await this.productRecommendationService.searchProductsByMacronutrientPreference(
        params.macronutrientPreference,
        params.pageNumber,
        params.randomize,
        params.limit ?? 10,
      );
    return results;
  }

  @Auth(AuthType.None)
  @Post('multiple')
  async getMultipleProductRecommendations(
    @Body() params: ProductRecommendationMultipleParamsDto,
  ) {
    const results =
      await this.productRecommendationService.searchProductsByMultiplePreferences(
        params.macronutrientPreferences,
        params.pageNumber,
        params.randomize,
        params.limit ?? 10,
      );
    return results;
  }

  @Auth(AuthType.Bearer)
  @Get('user')
  async getProductRecommendationsForUser(
    @Query() params: UserProductRecommendationParamsDto,
    @CurrentUser() user: IResponse<User>,
  ) {
    const results =
      await this.productRecommendationService.searchProductsForUserProfile(
        user.payload,
        params.pageNumber,
        params.randomize,
        params.limit ?? 10,
      );
    return results;
  }
}
