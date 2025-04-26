import React, { useState, useEffect } from 'react';
import { Creative } from '../../data/mockData';
import { Filter, FilterType, FilterLogic, FilterOperator, DIMENSION_FIELDS } from './types';
import FilterStep1 from './FilterStep1';
import FilterStep2 from './FilterStep2';
import FilterStep3 from './FilterStep3';
import {
  filterByTag,
  filterByMetric,
  extractTagCategories,
  extractTagValues,
  filterByDimension,
  extractDimensionValues
} from './Utils';

interface FilterPanelProps {
  data: Creative[];
  onFilterChange: (filteredData: Creative[]) => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({ data, onFilterChange }) => {
  const [filters, setFilters] = useState<Filter[]>([]);
  const [currentFilter, setCurrentFilter] = useState<Partial<Filter>>({});
  const [step, setStep] = useState<number>(1);
  const [tagCategories, setTagCategories] = useState<string[]>([]);
  const [tagValues, setTagValues] = useState<string[]>([]);
  const [filterIdCounter, setFilterIdCounter] = useState(0);
  const [dimensionValues, setDimensionValues] = useState<string[]>([]);

  const generateId = () => {
    const newId = `filter-${filterIdCounter}`;
    setFilterIdCounter(prevCounter => prevCounter + 1);
    return newId;
  };
  // for extracting data for tags 
  useEffect(() => {
    if (data.length > 0) {
      const categories = extractTagCategories(data);
      setTagCategories(categories);
    }
  }, [data]);


  useEffect(() => {
    applyFilters();
  }, [filters]);


  const handleCategorySelect = (type: FilterType, field?: string, category?: string) => {
    let partial: Partial<Filter> = {
      type,
      values: []
    };

    if (type === 'tag' && category) {
      partial.category = category;
      partial.operator = 'is';

      const values = extractTagValues(data, category);
      setTagValues(values);
    } else if (type === 'metric' && field) {
      partial.field = field as keyof Creative;
      partial.operator = 'greater than';
      partial.values = [0];
    } else if (type === 'dimension' && field) {
      partial.field = field as keyof Creative;
      partial.operator = 'is';


      const values = extractDimensionValues(data, field as keyof Creative);
      setDimensionValues(values);
    }

    setCurrentFilter(partial);
    setStep(2);
  };

  const handleOperatorSelect = (operator: FilterOperator) => {
    setCurrentFilter(prev => ({
      ...prev,
      operator
    }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    setCurrentFilter(prev => ({
      ...prev,
      values: [value]
    }));
  };

  const handleValueSelect = (values: (string | number)[]) => {
    setCurrentFilter(prev => ({
      ...prev,
      values: values
    }));
  };

  const isFilterValid = () => {
    if (!currentFilter.type) return false;

    if (currentFilter.type === 'tag') {
      return !!(currentFilter.category &&
        currentFilter.operator &&
        currentFilter.values &&
        currentFilter.values.length > 0);
    } else {
      return !!(currentFilter.field &&
        currentFilter.operator &&
        currentFilter.values &&
        currentFilter.values.length > 0);
    }
  };

  const handleApplyFilter = () => {
    if (!isFilterValid()) return;

    const newFilter: Filter = {
      id: generateId(),
      type: currentFilter.type!,
      category: currentFilter.category,
      field: currentFilter.field,
      operator: currentFilter.operator!,
      values: currentFilter.values || [],
      logic: 'AND'
    };

    setFilters([...filters, newFilter]);
    setCurrentFilter({});
    setStep(3);
  };

  const handleRemoveFilter = (index: number) => {
    const newFilters = [...filters];
    newFilters.splice(index, 1);
    setFilters(newFilters);

    if (newFilters.length === 0) {
      setStep(1);
    }
  };

  const handleOperatorChange = (index: number, operator: FilterOperator) => {
    const newFilters = [...filters];
    newFilters[index].operator = operator;
    setFilters(newFilters);
  };

  const handleValueChange = (index: number, value: number) => {
    const newFilters = [...filters];
    newFilters[index].values = [value];
    setFilters(newFilters);
  };

  const handleLogicChange = (index: number, logic: FilterLogic) => {
    const newFilters = [...filters];
    newFilters[index].logic = logic;
    setFilters(newFilters);
  };

  const applyFilters = () => {
    if (filters.length === 0) {
      onFilterChange(data);
      return;
    }

    let filteredData = [...data];

    for (let i = 0; i < filters.length; i++) {
      const filter = filters[i];
      let currentResult: Creative[] = [];

      if (filter.type === 'tag') {
        currentResult = filterByTag(filteredData, filter);
      } else if (filter.type === 'metric') {
        currentResult = filterByMetric(filteredData, filter);
      } else if (filter.type === 'dimension') {
        currentResult = filterByDimension(filteredData, filter);
      }

      if (i < filters.length - 1 && filter.logic === 'OR') {
        const nextFilter = filters[i + 1];
        let nextResult: Creative[] = [];

        if (nextFilter.type === 'tag') {
          nextResult = filterByTag(data, nextFilter);
        } else if (nextFilter.type === 'metric') {
          nextResult = filterByMetric(data, nextFilter);
        } else if (nextFilter.type === 'dimension') {
          nextResult = filterByDimension(data, nextFilter);
        }


        const combinedIds = new Set([
          ...currentResult.map(item => item.creative_id),
          ...nextResult.map(item => item.creative_id)
        ]);

        filteredData = data.filter(item => combinedIds.has(item.creative_id));
        i++;
      } else {
        filteredData = currentResult;
      }
    }

    onFilterChange(filteredData);
  };


  const handleApplyButtonClick = () => {
    applyFilters();
  };


  const renderFilterCount = () => {
    if (filters.length === 0) return null;

    return (
      <div className="filter-count-badge absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2  text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
        {filters.length}
      </div>
    );
  };


  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <FilterStep1
            tagCategories={tagCategories}
            dimensionFields={DIMENSION_FIELDS}
            handleCategorySelect={handleCategorySelect}
            currentFilter={currentFilter}
          />
        );
      case 2:
        return (
          <FilterStep2
            currentFilter={currentFilter}
            tagValues={tagValues}
            dimensionValues={dimensionValues} // Pass dimension values
            handleOperatorSelect={handleOperatorSelect}
            handleInputChange={handleInputChange}
            handleValueSelect={handleValueSelect}
            handleApplyFilter={handleApplyFilter}
            setStep={setStep}
            isFilterValid={isFilterValid()}
          />
        );
      case 3:
        return (
          <FilterStep3
            filters={filters}
            handleRemoveFilter={handleRemoveFilter}
            handleOperatorChange={handleOperatorChange}
            handleValueChange={handleValueChange}
            handleLogicChange={handleLogicChange}
            handleApplyButtonClick={handleApplyButtonClick}
            setStep={setStep}
            filterCount={filters.length}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className=" relative">
      {renderFilterCount()}
      {renderStep()}
    </div>
  );
};

export default FilterPanel;