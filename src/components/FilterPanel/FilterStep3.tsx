import React from 'react';
import { Filter, FilterOperator, FilterLogic } from './types';
import { Trash } from 'lucide-react';

interface FilterStep3Props {
  filters: Filter[];
  handleRemoveFilter: (index: number) => void;
  handleOperatorChange: (index: number, operator: FilterOperator) => void;
  handleValueChange: (index: number, value: number) => void;
  handleLogicChange: (index: number, logic: FilterLogic) => void;
  handleApplyButtonClick: () => void;
  setStep: (step: number) => void;
  filterCount: number;
}

const FilterStep3: React.FC<FilterStep3Props> = ({
  filters,
  handleRemoveFilter,
  handleOperatorChange,
  handleValueChange,
  handleLogicChange,
  setStep,
}) => (
  <div className="bg-white p-3 md:p-6 rounded-lg shadow-lg w-full max-w-full sm:max-w-md mx-auto">
    {/* Add Filter Section */}
    <div
      className="bg-[#f8faf0] rounded-lg p-2 md:p-3 flex items-center cursor-pointer mb-3 md:mb-4"
      onClick={() => setStep(1)}
    >
      <div className="bg-[#e3fa99] w-5 h-5 md:w-6 md:h-6 rounded-md flex items-center justify-center mr-2">
        <span className="text-gray-600 text-base md:text-lg font-medium">+</span>
      </div>
      <span className="text-gray-700 text-xs md:text-sm">Add Filter</span>
    </div>

    {/* Filter Rows */}
    {filters.map((filter, index) => (
      <div key={index} className="mb-3 md:mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1 max-w-[80%]">
            <span className="font-medium text-gray-700 text-xs md:text-sm truncate">
              {filter.type === 'metric' ? `Metrics > ${filter.field}` :
                filter.type === 'dimension' ? `Dimensions > ${filter.field}` :
                  `Tag > ${filter.category}`}
            </span>
            {filter.type !== 'metric' && <span className="text-gray-400">▼</span>}
          </div>
          <button
            onClick={() => handleRemoveFilter(index)}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Remove filter"
          >
            <Trash className="hover:text-red-500 w-4 h-4 md:w-5 md:h-5" />
          </button>
        </div>
        <div className="mt-1">
          {filter.type === 'metric' ? (
            <MetricFilterControls
              filter={filter}
              index={index}
              handleOperatorChange={handleOperatorChange}
              handleValueChange={handleValueChange}
            />
          ) : filter.type === 'dimension' ? (
            <DimensionFilterControls
              filter={filter}
              index={index}
              handleOperatorChange={handleOperatorChange}
            />
          ) : (
            <TagFilterControls
              filter={filter}
              index={index}
              handleOperatorChange={handleOperatorChange}
            />
          )}
        </div>

        {/* Logic Controls (if not the last filter) */}
        {index < filters.length - 1 && (
          <LogicControls
            filter={filter}
            index={index}
            handleLogicChange={handleLogicChange}
          />
        )}
      </div>
    ))}
  </div>
);

interface MetricFilterControlsProps {
  filter: Filter;
  index: number;
  handleOperatorChange: (index: number, operator: FilterOperator) => void;
  handleValueChange: (index: number, value: number) => void;
}

const MetricFilterControls: React.FC<MetricFilterControlsProps> = ({
  filter,
  index,
  handleOperatorChange,
  handleValueChange,
}) => (
  <div className="flex items-center space-x-2">
    <select
      className="border border-gray-300 hover:bg-green-100 rounded-lg px-1 md:px-2 py-1 text-gray-700 text-xs md:text-sm min-w-[90px] md:min-w-[110px]"
      value={filter.operator}
      onChange={(e) => handleOperatorChange(index, e.target.value as FilterOperator)}
    >
      <option value="lesser than">lesser than</option>
      <option value="greater than">greater than</option>
      <option value="equals">equals</option>
    </select>
    <div className="relative flex-1">
      <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-700 text-xs md:text-sm">$</span>
      <input
        type="number"
        className="border border-gray-300 rounded-lg pl-5 pr-2 py-1 w-full text-gray-700 text-xs md:text-sm"
        value={filter.values?.[0] || ''}
        onChange={(e) => handleValueChange(index, Number(e.target.value) || 0)}
      />
    </div>
  </div>
);

interface DimensionFilterControlsProps {
  filter: Filter;
  index: number;
  handleOperatorChange: (index: number, operator: FilterOperator) => void;
}

const DimensionFilterControls: React.FC<DimensionFilterControlsProps> = ({
  filter,
  index,
  handleOperatorChange,
}) => (
  <div className="flex items-center space-x-2">
    <select
      className="border border-gray-300 hover:bg-green-100 rounded-lg px-1 md:px-2 py-1 text-gray-700 text-xs md:text-sm min-w-[90px] md:min-w-[110px]"
      value={filter.operator}
      onChange={(e) => handleOperatorChange(index, e.target.value as FilterOperator)}
    >
      <option value="is">is</option>
      <option value="is not">is not</option>
      <option value="contains">contains</option>
      <option value="does not contain">does not contain</option>
    </select>
    <span className="text-xs md:text-sm text-gray-700 truncate flex-1">{filter.values?.join(', ')}</span>
  </div>
);

interface TagFilterControlsProps {
  filter: Filter;
  index: number;
  handleOperatorChange: (index: number, operator: FilterOperator) => void;
}

const TagFilterControls: React.FC<TagFilterControlsProps> = ({
  filter,
  index,
  handleOperatorChange,
}) => {
  const displayValues = filter.values?.length > 2
    ? `${filter.values.slice(0, 2).join(', ')} +${filter.values.length - 2}`
    : filter.values?.join(', ');

  return (
    <div className="flex items-center space-x-2">
      <select
        className="border border-gray-300 hover:bg-green-100 rounded-lg px-1 md:px-2 py-1 text-gray-700 text-xs md:text-sm min-w-[90px] md:min-w-[110px]"
        value={filter.operator}
        onChange={(e) => handleOperatorChange(index, e.target.value as FilterOperator)}
      >
        <option value="is">is</option>
        <option value="is not">is not</option>
        <option value="contains">contains</option>
        <option value="does not contain">does not contain</option>
      </select>
      <span className="text-xs md:text-sm text-gray-700 truncate flex-1">{displayValues}</span>
      <span className="text-gray-400 flex-shrink-0">▼</span>
    </div>
  );
};

interface LogicControlsProps {
  filter: Filter;
  index: number;
  handleLogicChange: (index: number, logic: FilterLogic) => void;
}

const LogicControls: React.FC<LogicControlsProps> = ({
  filter,
  index,
  handleLogicChange,
}) => (
  <div className="flex space-x-2 mt-2 md:mt-4">
    <button
      className={`px-2 md:px-3 py-0.5 md:py-1 rounded text-xs md:text-sm border ${filter.logic === 'AND' ? 'bg-gray-200 border-gray-400' : 'bg-white border-gray-300 text-gray-700'}`}
      onClick={() => handleLogicChange(index, 'AND')}
    >
      AND
    </button>
    <button
      className={`px-2 md:px-3 py-0.5 md:py-1 rounded text-xs md:text-sm border ${filter.logic === 'OR' ? 'bg-gray-200 border-gray-400' : 'bg-white border-gray-300 text-gray-700'}`}
      onClick={() => handleLogicChange(index, 'OR')}
    >
      OR
    </button>
  </div>
);

export default FilterStep3;