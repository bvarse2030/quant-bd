/*
|-----------------------------------------
| setting up Page for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

'use client';

import React, { useState, useMemo } from 'react';
import { IoReloadCircleOutline } from 'react-icons/io5';
import { PlusIcon, XIcon, Settings2, RefreshCcw, Filter } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { useGetSessionsQuery } from '@/redux/features/sessions/sessionsSlice';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet';

import AddFile from './components/Add';
import ViewFile from './components/View';
import EditFile from './components/Edit';
import Summary from './components/Summary';
import DeleteFile from './components/Delete';
import SearchBox from './components/SearchBox';
import { useSessionsStore } from './store/store';
import BulkEditFile from './components/BulkEdit';
import { handleSuccess } from './components/utils';
import BulkDeleteFile from './components/BulkDelete';
import ViewSessionsTable from './components/TableView';
import BulkUpdateSessions from './components/BulkUpdate';
import TooManyRequests from './components/TooManyRequest';
import BulkDynamicUpdateSessions from './components/BulkDynamicUpdate';
import FilterDialog, { FilterPayload } from './components/FilterDialog';

const MainNextPage: React.FC = () => {
  const [hashSearchText, setHashSearchText] = useState('');
  const [isFilterModalOpen, setFilterModalOpen] = useState(false);

  const { toggleAddModal, queryPramsLimit, queryPramsPage, queryPramsQ, setQueryPramsPage, setQueryPramsQ } = useSessionsStore();

  const {
    data: getResponseData,
    isSuccess,
    isLoading,
    refetch,
    status: statusCode,
  } = useGetSessionsQuery(
    { q: queryPramsQ, page: queryPramsPage, limit: queryPramsLimit },
    {
      selectFromResult: ({ data, isSuccess, isLoading, status, error }) => ({
        data,
        isSuccess,
        isLoading,
        status: 'status' in (error || {}) ? (error as FetchBaseQueryError).status : status,
        error,
      }),
    },
  );

  const activeFilter = useMemo(() => {
    if (queryPramsQ && queryPramsQ.startsWith('createdAt:range:')) {
      try {
        const datePart = queryPramsQ.split(':')[2];
        const [startDate, endDate] = datePart.split('_');
        return {
          isApplied: true,
          displayText: `Filtering from ${startDate} to ${endDate}`,
        };
      } catch {
        return { isApplied: false, displayText: '' };
      }
    }
    return { isApplied: false, displayText: '' };
  }, [queryPramsQ]);

  const handleSearch = (query: string) => {
    if (query !== hashSearchText) {
      setHashSearchText(query);
      setQueryPramsPage(1);
      setQueryPramsQ(query);
    }
  };

  const handleFilter = () => setFilterModalOpen(true);

  const handleApplyFilter = (filter: FilterPayload) => {
    const { start, end } = filter.value;
    const filterQuery = `createdAt:range:${start}_${end}`;

    setQueryPramsQ(filterQuery);
    setQueryPramsPage(1);
    refetch();
    handleSuccess('Filter Applied!');
  };

  const handleClearFilter = () => {
    setQueryPramsQ('');
    setQueryPramsPage(1);
    refetch();
    handleSuccess('Filter Cleared!');
  };

  const modals = [AddFile, ViewFile, BulkDeleteFile, BulkEditFile, EditFile, DeleteFile, BulkUpdateSessions, BulkDynamicUpdateSessions];

  let renderUI = (
    <div className="container mx-auto md:p-4">
      <div className="flex flex-col md:flex-row gap-2 justify-between items-center mb-6">
        <h1 className="h2 w-full text-white">
          Session Management {isSuccess && <sup className="text-xs text-gray-300">(total:{getResponseData?.data?.total || '00'})</sup>}
        </h1>

        <div className="w-full flex md:hidden justify-end">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outlineWater" size="icon" className="flex items-center justify-center  min-w-1" aria-label="Open actions">
                <Settings2 className="w-5 h-5" />
              </Button>
            </SheetTrigger>

            <SheetContent side="bottom" className="p-6 space-y-5 bg-white/10 backdrop-blur-xl border-t border-white/20 shadow-lg rounded-t-2xl">
              <SheetHeader>
                <SheetTitle className="text-white text-lg font-medium text-center">Session Actions</SheetTitle>
              </SheetHeader>

              <div className="flex flex-col gap-3">
                <Summary />

                <Button size="sm" variant="outlineWater" onClick={handleFilter} disabled={isLoading} className="w-full">
                  <Filter className="w-4 h-4 mr-2" /> Filter
                </Button>

                <Button
                  size="sm"
                  variant="outlineWater"
                  onClick={() => {
                    refetch();
                    handleSuccess('Reloaded!');
                  }}
                  disabled={isLoading}
                  className="w-full"
                >
                  <RefreshCcw className="w-4 h-4 mr-2" /> Reload
                </Button>

                <Button size="sm" variant="outlineGarden" onClick={() => toggleAddModal(true)} className="w-full">
                  <PlusIcon className="w-4 h-4 mr-2" /> Add Session
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        <div className="hidden md:flex flex-row gap-2 items-center justify-end w-full">
          <Summary />
          <Button size="sm" variant="outlineWater" onClick={handleFilter} disabled={isLoading}>
            <Filter className="w-4 h-4 mr-2" /> Filter
          </Button>
          <Button
            size="sm"
            variant="outlineWater"
            onClick={() => {
              refetch();
              handleSuccess('Reloaded!');
            }}
            disabled={isLoading}
          >
            <IoReloadCircleOutline className="w-4 h-4 mr-2" /> Reload
          </Button>
          <Button size="sm" variant="outlineGarden" onClick={() => toggleAddModal(true)}>
            <PlusIcon className="w-4 h-4 mr-2" /> Add Session
          </Button>
        </div>
      </div>

      <SearchBox onSearch={handleSearch} placeholder="Search here ..." autoFocus={false} />

      {activeFilter.isApplied && (
        <div className="flex items-center justify-start my-4">
          <Badge
            variant="secondary"
            className="flex items-center gap-2 pl-3 pr-1 py-1 text-sm font-normal bg-white/10 backdrop-blur-xl border border-white/20 text-white shadow-md"
          >
            <span>{activeFilter.displayText}</span>
            <Button
              aria-label="Clear filter"
              variant="ghost"
              size="icon"
              className="h-6 w-6 rounded-full text-white hover:bg-white/20"
              onClick={handleClearFilter}
            >
              <XIcon className="h-4 w-4" />
            </Button>
          </Badge>
        </div>
      )}

      <div className="bg-white/5 backdrop-blur-md md:p-4 rounded-2xl shadow-md border border-white/10">
        <ViewSessionsTable />
      </div>

      {modals.map((ModalComponent, index) => (
        <ModalComponent key={index} />
      ))}

      <FilterDialog isOpen={isFilterModalOpen} onOpenChange={setFilterModalOpen} onApplyFilter={handleApplyFilter} onClearFilter={handleClearFilter} />
    </div>
  );

  if (statusCode === 429) renderUI = <TooManyRequests />;

  return renderUI;
};

export default MainNextPage;
