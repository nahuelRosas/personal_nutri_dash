import {
  IsNotEmpty,
  IsEnum,
  IsOptional,
  IsNumber,
  IsBoolean,
} from 'class-validator';
import { MacronutrientPreference } from '../../domain/domain';
import { Transform, type TransformFnParams } from 'class-transformer';

export class ProductRecommendationParamsDto {
  @IsNotEmpty({ message: 'macronutrientPreference is required' })
  @IsEnum(MacronutrientPreference)
  macronutrientPreference: MacronutrientPreference;

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
