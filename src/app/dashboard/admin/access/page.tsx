/*
|-----------------------------------------
| setting up Page for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

'use client';

import { PlusIcon, XIcon } from 'lucide-react';
import React, { useState, useMemo } from 'react';
import { IoReloadCircleOutline } from 'react-icons/io5';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { useGetAccessManagementsQuery } from '@/redux/features/accessManagements/accessManagementsSlice';

import AddFile from './components/Add';
import EditFile from './components/Edit';
import ViewFile from './components/View';
import DeleteFile from './components/Delete';
import SearchBox from './components/SearchBox';
import { handleSuccess } from './components/utils';
import BulkDeleteFile from './components/BulkDelete';
import TooManyRequests from './components/TooManyRequest';
import { useAccessManagementsStore } from './store/store';
import ViewAccessManagementsTable from './components/TableView';

const MainNextPage: React.FC = () => {
  const [hashSearchText, setHashSearchText] = useState('');

  const { toggleAddModal, queryPramsLimit, queryPramsPage, queryPramsQ, setQueryPramsPage, setQueryPramsQ } = useAccessManagementsStore();

  const {
    data: getResponseData,
    isSuccess,
    isLoading,
    refetch,
    status: statusCode,
  } = useGetAccessManagementsQuery(
    { q: queryPramsQ, page: queryPramsPage, limit: queryPramsLimit },
    {
      selectFromResult: ({ data, isSuccess, isLoading, status, error }) => ({
        data,
        isSuccess,
        isLoading,
        status: 'status' in (error || {}) ? (error as FetchBaseQueryError).status : status, // Extract HTTP status code
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
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (e) {
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

  const handleClearFilter = () => {
    setQueryPramsQ('');
    setQueryPramsPage(1);
    refetch();
    handleSuccess('Filter Cleared!');
  };

  const modals = [AddFile, ViewFile, BulkDeleteFile, EditFile, DeleteFile];

  let renderUI = (
    <div className="container mx-auto p-2 md:p-4">
      <div className="flex flex-col md:flex-row gap-2 justify-between items-center mb-6">
        <h1 className="h2 w-full">Access {isSuccess && <sub className="text-xs text-slate-200">(total:{getResponseData?.data?.total || '00'})</sub>}</h1>
        <div className="w-full flex flex-col md:flex-row gap-2 item-center justify-end">
          <Button
            size="sm"
            variant="outlineWater"
            onClick={() => {
              refetch();
              handleSuccess('Reloaded!');
            }}
            disabled={isLoading}
          >
            <IoReloadCircleOutline className="w-4 h-4 mr-1" /> Reload
          </Button>
          <Button size="sm" variant="outlineGarden" onClick={() => toggleAddModal(true)}>
            <PlusIcon className="w-4 h-4" />
            Add User
          </Button>
        </div>
      </div>
      <SearchBox onSearch={handleSearch} placeholder="Search here ..." autoFocus={false} />

      {activeFilter.isApplied && (
        <div className="flex items-center justify-start my-4">
          <Badge variant="secondary" className="flex items-center gap-2 pl-3 pr-1 py-1 text-sm font-normal">
            <span>{activeFilter.displayText}</span>
            <Button aria-label="Clear filter" variant="ghost" size="icon" className="h-6 w-6 rounded-full" onClick={handleClearFilter}>
              <XIcon className="h-4 w-4" />
            </Button>
          </Badge>
        </div>
      )}

      <ViewAccessManagementsTable />
      {modals.map((ModalComponent, index) => (
        <ModalComponent key={index} />
      ))}
    </div>
  );

  if (statusCode === 429) {
    renderUI = <TooManyRequests />;
  }

  return renderUI;
};

export default MainNextPage;
