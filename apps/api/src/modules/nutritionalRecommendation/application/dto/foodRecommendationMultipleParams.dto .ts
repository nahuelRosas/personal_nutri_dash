import {
  IsNotEmpty,
  IsEnum,
  IsOptional,
  IsNumber,
  IsArray,
  IsBoolean,
} from 'class-validator';
import { NutrigeneticParameter } from '../../domain/domain';
import { Transform, TransformFnParams } from 'class-transformer';

export class FoodRecommendationMultipleParamsDto {
  @IsNotEmpty({ message: 'nutrigeneticParameter is required' })
  @IsEnum(NutrigeneticParameter, { each: true })
  @IsArray()
  nutrigeneticParameter: NutrigeneticParameter[];

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
