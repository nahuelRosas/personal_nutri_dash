export interface Nutrient {
  id: number;
  name: string;
  value: number;
  unit: string;
}

export interface Measure {
  description: string;
  gramWeight: number;
}

export interface FoodAttributes {
  category: string;
  adjustments: string;
  additionalDescription: string;
}

export interface Food {
  id: number;
  description: string;
  additionalDescription: string;
  dataType: string;
  foodCategory: string;
  score: number;
  nutrients: Nutrient[];
  measures: Measure[];
  attributes: FoodAttributes;
}

export interface Aggregations {
  dataType: {
    [key: string]: number;
  };
}

export interface FilteredResponse {
  metadata: {
    totalHits: number;
    currentPage: number;
    totalPages: number;
    pageList: number[];
  };
  searchCriteria: {
    query: string;
    pageNumber: number;
    numberOfResultsPerPage: number;
    pageSize: number;
    requireAllWords: boolean;
  };
  foods: Food[];
  aggregations: Aggregations;
}
