import React, { useState } from 'react';
import { Filter, FilterType, METRIC_FIELDS } from './types';
import { Search } from 'lucide-react';

interface FilterStep1Props {
  tagCategories: string[];
  dimensionFields: string[];
  handleCategorySelect: (type: FilterType, field?: string, category?: string) => void;
  currentFilter: Partial<Filter>;
}

const FilterStep1: React.FC<FilterStep1Props> = ({
  tagCategories,
  dimensionFields,
  handleCategorySelect,
  currentFilter,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredDimensions = searchTerm
    ? dimensionFields.filter((dim) => dim.toLowerCase().includes(searchTerm.toLowerCase()))
    : dimensionFields;

  const filteredTags = searchTerm
    ? tagCategories.filter((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    : tagCategories;

  const filteredMetrics = searchTerm
    ? METRIC_FIELDS.filter((metric: string) =>
      metric.toLowerCase().includes(searchTerm.toLowerCase())
    )
    : METRIC_FIELDS;

  return (
    <div className="bg-white rounded-lg w-full max-w-md mx-auto shadow-sm">
      {/* Add Filter Button */}
      <div className="bg-[#f8faf0] rounded-t-lg p-4 md:p-3 flex items-center">
        <div className="bg-[#e3fa99] w-7 h-7 md:w-6 md:h-6 rounded-md flex items-center justify-center mr-3 md:mr-2">
          <span className="text-gray-600 text-lg md:text-base font-medium">+</span>
        </div>
        <span className="text-gray-700 text-base md:text-sm">Add Filter</span>
      </div>

      {/* Search input */}
      <div className="border-b border-gray-200 px-4 md:px-3 py-2">
        <div className="flex items-center bg-gray-50 rounded px-2 py-1">
          <Search size={16} className="text-gray-400 md:w-4 md:h-4" />
          <input
            type="text"
            className="w-full py-1 px-2 text-sm md:text-xs bg-transparent outline-none text-gray-600"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Filter category tabs */}
      <div className="flex border-b border-gray-200">
        <button
          className={`flex-1 py-3 text-gray-600 text-sm md:text-xs transition-colors ${currentFilter.type === 'dimension' ? 'border-b-2 border-gray-400 font-medium' : 'font-normal'
            }`}
          onClick={() => handleCategorySelect('dimension')}
        >
          Dimensions
        </button>
        <button
          className={`flex-1 py-3 text-gray-600 text-sm md:text-xs transition-colors ${currentFilter.type === 'tag' ? 'border-b-2 border-gray-400 font-medium' : 'font-normal'
            }`}
          onClick={() => handleCategorySelect('tag')}
        >
          Tags
        </button>
        <button
          className={`flex-1 py-3 text-gray-600 text-sm md:text-xs transition-colors ${currentFilter.type === 'metric' ? 'border-b-2 border-gray-400 font-medium' : 'font-normal'
            }`}
          onClick={() => handleCategorySelect('metric')}
        >
          Metrics
        </button>
      </div>

      {/* Filter options */}
      <div className="max-h-48 md:max-h-40 overflow-y-auto px-2 py-1">
        {currentFilter.type === 'dimension' &&
          filteredDimensions.map((dimension) => (
            <button
              key={dimension}
              className="w-full text-left px-3 py-2 md:py-1 hover:bg-gray-100 text-gray-600 text-sm md:text-xs rounded my-1 transition-colors"
              onClick={() => handleCategorySelect('dimension', dimension)}
            >
              {dimension}
            </button>
          ))}

        {currentFilter.type === 'tag' &&
          filteredTags.map((category) => (
            <button
              key={category}
              className="w-full text-left px-3 py-2 md:py-1 hover:bg-gray-100 text-gray-600 text-sm md:text-xs rounded my-1 transition-colors"
              onClick={() => handleCategorySelect('tag', undefined, category)}
            >
              {category}
            </button>
          ))}

        {currentFilter.type === 'metric' &&
          filteredMetrics.map((metric: string) => (
            <button
              key={metric}
              className="w-full text-left px-3 py-2 md:py-1 hover:bg-gray-100 text-gray-600 text-sm md:text-xs rounded my-1 transition-colors"
              onClick={() => handleCategorySelect('metric', metric)}
            >
              {metric}
            </button>
          ))}
      </div>
    </div>
  );
};

export default FilterStep1;