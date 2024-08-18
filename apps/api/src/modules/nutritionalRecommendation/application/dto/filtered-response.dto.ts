import { IsArray, IsNumber, IsObject, IsString } from 'class-validator';

export class NutrientDto {
  @IsString()
  id: string;

  @IsString()
  name: string;

  @IsNumber()
  value: number;

  @IsString()
  unit: string;

  @IsString()
  nutrientNumber: string;

  @IsString()
  derivationCode: string;

  @IsString()
  derivationDescription: string;

  @IsNumber()
  derivationId: number;

  @IsNumber()
  foodNutrientSourceId: number;

  @IsString()
  foodNutrientSourceCode: string;

  @IsString()
  foodNutrientSourceDescription: string;

  @IsNumber()
  rank: number;

  @IsNumber()
  indentLevel: number;

  @IsNumber()
  foodNutrientId: number;
}

export class MeasureDto {
  @IsString()
  description: string;

  @IsNumber()
  gramWeight: number;

  @IsString()
  id: string;

  @IsString()
  modifier: string;

  @IsNumber()
  rank: number;

  @IsString()
  measureUnitAbbreviation: string;

  @IsString()
  measureUnitName: string;

  @IsNumber()
  measureUnitId: number;
}

export class FoodDto {
  @IsString()
  id: string;

  @IsString()
  description: string;

  @IsString()
  additionalDescription: string;

  @IsString()
  foodCategory: string;

  @IsArray()
  nutrients: NutrientDto[];
}

export class SearchCriteriaDto {
  @IsString({ each: true })
  parameterQuery: string | string[];

  @IsString()
  query: string;

  @IsNumber()
  pageNumber: number;
}

export class MetadataDto {
  @IsNumber()
  totalHits: number;

  @IsNumber()
  currentPage: number;

  @IsNumber()
  totalPages: number;

  @IsArray()
  pageList: number[];
}

export class FilteredResponseDto {
  @IsObject()
  searchCriteria: SearchCriteriaDto;

  @IsArray()
  foods: FoodDto[];

  @IsNumber()
  length: number;
}
