import React, { useState } from 'react';
import { Creative } from '../data/mockData';
import { ChevronLeft, ChevronRight, SearchIcon } from 'lucide-react';

interface DataTableProps {
  data: Creative[];
  onRowClick: (row: Creative) => void;
}

const DataTable: React.FC<DataTableProps> = ({ data, onRowClick }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: keyof Creative; direction: string } | null>(null);
  const [expandedTags, setExpandedTags] = useState<{ [key: string]: boolean }>({});
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const columns = [
    { key: 'creative_id', label: 'ID' },
    { key: 'creative_name', label: 'Name' },
    { key: 'tags', label: 'Tags' },
    { key: 'country', label: 'Country' },
    { key: 'ad_network', label: 'Network' },
    { key: 'os', label: 'OS' },
    { key: 'campaign', label: 'Campaign' },
    { key: 'ad_group', label: 'Ad Group' },
    { key: 'ipm', label: 'IPM' },
    { key: 'ctr', label: 'CTR' },
    { key: 'spend', label: 'Spend' },
    { key: 'impressions', label: 'Impressions' },
    { key: 'clicks', label: 'Clicks' },
    { key: 'cpm', label: 'CPM' },
    { key: 'cost_per_click', label: 'CPC' },
    { key: 'cost_per_install', label: 'CPI' },
    { key: 'installs', label: 'Installs' },
  ] as const;

  const sortedData = React.useMemo(() => {
    let result = [...data];
    if (sortConfig) {
      result.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return result;
  }, [data, sortConfig]);

  const filteredData = sortedData.filter(item =>
    Object.values(item).some(val =>
      val?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // pagination fields
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = Math.min(startIndex + rowsPerPage, filteredData.length);
  const currentPageData = filteredData.slice(startIndex, endIndex);

  const handleSort = (key: keyof Creative) => {
    setSortConfig(prev => ({
      key,
      direction: prev?.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const toggleTags = (e: React.MouseEvent, rowId: string) => {
    e.stopPropagation();
    setExpandedTags(prev => ({
      ...prev,
      [rowId]: !prev[rowId],
    }));
  };

  const formatNumber = (value: number): string => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}K`;
    }
    return value.toString();
  };

  const formatCurrency = (value: number): string => {
    return `$${value.toFixed(2)}`;
  };

  const formatValue = (key: keyof Creative, value: any): React.ReactNode => {
    if (value === null || value === undefined) return '-';

    if (Array.isArray(value)) {
      return value.join(', ');
    }

    if (typeof value === 'number') {
      if (key === 'spend' || key === 'cpm' || key === 'cost_per_click' || key === 'cost_per_install') {
        return formatCurrency(value);
      }
      if (key === 'impressions' || key === 'clicks' || key === 'installs') {
        return formatNumber(value);
      }
      if (key === 'ctr' || key === 'ipm') {
        return `${(value * 100).toFixed(2)}%`;
      }
    }

    return value.toString();
  };

  const parseTags = (tagsString: string | null | undefined): string[] => {
    if (!tagsString) return [];


    const tagArray: string[] = [];
    const tagPairs = tagsString.split(';');

    tagPairs.forEach(pair => {
      const [category, value] = pair.split(':');
      if (value) {
        tagArray.push(`${category}: ${value.trim()}`);
      }
    });

    return tagArray;
  };

  const renderTags = (tagsString: string | null | undefined, rowId: string, limit: number = 2) => {
    const tags = parseTags(tagsString);

    if (!tags.length) return '-';

    if (tags.length <= limit || expandedTags[rowId]) {
      return (
        <div className="flex flex-wrap gap-1">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full"
            >
              {tag}
            </span>
          ))}
          {tags.length > limit && (
            <button
              onClick={(e) => toggleTags(e, rowId)}
              className="text-green-600 text-xs hover:underline ml-1"
            >
              Show less
            </button>
          )}
        </div>
      );
    }

    return (
      <div className="flex flex-wrap gap-1">
        {tags.slice(0, limit).map((tag, index) => (
          <span
            key={index}
            className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full"
          >
            {tag}
          </span>
        ))}
        <button
          onClick={(e) => toggleTags(e, rowId)}
          className="text-green-600 text-xs hover:underline ml-1"
        >
          +{tags.length - limit} more
        </button>
      </div>
    );
  };

  // Function to handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Function to handle rows per page change
  const handleRowsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRowsPerPage(Number(e.target.value));
    setCurrentPage(1); 
  };

  // Generate pagination buttons
  const renderPaginationButtons = () => {
    const buttons = [];
    const maxButtonsToShow = 5;

    // Always show first page
    buttons.push(
      <button
        key="first"
        onClick={() => handlePageChange(1)}
        disabled={currentPage === 1}
        className={`px-3 py-1 rounded-md ${
          currentPage === 1
            ? 'bg-green-100 text-green-800 cursor-not-allowed'
            : 'bg-white hover:bg-green-50 text-green-700'
        }`}
      >
        1
      </button>
    );

    // Calculate start and end page numbers to show
    let startPage = Math.max(2, currentPage - Math.floor(maxButtonsToShow / 2));
    let endPage = Math.min(totalPages - 1, startPage + maxButtonsToShow - 3);
    
    if (endPage - startPage < maxButtonsToShow - 3) {
      startPage = Math.max(2, endPage - (maxButtonsToShow - 3) + 1);
    }

    // Show ellipsis after first page if needed
    if (startPage > 2) {
      buttons.push(
        <span key="ellipsis-start" className="px-2">
          ...
        </span>
      );
    }

  // Show pages between start and end
    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-3 py-1 rounded-md ${
            currentPage === i
              ? 'bg-green-500 text-white'
              : 'bg-white hover:bg-green-50 text-green-700'
          }`}
        >
          {i}
        </button>
      );
    }

  //for ellipses
    if (endPage < totalPages - 1) {
      buttons.push(
        <span key="ellipsis-end" className="px-2">
          ...
        </span>
      );
    }

    if (totalPages > 1) {
      buttons.push(
        <button
          key="last"
          onClick={() => handlePageChange(totalPages)}
          disabled={currentPage === totalPages}
          className={`px-3 py-1 rounded-md ${
            currentPage === totalPages
              ? 'bg-green-100 text-green-800 cursor-not-allowed'
              : 'bg-white hover:bg-green-50 text-green-700'
          }`}
        >
          {totalPages}
        </button>
      );
    }

    return buttons;
  };

  return (
    <div className="w-full">
      <div className="mb-4 flex items-center justify-between">
        <div className="relative w-64">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 pl-10"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
           <SearchIcon className="w-4 h-4 text-gray-400" />
          </div>
        </div>
        <div className="text-sm text-gray-500">
          {filteredData.length} of {data.length} creatives
        </div>
      </div>

      <div className="overflow-x-auto shadow-md rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-green-50">
            <tr>
              {columns.map(column => (
                <th
                  key={column.key}
                  onClick={() => handleSort(column.key as keyof Creative)}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                >
                  <div className="flex items-center space-x-1">
                    <span>{column.label}</span>
                    {sortConfig?.key === column.key && (
                      <span className="text-gray-700">
                        {sortConfig.direction === 'asc' ? ' ↑' : ' ↓'}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentPageData.map((row) => (
              <tr
                key={row.creative_id}
                onClick={() => onRowClick(row)}
                className="hover:bg-[#F6FDED] cursor-pointer transition-colors duration-150"
              >
                {columns.map(col => {
                  const key = col.key as keyof Creative;
                  return (
                    <td key={col.key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {key === 'creative_name' ? (
                        <div className="font-medium text-gray-900">{row[key]}</div>
                      ) : key === 'tags' ? (
                        renderTags(row.tags as string, row.creative_id)
                      ) : (
                        formatValue(key, row[key])
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
            {filteredData.length === 0 && (
              <tr>
                <td colSpan={columns.length} className="px-6 py-10 text-center text-gray-500">
                  No matching data found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination controls */}
      {filteredData.length > 0 && (
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-700">Rows per page:</span>
            <select
              value={rowsPerPage}
              onChange={handleRowsPerPageChange}
              className="border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              {[5, 10, 25, 50, 100].map(pageSize => (
                <option key={pageSize} value={pageSize}>
                  {pageSize}
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex items-center">
            <span className="mr-4 text-sm text-gray-700">
              {startIndex + 1}-{endIndex} of {filteredData.length}
            </span>
            
            <div className="flex space-x-1">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-2 py-1 rounded-md ${
                  currentPage === 1
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-green-700 hover:bg-green-50'
                }`}
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              
              {renderPaginationButtons()}
              
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-2 py-1 rounded-md ${
                  currentPage === totalPages
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-green-700 hover:bg-green-50'
                }`}
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;