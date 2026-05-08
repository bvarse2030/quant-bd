/*
|-----------------------------------------
| setting up TableView for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

'use client';

import { format } from 'date-fns';
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MoreHorizontalIcon, EyeIcon, PencilIcon, TrashIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import LoadingComponent from '@/components/common/Loading';
import ErrorMessageComponent from '@/components/common/Error';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useGetAccessManagementsQuery } from '@/redux/features/accessManagements/accessManagementsSlice';

import Pagination from './Pagination';
import { pageLimitArr } from '../store/store-constant';
import { IAccessManagements } from '../store/data/data';
import { useAccessManagementsStore } from '../store/store';

type DisplayableAccessManagementsKeys = 'user_name' | 'user_email' | 'assign_role' | 'given_by_email' | 'createdAt';
type ColumnVisibilityState = Record<DisplayableAccessManagementsKeys, boolean>;

const ViewTableNextComponents: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [sortConfig, setSortConfig] = useState<{
    key: DisplayableAccessManagementsKeys;
    direction: 'asc' | 'desc';
  } | null>(null);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const {
    setSelectedAccessManagements,
    toggleViewModal,
    queryPramsLimit,
    queryPramsPage,
    queryPramsQ,
    toggleEditModal,
    toggleDeleteModal,
    bulkData,
    setBulkData,
    setQueryPramsLimit,
    setQueryPramsPage,
    toggleBulkDeleteModal,
  } = useAccessManagementsStore();

  const {
    data: getResponseData,
    isLoading,
    isError,
    error,
  } = useGetAccessManagementsQuery({
    q: queryPramsQ,
    limit: queryPramsLimit,
    page: queryPramsPage,
  });

  const allData = useMemo(() => getResponseData?.data?.accessManagements || [], [getResponseData]);

  const tableHeaders: { key: DisplayableAccessManagementsKeys; label: string }[] = useMemo(
    () => [
      { key: 'user_name', label: 'User Name' },
      { key: 'user_email', label: 'User Email' },
      { key: 'assign_role', label: 'Assign Role' },
      { key: 'given_by_email', label: 'Given by(email)' },
      { key: 'createdAt', label: 'Created At' },
    ],
    [],
  );

  const [columnVisibility, setColumnVisibility] = useState<ColumnVisibilityState>(() => {
    const initialState = {} as ColumnVisibilityState;
    for (const header of tableHeaders) initialState[header.key] = true;
    return initialState;
  });

  const visibleHeaders = useMemo(() => tableHeaders.filter(header => columnVisibility[header.key]), [columnVisibility, tableHeaders]);

  const formatDate = (date?: Date | string) => {
    if (!date) return 'N/A';
    try {
      return format(new Date(date), 'MMM dd, yyyy');
    } catch {
      return 'Invalid Date';
    }
  };

  const handleSort = (key: DisplayableAccessManagementsKeys) => {
    setSortConfig(prev => (prev?.key === key ? { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' } : { key, direction: 'asc' }));
  };

  const sortedData = useMemo(() => {
    if (!sortConfig) return allData;
    return [...allData].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      if (aValue === undefined || aValue === null) return 1;
      if (bValue === undefined || bValue === null) return -1;
      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [allData, sortConfig]);

  const handleSelectAll = (isChecked: boolean) => setBulkData(isChecked ? allData : []);
  const handleSelectRow = (isChecked: boolean, item: IAccessManagements) =>
    setBulkData(isChecked ? [...bulkData, item] : bulkData.filter(i => i._id !== item._id));

  const renderActions = (item: IAccessManagements) => {
    return (
      <div className="flex justify-end items-center">
        <div className="hidden md:flex gap-2">
          <Button
            variant="outlineWater"
            className="min-w-[8px] hover:scale-105 transition-transform"
            size="sm"
            onClick={() => {
              setSelectedAccessManagements(item);
              toggleViewModal(true);
            }}
          >
            <EyeIcon className="w-4 h-4" />
          </Button>
          <Button
            variant="outlineWater"
            className="min-w-[8px] hover:scale-105 transition-transform"
            size="sm"
            onClick={() => {
              setSelectedAccessManagements(item);
              toggleEditModal(true);
            }}
          >
            <PencilIcon className="w-4 h-4" />
          </Button>
          <Button
            variant="destructive"
            className="min-w-[8px] hover:scale-105 transition-transform"
            size="sm"
            onClick={() => {
              setSelectedAccessManagements(item);
              toggleDeleteModal(true);
            }}
          >
            <TrashIcon className="w-4 h-4" />
          </Button>
        </div>

        <div className="md:hidden">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button size="icon" variant="outlineWater" className="min-w-[8px] rounded-full border-none">
                <MoreHorizontalIcon className="h-4 w-4" />
              </Button>
            </SheetTrigger>

            <SheetContent
              side="bottom"
              className={cn(
                'w-full backdrop-blur-xl bg-white/10 border-t border-white/20 text-white shadow-2xl',
                'rounded-t-2xl p-4 flex flex-col space-y-4 animate-in slide-in-from-bottom',
              )}
            >
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-base font-semibold text-white/90">Actions</h2>
              </div>

              <Button
                variant="outlineWater"
                size="sm"
                onClick={() => {
                  setSelectedAccessManagements(item);
                  toggleViewModal(true);
                  setOpen(false);
                }}
              >
                <EyeIcon className="w-4 h-4 mr-2" /> View
              </Button>

              <Button
                variant="outlineWater"
                size="sm"
                onClick={() => {
                  setSelectedAccessManagements(item);
                  toggleEditModal(true);
                  setOpen(false);
                }}
              >
                <PencilIcon className="w-4 h-4 mr-2" /> Edit
              </Button>

              <Button
                variant="destructive"
                size="sm"
                onClick={() => {
                  setSelectedAccessManagements(item);
                  toggleDeleteModal(true);
                  setOpen(false);
                }}
              >
                <TrashIcon className="w-4 h-4 mr-2" /> Delete
              </Button>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    );
  };

  const renderTableRows = () => (
    <AnimatePresence mode="popLayout">
      {sortedData.map((item: IAccessManagements, idx: number) => (
        <motion.tr
          key={item._id || idx}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2, delay: idx * 0.03 }}
          className="border-b transition-colors hover:bg-white/5 data-[state=selected]:bg-muted"
        >
          <TableCell>
            <Checkbox onCheckedChange={checked => handleSelectRow(!!checked, item)} checked={bulkData.some(i => i._id === item._id)} />
          </TableCell>
          {visibleHeaders.map((header, hIdx) => (
            <TableCell key={header.key + hIdx} className="text-slate-200">
              {header.key === 'createdAt' ? formatDate(item.createdAt) : String(item[header.key] ?? '')}
            </TableCell>
          ))}
          <TableCell className="text-right max-w-[10px]">{renderActions(item)}</TableCell>
        </motion.tr>
      ))}
    </AnimatePresence>
  );

  if (isLoading) return <LoadingComponent />;
  if (isError) return <ErrorMessageComponent message={error?.toString() || 'An error occurred'} />;

  const TableHeaderContent = () => (
    <TableHeader>
      <TableRow className="bg-blue-300/40 text-white font-bold hover:bg-blue-300/50">
        <TableHead>
          <Checkbox onCheckedChange={checked => handleSelectAll(!!checked)} checked={bulkData.length === allData.length && allData.length > 0} />
        </TableHead>
        {visibleHeaders.map(({ key, label }) => (
          <TableHead
            key={key + label}
            className="cursor-pointer bg-accent-100/60 text-slate-50 font-bold whitespace-nowrap transition-colors hover:text-white"
            onClick={() => handleSort(key)}
          >
            <div className="flex items-center gap-1">
              {label}
              {sortConfig?.key === key && (
                <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  {sortConfig.direction === 'asc' ? '↑' : '↓'}
                </motion.span>
              )}
            </div>
          </TableHead>
        ))}
        <TableHead className="text-right bg-accent-100/60 text-slate-50 font-bold whitespace-nowrap">Actions</TableHead>
      </TableRow>
    </TableHeader>
  );

  return (
    <div className="w-full flex flex-col">
      <div className="w-full my-4">
        <div className="w-full flex md:flex-row items-center justify-between gap-4 pb-2 border-b border-white/10">
          <div className="flex items-center gap-2 justify-start w-full">
            <Label className="text-slate-200">Selected:</Label>
            <span className="text-sm text-slate-400">({bulkData.length})</span>
          </div>

          <div className="hidden md:flex items-center justify-end w-full gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outlineWater" size="sm">
                  <MoreHorizontalIcon className="w-4 h-4 mr-2" />
                  Columns
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-slate-900 border-white/10 text-slate-200">
                <DropdownMenuLabel>Toggle Columns</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-white/10" />
                {tableHeaders.map((header, idx) => (
                  <DropdownMenuCheckboxItem
                    key={header.key + idx}
                    className="capitalize mb-1 cursor-pointer focus:bg-white/10 focus:text-white"
                    checked={columnVisibility[header.key]}
                    onCheckedChange={value =>
                      setColumnVisibility(prev => ({
                        ...prev,
                        [header.key]: !!value,
                      }))
                    }
                  >
                    {header.label}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              size="sm"
              variant="destructive"
              onClick={() => toggleBulkDeleteModal(true)}
              disabled={bulkData.length === 0}
              className="shadow-lg shadow-destructive/20"
            >
              <TrashIcon className="w-4 h-4 mr-1" /> B.Delete
            </Button>
          </div>

          <div className="flex md:hidden justify-end w-full">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button size="icon" variant="outlineWater" className="rounded-full backdrop-blur-md bg-white/10 border-white/20 min-w-[8px]">
                  <MoreHorizontalIcon className="h-5 w-5" />
                </Button>
              </SheetTrigger>

              <SheetContent
                side="right"
                className={cn(
                  'w-64 sm:w-72 backdrop-blur-xl bg-white/10 border border-white/20 text-white shadow-2xl',
                  'rounded-l-2xl p-4 flex flex-col space-y-4',
                )}
              >
                <SheetHeader className="flex justify-between items-center">
                  <SheetTitle className="text-lg font-semibold text-white/90">Options</SheetTitle>
                </SheetHeader>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outlineWater" size="sm" className="justify-start w-full">
                      Columns
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-slate-900 border-white/10 text-slate-200">
                    <DropdownMenuLabel>Toggle Columns</DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-white/10" />
                    {tableHeaders.map((header, idx) => (
                      <DropdownMenuCheckboxItem
                        key={header.key + idx}
                        className="capitalize focus:bg-white/10 focus:text-white"
                        checked={columnVisibility[header.key]}
                        onCheckedChange={value =>
                          setColumnVisibility(prev => ({
                            ...prev,
                            [header.key]: !!value,
                          }))
                        }
                      >
                        {header.label}
                      </DropdownMenuCheckboxItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => toggleBulkDeleteModal(true)}
                  disabled={bulkData.length === 0}
                  className="w-full justify-start"
                >
                  <TrashIcon className="w-4 h-4 mr-2" /> B.Delete
                </Button>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      {allData.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-12 text-center text-2xl text-slate-400 font-light">
          Ops! Nothing was found.
        </motion.div>
      ) : (
        <div className="md:max-w-full max-w-[380px] overflow-x-scroll md:overflow-x-auto">
          <div className="md:hidden block">
            <ScrollArea
              className={cn(
                'w-[420px] sm:w-[760px] md:w-full rounded-md border border-white/10 bg-white/5 backdrop-blur-md whitespace-nowrap transition-all duration-300',
              )}
            >
              <div className="flex w-max">
                <Table className="border-collapse">
                  <TableHeaderContent />
                  <TableBody>{renderTableRows()}</TableBody>
                </Table>
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </div>

          <div className="hidden md:block">
            <div className="rounded-lg border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden">
              <Table className="border-collapse">
                <TableHeaderContent />
                <TableBody>{renderTableRows()}</TableBody>
              </Table>
            </div>
          </div>
        </div>
      )}

      <div className="mt-6">
        <Pagination
          currentPage={queryPramsPage}
          itemsPerPage={queryPramsLimit}
          onPageChange={page => setQueryPramsPage(page)}
          totalItems={getResponseData?.data?.total || 0}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-xs flex items-center self-center justify-between pl-2 gap-4 border border-white/10 rounded-lg w-full mx-auto mt-8 bg-white/5 backdrop-blur-md mb-8"
      >
        <Label htmlFor="set-limit" className="text-right text-slate-300 font-normal pl-3">
          Data per page
        </Label>
        <Select
          onValueChange={value => {
            setQueryPramsLimit(Number(value));
            setQueryPramsPage(1);
          }}
          defaultValue={queryPramsLimit.toString()}
        >
          <SelectTrigger className="border-0 bg-transparent text-slate-200 focus:ring-0">
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent className="bg-slate-900 border-white/10 text-slate-200">
            {pageLimitArr.map((i, idx) => (
              <SelectItem key={i + idx} value={i.toString()} className="cursor-pointer focus:bg-white/10 focus:text-white">
                {i}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </motion.div>
    </div>
  );
};

export default ViewTableNextComponents;
