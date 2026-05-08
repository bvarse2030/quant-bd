/*
|-----------------------------------------
| setting up Page for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

'use client';

import React, { useState } from 'react';
import { Plus, Settings2, RefreshCcw } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { useGetRolesQuery } from '@/redux/features/roles/rolesSlice';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet';

import AddFile from './components/Add';
import EditFile from './components/Edit';
import ViewFile from './components/View';
import DeleteFile from './components/Delete';
import { useRolesStore } from './store/store';
import SearchBox from './components/SearchBox';
import { handleSuccess } from './components/utils';
import ViewRolesTable from './components/TableView';
import BulkDeleteFile from './components/BulkDelete';
import TooManyRequests from './components/TooManyRequest';

const MainNextPage: React.FC = () => {
  const [hashSearchText, setHashSearchText] = useState('');

  const { toggleAddModal, queryPramsLimit, queryPramsPage, queryPramsQ, setQueryPramsPage, setQueryPramsQ } = useRolesStore();

  const {
    data: getResponseData,
    isSuccess,
    isLoading,
    refetch,
    status: statusCode,
  } = useGetRolesQuery(
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

  const handleSearch = (query: string) => {
    if (query !== hashSearchText) {
      setHashSearchText(query);
      setQueryPramsPage(1);
      setQueryPramsQ(query);
    }
  };

  const modals = [AddFile, ViewFile, BulkDeleteFile, EditFile, DeleteFile];

  let renderUI = (
    <div className="container mx-auto md:p-4">
      <div className="flex flex-col md:flex-row gap-2 justify-between items-center mb-6">
        <h1 className="h2 w-full">Role Management {isSuccess && <sup className="text-xs">(total:{getResponseData?.data?.total || '00'})</sup>}</h1>

        <div className="w-full flex md:hidden justify-end">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outlineWater" size="icon" className="flex items-center justify-center" aria-label="Open actions">
                <Settings2 className="w-5 h-5" />
              </Button>
            </SheetTrigger>

            <SheetContent side="bottom" className="p-6 space-y-5 bg-white/10 backdrop-blur-xl border-t border-white/20 shadow-lg rounded-t-2xl">
              <SheetHeader>
                <SheetTitle className="text-white text-lg font-medium text-center">Role Actions</SheetTitle>
              </SheetHeader>

              <div className="flex flex-col gap-3">
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
                  <Plus className="w-4 h-4 mr-2" /> Add Role
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        <div className="hidden md:flex flex-row gap-2 items-center justify-end w-full">
          <Button
            size="sm"
            variant="outlineWater"
            onClick={() => {
              refetch();
              handleSuccess('Reloaded!');
            }}
            disabled={isLoading}
          >
            <RefreshCcw className="w-4 h-4 mr-2" /> Reload
          </Button>
          <Button size="sm" variant="outlineGarden" onClick={() => toggleAddModal(true)}>
            <Plus className="w-4 h-4 mr-2" /> Add Role
          </Button>
        </div>
      </div>
      <SearchBox onSearch={handleSearch} placeholder="Search here ..." autoFocus={false} />
      <ViewRolesTable />

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
