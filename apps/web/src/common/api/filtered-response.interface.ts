export interface MeasureDto {
  description: string;
  gramWeight: number;
  id: string;
  modifier: string;
  rank: number;
  measureUnitAbbreviation: string;
  measureUnitName: string;
  measureUnitId: number;
}

export interface FoodDto {
  id: string;
  description: string;
  additionalDescription: string;
  foodCategory: string;
  nutrients: NutrientDto[];
  image: string;
}
export interface NutrientDto {
  id: string;
  name: string;
  value: number;
  unit: string;
  nutrientNumber: string;
  derivationCode: string;
  derivationDescription: string;
  derivationId: number;
  foodNutrientSourceId: number;
  foodNutrientSourceCode: string;
  foodNutrientSourceDescription: string;
  rank: number;
  indentLevel: number;
  foodNutrientId: number;
  unitName: string;
  nutrientName: string;
}

export interface SearchCriteriaDto {
  parameterQuery: string | string[];
  query: string;
  pageNumber: number;
}

export interface MetadataDto {
  totalHits: number;
  currentPage: number;
  totalPages: number;
  pageList: number[];
}

export interface FilteredResponseDto {
  searchCriteria: SearchCriteriaDto;
  foods: FoodDto[];
  length: number;
}

export enum NutrigeneticParameterEnum {
  VitaminCDeficiency = "VitaminCDeficiency",
  CaffeineSensitivity = "CaffeineSensitivity",
  GlutenIntolerance = "GlutenIntolerance",
  LactoseIntolerance = "LactoseIntolerance",
  IronAbsorption = "IronAbsorption",
  Omega3Metabolism = "Omega3Metabolism",
  VitaminDDeficiency = "VitaminDDeficiency",
  SaltSensitivity = "SaltSensitivity",
  FolicAcidMetabolism = "FolicAcidMetabolism",
  CarbSensitivity = "CarbSensitivity",
  FatMetabolism = "FatMetabolism",
  HistamineIntolerance = "HistamineIntolerance",
}

export enum MacronutrientPreferenceEnum {
  HighProteinNeeds = "HighProteinNeeds",
  LowCarbDiet = "LowCarbDiet",
  BalancedFatIntake = "BalancedFatIntake",
  IncreasedFiberRequirement = "IncreasedFiberRequirement",
  LowFatDiet = "LowFatDiet",
  LowProteinDiet = "LowProteinDiet",
  HighCarbNeeds = "HighCarbNeeds",
  ModerateFatIntake = "ModerateFatIntake",
  HighFiberNeeds = "HighFiberNeeds",
  LowSugarDiet = "LowSugarDiet",
}

export const NutrigeneticParameter = [
  "VitaminCDeficiency",
  "CaffeineSensitivity",
  "GlutenIntolerance",
  "LactoseIntolerance",
  "IronAbsorption",
  "Omega3Metabolism",
  "VitaminDDeficiency",
  "SaltSensitivity",
  "FolicAcidMetabolism",
  "CarbSensitivity",
  "FatMetabolism",
  "HistamineIntolerance",
];

export const MacronutrientPreference = [
  "HighProteinNeeds",
  "LowCarbDiet",
  "BalancedFatIntake",
  "IncreasedFiberRequirement",
  "LowFatDiet",
  "LowProteinDiet",
  "HighCarbNeeds",
  "ModerateFatIntake",
  "HighFiberNeeds",
  "LowSugarDiet",
];
