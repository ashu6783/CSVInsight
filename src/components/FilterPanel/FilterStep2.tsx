import React from 'react';
import { Filter, FilterOperator } from './types';
import { Search } from 'lucide-react';

interface FilterStep2Props {
  currentFilter: Partial<Filter>;
  tagValues: string[];
  dimensionValues?: string[];
  handleOperatorSelect: (operator: FilterOperator) => void;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleValueSelect: (values: (string | number)[]) => void;
  handleApplyFilter: () => void;
  setStep: (step: number) => void;
  isFilterValid: boolean;
}

const FilterStep2: React.FC<FilterStep2Props> = ({
  currentFilter,
  tagValues,
  dimensionValues = [],
  handleOperatorSelect,
  handleInputChange,
  handleValueSelect,
  handleApplyFilter,
  setStep,
  isFilterValid,
}) => {
  const [selectAll, setSelectAll] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState('');

  const handleSelectAllChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setSelectAll(checked);
    if (checked) {
      handleValueSelect(tagValues);
    } else {
      handleValueSelect([]);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  React.useEffect(() => {
    if (currentFilter.values?.length === tagValues.length) {
      setSelectAll(true);
    } else {
      setSelectAll(false);
    }
  }, [currentFilter.values, tagValues]);

  const filteredTagValues = tagValues.filter(value =>
    value.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredDimensionValues = dimensionValues.filter(value =>
    value.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white p-3 md:p-6 rounded-lg shadow-lg w-full max-w-full md:max-w-md mx-auto">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setStep(1)}
          className="text-[#97c535] hover:underline flex items-center text-xs md:text-base"
        >
          Choose Values - Hit
        </button>
      </div>

      <div className="mb-4">
        <label className="block text-xs md:text-sm font-medium mb-1">Operator</label>
        <select
          className="w-full border rounded-lg px-2 py-1.5 text-xs md:text-sm appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-[#97c535]"
          value={currentFilter.operator || ''}
          onChange={(e) => handleOperatorSelect(e.target.value as FilterOperator)}
        >
          {currentFilter.type === 'metric' ? (
            <>
              <option value="greater than">Greater than</option>
              <option value="lesser than">Lesser than</option>
              <option value="equals">Equals</option>
            </>
          ) : (
            <>
              <option value="is">Is</option>
              <option value="is not">Is not</option>
              <option value="contains">Contains</option>
              <option value="does not contain">Does not contain</option>
            </>
          )}
        </select>
      </div>

      {currentFilter.type === 'metric' ? (
        <div className="mb-4">
          <label className="block text-xs md:text-sm font-medium mb-1">Value</label>
          <input
            type="number"
            className="w-full border rounded-lg px-2 py-1.5 text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-[#97c535]"
            value={currentFilter.values?.[0] || ''}
            onChange={handleInputChange}
          />
        </div>
      ) : currentFilter.type === 'tag' ? (
        <div className="mb-4">
          <label className="block text-xs md:text-sm font-medium mb-1">Values</label>
          <div className="border rounded-lg">
            <div className="flex items-center border-b px-2 py-1.5">
              <Search className="w-3 h-3 md:w-4 md:h-4 mr-2 text-gray-500" />
              <input
                type="text"
                placeholder="Search"
                className="w-full py-1 text-xs md:text-sm outline-none"
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
            <div className="max-h-32 md:max-h-40 overflow-y-auto p-2">
              <div className="flex items-center mb-1.5">
                <input
                  type="checkbox"
                  id="select-all"
                  className="mr-2 h-3 w-3 md:h-4 md:w-4 border-gray-300 rounded"
                  checked={selectAll}
                  onChange={handleSelectAllChange}
                />
                <label htmlFor="select-all" className="text-xs md:text-sm">
                  Select all
                </label>
              </div>
              {filteredTagValues.length > 0 ? (
                filteredTagValues.map((value) => (
                  <div key={value} className="flex items-center mb-1.5">
                    <input
                      type="checkbox"
                      id={`value-${value}`}
                      className="mr-2 h-3 w-3 md:h-4 md:w-4 border-gray-300 rounded"
                      checked={currentFilter.values?.includes(value) || false}
                      onChange={(e) => {
                        if (e.target.checked) {
                          handleValueSelect([...(currentFilter.values || []), value]);
                        } else {
                          handleValueSelect(
                            (currentFilter.values || []).filter((v) => v !== value)
                          );
                        }
                      }}
                    />
                    <label htmlFor={`value-${value}`} className="text-xs md:text-sm truncate">
                      {value}
                    </label>
                  </div>
                ))
              ) : (
                <div className="text-xs md:text-sm text-gray-500 text-center py-2">No matching values</div>
              )}
            </div>
          </div>
        </div>
      ) : currentFilter.type === 'dimension' ? (
        <div className="mb-4">
          <label className="block text-xs md:text-sm font-medium mb-1">Values</label>
          <div className="border rounded-lg">
            <div className="flex items-center border-b px-2 py-1.5">
              <Search className="w-3 h-3 md:w-4 md:h-4 mr-2 text-gray-500" />
              <input
                type="text"
                placeholder="Search"
                className="w-full py-1 text-xs md:text-sm outline-none"
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
            <div className="max-h-32 md:max-h-40 overflow-y-auto p-2">
              {filteredDimensionValues.length > 0 ? (
                filteredDimensionValues.map((value) => (
                  <div key={value} className="flex items-center mb-1.5">
                    <input
                      type="checkbox"
                      id={`dim-value-${value}`}
                      className="mr-2 h-3 w-3 md:h-4 md:w-4 border-gray-300 rounded"
                      checked={currentFilter.values?.includes(value) || false}
                      onChange={(e) => {
                        if (e.target.checked) {
                          handleValueSelect([...(currentFilter.values || []), value]);
                        } else {
                          handleValueSelect(
                            (currentFilter.values || []).filter((v) => v !== value)
                          );
                        }
                      }}
                    />
                    <label htmlFor={`dim-value-${value}`} className="text-xs md:text-sm truncate">
                      {value}
                    </label>
                  </div>
                ))
              ) : (
                <div className="text-xs md:text-sm text-gray-500 text-center py-2">No matching values</div>
              )}
            </div>
          </div>
        </div>
      ) : null}

      <div className="flex">
        <button
          className={`bg-gray-800 w-full justify-center text-white flex-1 py-2 rounded text-xs md:text-sm ${isFilterValid ? 'hover:bg-gray-700 active:bg-gray-900' : 'opacity-50 cursor-not-allowed'
            }`}
          onClick={handleApplyFilter}
          disabled={!isFilterValid}
        >
          Apply
        </button>
      </div>
    </div>
  );
};

export default FilterStep2;