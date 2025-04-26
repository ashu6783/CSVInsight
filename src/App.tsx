import { useState, useEffect } from 'react';
import FilterPanel from './components/FilterPanel/FilterPanel';
import DataTable from './components/DataTable';
import PreviewBox from './components/PreviewBox';
import { mockData, Creative, loadCsvData } from './data/mockData';

function App() {
  const [data, setData] = useState<Creative[]>([]);
  const [showFilter, setShowFilter] = useState<boolean>(false);
  const [filteredData, setFilteredData] = useState<Creative[]>([]);
  const [selectedRow, setSelectedRow] = useState<Creative | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTable, setIsTable] = useState(false);

  useEffect(() => {
    fetch('/sigwise.csv')
      .then((response) => response.text())
      .then((csvText) => {
        loadCsvData(csvText);
        setData(mockData);
        setFilteredData(mockData);
      })
      .catch((error) => console.error('Error fetching sigwise.csv:', error));
  }, []);

  const handleRowClick = (row: Creative) => {
    setSelectedRow(row);
  };

  const handleFilterClick = () => {
    setShowFilter((prev) => !prev);
  };

  const handlePreviewClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedRow(null);
  };

  const handleFilterChange = (newFilteredData: Creative[]) => {
    setFilteredData(newFilteredData);
  };

  const handleTable = () => {
    setIsTable(!isTable);
  };

  return (
    <div className="app-container min-h-screen">
      <header className="p-2 sm:p-5">
        <div className="flex flex-col sm:flex-row items-center p-2 sm:p-5">
          <img src="./logo.svg" className="w-12 h-16 sm:w-18 sm:h-20" alt="" />
          <div className="flex flex-col pl-1 sm:pl-2">
            <div className="flex font-semibold text-lg sm:text-[24px] text-[#00000099] mt-0 sm:mt-1">
              Segwise
            </div>
            <div className="flex font-normal text-base sm:text-[22px] text-[#00000099] -mt-0 sm:-mt-1">
              Front End Test
            </div>
          </div>
        </div>
      </header>

      <div className="border-2 border-[#0000001F] mt-10 sm:mt-32 p-5 sm:p-28 ml-2 sm:ml-5 mr-2 sm:mr-5 border-dashed relative">
        <div className="flex flex-col sm:flex-wrap">
          <div className="bg-[#F5F8FA] w-full h-auto sm:h-1/2 p-3 sm:p-6">
            <div className="bg-white rounded-2xl w-full sm:w-25 h-10 pl-2 flex flex-row gap-1 sm:gap-2 items-center relative">
              <img src="./filter.svg" alt="filter" />
              <button
                onClick={handleFilterClick}
                type="button"
                className="cursor-pointer text-sm sm:text-base"
              >
                Filter
              </button>
              <img src="./arrow-down.svg" alt="" />
              {showFilter && (
                <div className="absolute top-full left-0 right-0 sm:left-auto sm:right-auto sm:w-96 bg-white border-none rounded-md shadow-lg p-4 z-50">
                  <FilterPanel onFilterChange={handleFilterChange} data={data} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-10 sm:mt-20 p-2 sm:p-5 ml-2 sm:ml-5 mr-2 sm:mr-5 text-center">
        <button
          onClick={handleTable}
          type="button"
          className="cursor-pointer bg-[#e3fa99] rounded-2xl w-full sm:w-25 h-10 pl-2 flex flex-row gap-1 sm:gap-2 items-center mx-auto text-sm sm:text-base"
        >
          Show Table
        </button>
        {isTable && (
          <div className="mt-2 sm:mt-4">
            <DataTable data={filteredData} onRowClick={handleRowClick} />
          </div>
        )}
      </div>

      {selectedRow && (
        <div className="fixed bottom-2 right-2 sm:bottom-5 sm:right-5 opacity-90 z-50">
          <PreviewBox
            row={selectedRow}
            onClick={handlePreviewClick}
            onClose={handleCloseModal}
            isModalOpen={isModalOpen}
          />
        </div>
      )}
    </div>
  );
}

export default App;