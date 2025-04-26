import { Creative } from '../../data/mockData';
import { Filter } from './types';


export const extractTagCategories = (data: Creative[]): string[] => {
  const categories = new Set<string>();
  
  data.forEach(item => {
    if (item.tags && typeof item.tags === 'string') {
      const tagPairs = item.tags.split(';');
      tagPairs.forEach((pair: string) => {
        const [category] = pair.split(':');
        if (category) {
          categories.add(category.trim());
        }
      });
    }
  });
  
  return Array.from(categories).sort();
};


export const extractTagValues = (data: Creative[], category: string): string[] => {
  const values = new Set<string>();
  
  data.forEach(item => {
    if (item.tags && typeof item.tags === 'string') {
      const tagPairs = item.tags.split(';');
      tagPairs.forEach((pair: string) => {
        const [cat, val] = pair.split(':');
        if (cat && cat.trim() === category && val) {
          values.add(val.trim());
        }
      });
    }
  });
  
  return Array.from(values).sort();
};


export const extractDimensionValues = (data: Creative[], field: keyof Creative): string[] => {
  const valuesSet = new Set<string>();
  
  data.forEach(item => {
    if (item[field] !== undefined && item[field] !== null) {
      valuesSet.add(String(item[field]));
    }
  });
  
  return Array.from(valuesSet).sort();
};


export const filterByTag = (data: Creative[], filter: Filter): Creative[] => {
  if (!filter.category || !filter.values || filter.values.length === 0) {
    return data;
  }
  
  return data.filter(item => {
    if (!item.tags || typeof item.tags !== 'string') return false;
    
    const tagPairs = item.tags.split(';');
    const relevantTags = tagPairs
      .filter((pair: string) => pair.startsWith(`${filter.category}:`))
      .map((pair: string) => {
        const [, value] = pair.split(':');
        return value ? value.trim() : '';
      });
    
    switch (filter.operator) {
      case 'is':
        return filter.values.some(val => 
          relevantTags.includes(String(val))
        );
      case 'is not':
        return !filter.values.some(val => 
          relevantTags.includes(String(val))
        );
      case 'contains':
        return filter.values.some(val => 
          relevantTags.some((tag: string) => tag.toLowerCase().includes(String(val).toLowerCase()))
        );
      case 'does not contain':
        return !filter.values.some(val => 
          relevantTags.some((tag: string) => tag.toLowerCase().includes(String(val).toLowerCase()))
        );
      default:
        return false;
    }
  });
};


export const filterByMetric = (data: Creative[], filter: Filter): Creative[] => {
  if (!filter.field || !filter.values || filter.values.length === 0) {
    return data;
  }
  
  const field = filter.field as keyof Creative;
  const value = Number(filter.values[0]);
  
  return data.filter(item => {
    const metricValue = Number(item[field]);

    if (isNaN(metricValue)) return false;
    
    switch (filter.operator) {
      case 'greater than':
        return metricValue > value;
      case 'lesser than':
        return metricValue < value;
      case 'equals':
        return Math.abs(metricValue - value) < 0.00001;
      default:
        return false;
    }
  });
};


export const filterByDimension = (data: Creative[], filter: Filter): Creative[] => {
  if (!filter.field || !filter.values || filter.values.length === 0) {
    return data;
  }
  
  const field = filter.field as keyof Creative;
  
  return data.filter(item => {
    const itemValue = item[field];
    
    if (itemValue === undefined || itemValue === null) {
      return false;
    }
    
    const stringValue = String(itemValue).toLowerCase();
    
    switch (filter.operator) {
      case 'is':
        return filter.values.some(val => 
          String(val).toLowerCase() === stringValue
        );
      case 'is not':
        return !filter.values.some(val => 
          String(val).toLowerCase() === stringValue
        );
      case 'contains':
        return filter.values.some(val => 
          stringValue.includes(String(val).toLowerCase())
        );
      case 'does not contain':
        return !filter.values.some(val => 
          stringValue.includes(String(val).toLowerCase())
        );
      default:
        return false;
    }
  });
};