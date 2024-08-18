export interface ProductSearchCriteria {
  query: string;
  dataType?: string[] | string;
  pageSize?: number;
  pageNumber?: number;
  sortBy?:
    | 'dataType.keyword'
    | 'lowercaseDescription.keyword'
    | 'fdcId'
    | 'publishedDate'
    | 'score';
  sortOrder?: 'asc' | 'desc';
  brandOwner?: string;
  api_key: string;
}
