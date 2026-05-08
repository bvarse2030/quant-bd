/*
|-----------------------------------------
| setting up DynamicSelectField for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

'use client';

import { useEffect, useState } from 'react';
import { X, ChevronDown, Search, Check, Loader2 } from 'lucide-react';

interface IResponseData {
  id: number;
  name: string;
}

const DynamicSelectField = () => {
  const [availableData, setAvailableData] = useState<string[]>([]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [animatingItems, setAnimatingItems] = useState<Set<string>>(new Set());

  const label = 'Select Team Members';
  const placeholder = 'Search and select members...';
  const apiUrl = 'https://jsonplaceholder.typicode.com/users';
  const readOnly = false;

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.status}`);
        }
        const json = await response.json();

        if (!Array.isArray(json)) {
          setError('Invalid data format received');
          setAvailableData([]);
          return;
        }

        if (json.length === 0) {
          setAvailableData([]);
          setError(null);
          return;
        }

        const names = json.map((item: IResponseData) => item.name);
        setAvailableData(names);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
        console.error('Error fetching data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [apiUrl]);

  const getFilteredOptions = () => {
    return availableData.filter(item => !selectedItems.includes(item)).filter(item => item.toLowerCase().includes(searchTerm.toLowerCase()));
  };

  const handleSelect = (value: string) => {
    if (!readOnly) {
      setAnimatingItems(prev => new Set(prev).add(value));
      setSelectedItems(prev => {
        if (prev.includes(value)) return prev;
        return [...prev, value];
      });
      setSearchTerm('');
      setIsOpen(false);

      setTimeout(() => {
        setAnimatingItems(prev => {
          const newSet = new Set(prev);
          newSet.delete(value);
          return newSet;
        });
      }, 300);
    }
  };

  const handleRemove = (itemToRemove: string) => {
    if (!readOnly) {
      setAnimatingItems(prev => new Set(prev).add(itemToRemove));

      setTimeout(() => {
        setSelectedItems(prev => prev.filter(item => item !== itemToRemove));
        setAnimatingItems(prev => {
          const newSet = new Set(prev);
          newSet.delete(itemToRemove);
          return newSet;
        });
      }, 200);
    }
  };

  return (
    <div className="space-y-4 w-full max-w-2xl">
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>

        <div className="relative">
          <div
            className={`
                            relative min-h-[2.75rem] w-full rounded-lg border border-gray-300 bg-white px-3 py-2 
                            shadow-sm transition-all duration-200 cursor-pointer
                            ${isOpen ? 'border-blue-500 ring-2 ring-blue-500/20' : 'hover:border-gray-400'}
                            ${readOnly ? 'bg-gray-50 cursor-not-allowed' : ''}
                            dark:border-gray-600 dark:bg-gray-900 dark:hover:border-gray-500
                        `}
            onClick={() => !readOnly && !isLoading && setIsOpen(!isOpen)}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                {selectedItems.length === 0 ? (
                  <span className="text-gray-500 dark:text-gray-400">{placeholder}</span>
                ) : (
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {selectedItems.length} item
                    {selectedItems.length !== 1 ? 's' : ''} selected
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-2">
                {isLoading && <Loader2 className="h-4 w-4 animate-spin text-gray-400" />}
                <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
              </div>
            </div>
          </div>

          {isOpen && (
            <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg animate-in slide-in-from-top-2 duration-200">
              <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search options..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                    autoFocus
                  />
                </div>
              </div>

              <div className="max-h-64 overflow-y-auto">
                {error ? (
                  <div className="p-4 text-center text-red-500 text-sm">{error}</div>
                ) : getFilteredOptions().length === 0 ? (
                  <div className="p-4 text-center text-gray-500 dark:text-gray-400 text-sm">{searchTerm ? 'No matches found' : 'No options available'}</div>
                ) : (
                  <div className="py-1">
                    {getFilteredOptions().map((item, index) => (
                      <div
                        key={`${item}-${index}`}
                        onClick={() => handleSelect(item)}
                        className="flex items-center justify-between px-3 py-2 text-sm cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-150"
                      >
                        <span className="text-gray-900 dark:text-gray-100">{item}</span>
                        {selectedItems.includes(item) && <Check className="h-4 w-4 text-blue-500" />}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {selectedItems.length > 0 && (
        <div className="space-y-2">
          <div className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">Selected ({selectedItems.length})</div>
          <div className="flex flex-wrap gap-2">
            {selectedItems.map((item, index) => (
              <div
                key={`selected-${item}-${index}`}
                className={`
                                    inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium
                                    bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300
                                    transition-all duration-200 transform
                                    ${animatingItems.has(item) ? 'scale-110 animate-pulse' : 'scale-100'}
                                    animate-in slide-in-from-left-2 duration-300
                                `}
                style={{
                  animationDelay: `${index * 50}ms`,
                  animationFillMode: 'both',
                }}
              >
                <span>{item}</span>
                {!readOnly && (
                  <button
                    type="button"
                    onClick={() => handleRemove(item)}
                    className="inline-flex items-center justify-center w-4 h-4 rounded-full hover:bg-blue-200 dark:hover:bg-blue-800/40 transition-colors duration-150"
                  >
                    <X className="h-3 w-3" />
                    <span className="sr-only">Remove {item}</span>
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {isOpen && <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />}
    </div>
  );
};

export default DynamicSelectField;
