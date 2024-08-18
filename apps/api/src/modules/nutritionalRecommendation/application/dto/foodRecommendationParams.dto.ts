import {
  IsNotEmpty,
  IsEnum,
  IsOptional,
  IsNumber,
  IsBoolean,
} from 'class-validator';
import { NutrigeneticParameter } from '../../domain/domain';
import { Transform, type TransformFnParams } from 'class-transformer';

export class FoodRecommendationParamsDto {
  @IsNotEmpty({ message: 'nutrigeneticParameter is required' })
  @IsEnum(NutrigeneticParameter)
  nutrigeneticParameter: NutrigeneticParameter;

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
