import { IsOptional, IsNumber, IsBoolean } from 'class-validator';
import { Transform, TransformFnParams } from 'class-transformer';

export class UserFoodRecommendationParamsDto {
  @IsOptional()
  @IsNumber({}, { each: true })
  @Transform((params: TransformFnParams) => parseInt(params.value))
  pageNumber: number;

  @IsOptional()
  @IsBoolean()
  randomize: boolean;

  @IsOptional()
  @IsNumber({}, { each: true })
  @Transform((params: TransformFnParams) => parseInt(params.value))
  limit: number;
}
