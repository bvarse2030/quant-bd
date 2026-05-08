/*
|-----------------------------------------
| setting up DynamicSelectField for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

'use client';

import React, { useEffect, useState, useMemo, useCallback, useRef } from 'react';
import { X, ChevronDown, Search, Check, Loader2, AlertCircle, RefreshCw } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

export interface DynamicSelectFieldProps {
  id?: string;
  label?: string;
  value: string[] | undefined | null;
  onChange: (newValues: string[]) => void;
  apiUrl?: string;
  placeholder?: string;
  readOnly?: boolean;
  dataMapper?: (item: IResponseData) => string;
}

interface IResponseData {
  id: number;
  name: string;
}

interface CachedData {
  data: string[];
  timestamp: number;
}

const MAX_RETRIES = 5;
const RETRY_DELAY = 1000;

export default function DynamicSelectField({
  id,
  label = 'Select One',
  value,
  onChange,
  apiUrl = 'https://jsonplaceholder.typicode.com/users',
  placeholder = 'Search and select...',
  readOnly = false,
  dataMapper = (item: IResponseData) => item.name,
}: DynamicSelectFieldProps) {
  const [availableData, setAvailableData] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeIndex, setActiveIndex] = useState(-1);

  const [lastFetchTime, setLastFetchTime] = useState<number | null>(null);

  const wrapperRef = useRef<HTMLDivElement>(null);

  const safeValue = useMemo(() => value ?? [], [value]);

  const storageKey = useMemo(() => `dynamic-select-cache-${apiUrl}`, [apiUrl]);

  const fetchData = useCallback(
    async (forceUpdate = false) => {
      setIsLoading(true);
      setError(null);

      if (!forceUpdate) {
        try {
          const cachedItem = localStorage.getItem(storageKey);
          if (cachedItem) {
            const parsed: CachedData = JSON.parse(cachedItem);
            if (Array.isArray(parsed.data)) {
              setAvailableData(parsed.data);
              setLastFetchTime(parsed.timestamp);
              setIsLoading(false);
              return;
            }
          }
        } catch (e) {
          console.warn('Error reading from local storage', e);
        }
      }

      for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
        try {
          const response = await fetch(apiUrl);
          if (!response.ok) throw new Error(`API Error: ${response.status}`);
          const json = await response.json();

          if (!Array.isArray(json)) {
            setError('Invalid data format received');
            setIsLoading(false);
            return;
          }

          if (json.length === 0) {
            setAvailableData([]);
            setIsLoading(false);
            return;
          }

          const mapped = json.map(dataMapper);
          const uniqueData = Array.from(new Set(mapped));

          const timestamp = Date.now();
          setAvailableData(uniqueData);
          setLastFetchTime(timestamp);

          try {
            localStorage.setItem(
              storageKey,
              JSON.stringify({
                data: uniqueData,
                timestamp: timestamp,
              }),
            );
          } catch (storageErr) {
            console.error('Failed to save to localStorage', storageErr);
          }

          setIsLoading(false);
          return;
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (err) {
          if (attempt === MAX_RETRIES) {
            setError('Failed to load options. Try again.');
            setIsLoading(false);
          } else {
            await new Promise(res => setTimeout(res, RETRY_DELAY));
          }
        }
      }
    },
    [apiUrl, dataMapper, storageKey],
  );

  useEffect(() => {
    fetchData(false);
  }, [fetchData]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const filteredOptions = useMemo(
    () => availableData.filter(item => !safeValue.includes(item)).filter(item => item.toLowerCase().includes(searchTerm.toLowerCase())),
    [availableData, safeValue, searchTerm],
  );

  const handleSelect = (item: string) => {
    if (readOnly) return;
    onChange([...safeValue, item]);
    setSearchTerm('');
    setIsOpen(false);
    setActiveIndex(-1);
  };

  const handleRemove = (item: string) => {
    if (readOnly) return;
    onChange(safeValue.filter(i => i !== item));
  };

  const handleReload = (e: React.MouseEvent) => {
    e.stopPropagation();
    fetchData(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex(i => Math.min(i + 1, filteredOptions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex(i => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && activeIndex >= 0) {
      e.preventDefault();
      handleSelect(filteredOptions[activeIndex]);
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const formatLastUpdated = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={cn('relative space-y-1.5 w-full max-w-2xl', isOpen && 'mb-64')} ref={wrapperRef}>
      <div className="flex items-center justify-between">
        {label && (
          <Label htmlFor={id} className="text-white">
            {label}
          </Label>
        )}

        <div className="flex items-center gap-2">
          {lastFetchTime && <span className="text-[10px] text-white/50">Updated: {formatLastUpdated(lastFetchTime)}</span>}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-6 px-2 text-xs text-white/70 hover:text-white hover:bg-white/10"
            onClick={handleReload}
            disabled={isLoading || readOnly}
          >
            <RefreshCw className={cn('h-3 w-3 mr-1', isLoading && 'animate-spin')} />
            Reload
          </Button>
        </div>
      </div>

      <div
        id={id}
        className={cn(
          'relative flex items-center min-h-11 w-full rounded-lg border border-white/20 px-3 py-2 text-sm backdrop-blur-lg bg-white/10 text-white transition-all',
          readOnly ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
          isOpen && 'ring-2 ring-white/40 shadow-lg',
        )}
        onClick={() => !readOnly && setIsOpen(!isOpen)}
      >
        <span className="flex-1 text-white/80">{safeValue.length > 0 ? `${safeValue.length} selected` : placeholder}</span>

        {isLoading && <Loader2 className="animate-spin h-4 w-4" />}
        {error && <AlertCircle className="h-4 w-4 text-rose-400" />}
        {!isLoading && !error && <ChevronDown className={cn('h-4 w-4 transition-transform', isOpen && 'rotate-180')} />}
      </div>

      {isOpen && (
        <div className="absolute left-0 right-0 mt-2 z-50 bg-white/10 backdrop-blur-xl shadow-xl rounded-lg border border-white/20 text-white animate-in fade-in-0 zoom-in-95">
          <div className="p-2 border-b border-white/10">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/70" />
              <input
                autoFocus
                type="text"
                className="w-full rounded bg-transparent pl-9 pr-3 py-1 text-sm text-white placeholder-white/40 focus:outline-none"
                placeholder="Search..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </div>
          </div>
          <div className="max-h-[200px] overflow-y-auto p-1 pb-2">
            {error ? (
              <div className="text-center text-sm text-rose-300 py-3 space-y-2">
                <AlertCircle className="w-5 h-5 mx-auto" />
                <span>{error}</span>
                <Button variant="outline" size="sm" onClick={() => fetchData(true)} className="bg-white/10 border-white/20 hover:bg-white/20 text-white">
                  Retry
                </Button>
              </div>
            ) : filteredOptions.length > 0 ? (
              <ul className="space-y-1">
                {filteredOptions.map((item, idx) => (
                  <li
                    key={item}
                    onClick={() => handleSelect(item)}
                    onMouseEnter={() => setActiveIndex(idx)}
                    className={cn(
                      'flex justify-between items-center px-3 py-2 text-sm rounded-md cursor-pointer hover:bg-white/20',
                      activeIndex === idx && 'bg-white/30',
                    )}
                  >
                    {item}
                    {safeValue.includes(item) && <Check className="w-4 h-4" />}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-center text-sm text-white/50 py-3">{isLoading ? 'Loading...' : 'No results'}</p>
            )}
          </div>
        </div>
      )}

      {safeValue.length > 0 && !isOpen && (
        <div className="flex flex-wrap gap-2 pt-2">
          {safeValue.map((item, i) => (
            <div
              key={`${item}-${i}`}
              className="flex items-center gap-1.5 bg-white/20 backdrop-blur-lg px-2.5 py-1 rounded-full text-xs font-medium text-white"
            >
              {item}
              {!readOnly && (
                <button type="button" onClick={() => handleRemove(item)} className="hover:bg-white/30 rounded-full p-1">
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
