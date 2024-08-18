import {
  IsNotEmpty,
  IsEnum,
  IsOptional,
  IsNumber,
  IsArray,
  IsBoolean,
} from 'class-validator';
import { MacronutrientPreference } from '../../domain/domain';
import { Transform, TransformFnParams } from 'class-transformer';

export class ProductRecommendationMultipleParamsDto {
  @IsNotEmpty({ message: 'macronutrientPreferences is required' })
  @IsEnum(MacronutrientPreference, { each: true })
  @IsArray()
  macronutrientPreferences: MacronutrientPreference[];

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
