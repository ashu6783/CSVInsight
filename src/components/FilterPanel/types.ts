export type FilterType = 'tag' | 'metric' | 'dimension';
export type FilterOperator = 'is' | 'is not' | 'contains' | 'does not contain' | 'greater than' | 'lesser than' | 'equals';
export type FilterLogic = 'AND' | 'OR';

export interface Filter {
  id: string;
  type: FilterType;
  category?: string;
  field?: string;
  operator: FilterOperator;
  values: (string | number)[];
  logic: FilterLogic;
}

// dimension fields from csv data
export const DIMENSION_FIELDS = [
  'creative_id',
  'creative_name',
  'country',
  'ad_network',
  'os',
  'campaign',
  'ad_group'
];

// metric data
export const METRIC_FIELDS = [
  'ipm',
  'ctr',
  'spend',
  'impressions',
  'clicks',
  'cpm',
  'cost_per_click',
  'cost_per_install',
  'installs'
];