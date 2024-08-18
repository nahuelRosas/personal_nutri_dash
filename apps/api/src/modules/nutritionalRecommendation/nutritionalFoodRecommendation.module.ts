import { forwardRef, Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { CommonModule } from '@/common/common.module';
import { NutritionalFoodRecommendationService } from './application/service/nutritionalFoodRecommendation.service';
import { NutritionalRecommendationController } from './interface/nutritionalFoodRecommendation.controller';
import { NutritionalFoodRecommendationMapper } from './application/mapper/nutritionalFoodRecommendation.mapper';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    forwardRef(() => CommonModule),
    forwardRef(() => UserModule),
    HttpModule,
  ],
  providers: [
    NutritionalFoodRecommendationService,
    NutritionalFoodRecommendationMapper,
  ],
  exports: [NutritionalFoodRecommendationService],
  controllers: [NutritionalRecommendationController],
})
export class NutritionalFoodRecommendationModule {}
