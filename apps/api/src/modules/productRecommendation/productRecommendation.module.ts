import { forwardRef, Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { CommonModule } from '@/common/common.module';
import { ProductRecommendationService } from './application/service/productRecommendation.service';
import { ProductRecommendationController } from './interface/productRecommendation.controller';
import { ProductRecommendationMapper } from './application/mapper/productRecommendation.mapper';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    forwardRef(() => CommonModule),
    forwardRef(() => UserModule),
    HttpModule,
  ],
  providers: [ProductRecommendationService, ProductRecommendationMapper],
  exports: [ProductRecommendationService],
  controllers: [ProductRecommendationController],
})
export class ProductRecommendationModule {}
