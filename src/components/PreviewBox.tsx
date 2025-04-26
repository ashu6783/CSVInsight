import React from 'react';
import { Creative } from '../data/mockData';
import { X } from 'lucide-react';

interface PreviewBoxProps {
  row: Creative;
  onClick: () => void;
  onClose: () => void;
  isModalOpen: boolean;
}

const PreviewBox: React.FC<PreviewBoxProps> = ({ row, onClick, onClose, isModalOpen }) => {

  const parseTags = (tagString: string): string[] => {
    if (!tagString) return [];
    return tagString
      .split(';')
      .map((tag) => tag.trim())
      .filter((tag) => tag !== '');
  };

  const tags = parseTags(row.tags || '');


  const parseTagKeyValue = (tag: string): { key: string; value: string } | null => {
    const parts = tag.split(':');
    if (parts.length === 2) {
      return { key: parts[0].trim(), value: parts[1].trim() };
    }
    return null;
  };

  return (
    <>
      {!isModalOpen && (
        <div
          onClick={onClick}
          className="p-5 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer bg-white hover:bg-gray-50 flex flex-col gap-3"
        >
          <h3 className="text-lg font-semibold text-gray-800 truncate">{row.creative_name}</h3>
          <div className="flex flex-col gap-2">
            <div className="flex flex-col">
              <p className="text-gray-600 text-sm">ID:</p>
              <p className="font-medium text-gray-800 text-sm">{row.creative_id.substring(0, 10)}...</p>
            </div>
            <div className="flex flex-col">
              <p className="text-gray-600 text-sm">Country:</p>
              <p className="font-medium text-gray-800 text-sm">{row.country}</p>
            </div>
            <div className="flex flex-col">
              <p className="text-gray-600 text-sm">Spend:</p>
              <p className="font-medium text-gray-800 text-sm">${row.spend}</p>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-col pt-2 border-t border-gray-100">
                <p className="text-gray-600 text-sm mb-1">Tags:</p>
                <div className="flex flex-wrap gap-1">
                  {tags.slice(0, 3).map((tag, index) => {
                    const parsed = parseTagKeyValue(tag);
                    return (
                      <span
                        key={index}
                        className="inline-block bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded truncate max-w-full"
                      >
                        {parsed ? parsed.value : tag}
                      </span>
                    );
                  })}
                  {tags.length > 3 && (
                    <span className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                      +{tags.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            )}
            <div className="flex flex-col pt-2 border-t border-gray-100">
              <p className="text-gray-600 text-sm">Impressions:</p>
              <p className="font-medium text-gray-800 text-sm">{row.impressions.toLocaleString()}</p>
            </div>
          </div>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center border-b border-gray-100 pb-4 mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-800">{row.creative_name}</h2>
                  <p className="text-sm text-gray-500">ID: {row.creative_id}</p>
                </div>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full p-2 transition-colors duration-200 focus:outline-none"
                >
                 <X className="w-6 h-6" />
                </button>
              </div>

              {/* Metrics summary */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-sm text-blue-600 mb-1">Impressions</p>
                  <p className="text-lg font-bold text-gray-800">{row.impressions.toLocaleString()}</p>
                </div>
                <div className="bg-green-50 p-3 rounded-lg">
                  <p className="text-sm text-green-600 mb-1">Clicks</p>
                  <p className="text-lg font-bold text-gray-800">{row.clicks.toLocaleString()}</p>
                </div>
                <div className="bg-purple-50 p-3 rounded-lg">
                  <p className="text-sm text-purple-600 mb-1">CTR</p>
                  <p className="text-lg font-bold text-gray-800">{row.ctr}%</p>
                </div>
                <div className="bg-orange-50 p-3 rounded-lg">
                  <p className="text-sm text-orange-600 mb-1">Spend</p>
                  <p className="text-lg font-bold text-gray-800">${row.spend}</p>
                </div>
              </div>

              {/* Tags section */}
              {tags.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-md font-semibold text-gray-700 mb-2">Tags</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex flex-wrap gap-2">
                      {tags.map((tag, index) => {
                        const parsed = parseTagKeyValue(tag);
                        if (parsed) {
                          return (
                            <div
                              key={index}
                              className="bg-white border border-gray-200 rounded-lg p-2 flex flex-col"
                            >
                              <span className="text-xs text-gray-500">{parsed.key}</span>
                              <span className="text-sm font-medium text-gray-800">{parsed.value}</span>
                            </div>
                          );
                        }
                        return (
                          <span
                            key={index}
                            className="inline-block bg-blue-50 text-blue-700 text-sm px-3 py-1 rounded-lg"
                          >
                            {tag}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* Detailed data */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-3">
                  <h3 className="text-md font-semibold text-gray-700">Campaign Details</h3>
                  <div className="space-y-2 bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between">
                      <p className="text-gray-600">Country:</p>
                      <p className="font-medium text-gray-800">{row.country}</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-gray-600">Ad Network:</p>
                      <p className="font-medium text-gray-800">{row.ad_network}</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-gray-600">OS:</p>
                      <p className="font-medium text-gray-800">{row.os}</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-gray-600">Campaign:</p>
                      <p className="font-medium text-gray-800">{row.campaign}</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-gray-600">Ad Group:</p>
                      <p className="font-medium text-gray-800">{row.ad_group}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="text-md font-semibold text-gray-700">Performance Metrics</h3>
                  <div className="space-y-2 bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between">
                      <p className="text-gray-600">IPM:</p>
                      <p className="font-medium text-gray-800">{row.ipm}</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-gray-600">CPM:</p>
                      <p className="font-medium text-gray-800">${row.cpm}</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-gray-600">Cost/Click:</p>
                      <p className="font-medium text-gray-800">${row.cost_per_click}</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-gray-600">Cost/Install:</p>
                      <p className="font-medium text-gray-800">${row.cost_per_install}</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-gray-600">Installs:</p>
                      <p className="font-medium text-gray-800">{row.installs.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-100 flex justify-end">
                <button
                  onClick={onClose}
                  className="px-5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg font-medium transition-colors duration-200"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PreviewBox;