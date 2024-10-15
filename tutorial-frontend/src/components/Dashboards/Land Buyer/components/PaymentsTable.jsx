import React, { useState, useMemo } from 'react';
import { FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';
import Highlighter from 'react-highlight-words';

  

export default function PaymentsTable({data = []}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const sortedData = useMemo(() => {
    let sortableData = [...data];

    if (searchTerm) {
      sortableData = sortableData.filter((item) =>
        item.operator.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (sortConfig.key) {
      sortableData.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        if (sortConfig.key === 'amount') {
          aValue = Number(aValue);
          bValue = Number(bValue);
        }

        if (sortConfig.key === 'date') {
          aValue = new Date(aValue);
          bValue = new Date(bValue);
        }

        if (aValue < bValue) return sortConfig.direction === 'ascending' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'ascending' ? 1 : -1;
        return 0;
      });
    }

    return sortableData;
  }, [data, sortConfig, searchTerm]);

  const totalItems = sortedData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const currentData = sortedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const renderSortIcon = (key) => {
    if (sortConfig.key !== key) return <FaSort className="text-gray-300 ml-1" />;
    if (sortConfig.direction === 'ascending') return <FaSortUp className="text-white ml-1" />;
    return <FaSortDown className="text-white ml-1" />;
  };

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4 flex flex-col sm:flex-row justify-between items-center">
        <input
          type="text"
          placeholder="Search by operator..."
          value={searchTerm}
          onChange={handleSearch}
          className="px-4 py-2 border border-green-500 rounded-md focus:outline-none focus:ring-2 focus:ring-green-300 mb-2 sm:mb-0"
        />
        <div className="text-sm text-gray-700">Page {currentPage} of {totalPages}</div>
      </div>

      <div className="overflow-x-auto">
        <table id="selection-table" className="min-w-full table-auto border-collapse">
          <thead>
            <tr className="bg-green-500">
              <th onClick={() => handleSort('operator')} className="cursor-pointer px-4 py-2 text-left text-sm font-semibold">
                <span className="flex items-center">Operator {renderSortIcon('operator')}</span>
              </th>
              <th onClick={() => handleSort('amount')} className="cursor-pointer px-4 py-2 text-left text-sm font-semibold">
                <span className="flex items-center">Amount {renderSortIcon('amount')}</span>
              </th>
              <th onClick={() => handleSort('currency')} className="cursor-pointer px-4 py-2 text-left text-sm font-semibold">
                <span className="flex items-center">Currency {renderSortIcon('currency')}</span>
              </th>
              <th onClick={() => handleSort('description')} className="cursor-pointer px-4 py-2 text-left text-sm font-semibold">
                <span className="flex items-center">Description {renderSortIcon('description')}</span>
              </th>
              <th onClick={() => handleSort('phone_number')} className="cursor-pointer px-4 py-2 text-left text-sm font-semibold">
                <span className="flex items-center">Phone Number {renderSortIcon('phone_number')}</span>
              </th>
              <th onClick={() => handleSort('date')} className="cursor-pointer px-4 py-2 text-left text-sm font-semibold">
                <span className="flex items-center">Date {renderSortIcon('date')}</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {currentData.length > 0 ? (
              currentData.map((item, index) => (
                <tr key={index} className="hover:bg-green-50 dark:hover:bg-green-800 cursor-pointer transition-colors">
                  <td className="px-4 py-2 text-sm">{item.operator}</td>
                  <td className="px-4 py-2 text-sm">{item.amount}</td>
                  <td className="px-4 py-2 text-sm">{item.currency}</td>
                  <td className="px-4 py-2 text-sm">{item.description}</td>
                  <td className="px-4 py-2 text-sm">{item.phone_number}</td>
                  <td className="px-4 py-2 text-sm">{new Date(item.date).toLocaleString()}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-4 text-gray-500">No data found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex justify-center items-center space-x-2">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-3 py-1 border rounded-md text-sm ${currentPage === 1 ? 'bg-green-200 text-green-500 cursor-not-allowed' : 'bg-white text-green-500 hover:bg-green-100'}`}
        >
          Prev
        </button>
        {[...Array(totalPages)].map((_, idx) => (
          <button
            key={idx + 1}
            onClick={() => handlePageChange(idx + 1)}
            className={`px-3 py-1 border rounded-md text-sm ${currentPage === idx + 1 ? 'bg-green-500 text-white' : 'bg-white text-green-500 hover:bg-green-100'}`}
          >
            {idx + 1}
          </button>
        ))}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`px-3 py-1 border rounded-md text-sm ${currentPage === totalPages ? 'bg-green-200 text-green-500 cursor-not-allowed' : 'bg-white text-green-500 hover:bg-green-100'}`}
        >
          Next
        </button>
      </div>
    </div>
  );
}
