'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { DateRange } from 'react-day-picker';
import { IoReloadCircleOutline } from 'react-icons/io5';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { format, subMonths, startOfMonth, endOfMonth } from 'date-fns';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  PieLabelRenderProps,
} from 'recharts';
import {
  Calendar as CalendarIcon,
  DownloadIcon,
  EyeIcon,
  Filter,
  Loader2,
  MoreHorizontalIcon,
  PencilIcon,
  PlusIcon,
  RefreshCcw,
  Search,
  Settings2,
  TrashIcon,
  TrendingUp,
  BarChart3,
  PieChart,
  Calendar as CalendarIconRC,
  Activity,
  X,
  XIcon,
  Plus,
} from 'lucide-react';

import { cn } from '@/lib/utils';
import { useSession } from '@/lib/auth-client';

import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Pagination as UIPagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';

import AutocompleteField from '@/components/dashboard-ui/AutocompleteField';
import ColorPickerField from '@/components/dashboard-ui/ColorPickerField';
import DateRangePickerField from '@/components/dashboard-ui/DateRangePickerField';
import DynamicSelectField from '@/components/dashboard-ui/DynamicSelectField';
import ImageUploadManagerSingle from '@/components/dashboard-ui/imageBB/ImageUploadManagerSingle';
import ImageUploadManager from '@/components/dashboard-ui/imageBB/ImageUploadManager';
import InputFieldForEmail from '@/components/dashboard-ui/InputFieldForEmail';
import InputFieldForPasscode from '@/components/dashboard-ui/InputFieldForPasscode';
import InputFieldForPassword from '@/components/dashboard-ui/InputFieldForPassword';
import InputFieldForString from '@/components/dashboard-ui/InputFieldForString';
import JsonTextareaField from '@/components/dashboard-ui/JsonTextareaField';
import MultiCheckboxGroupField from '@/components/dashboard-ui/MultiCheckboxGroupField';
import MultiOptionsField from '@/components/dashboard-ui/MultiOptionsField';
import NumberInputFieldFloat from '@/components/dashboard-ui/NumberInputFieldFloat';
import NumberInputFieldInteger from '@/components/dashboard-ui/NumberInputFieldInteger';
import PhoneInputField from '@/components/dashboard-ui/PhoneInputField';
import RichTextEditorField from '@/components/dashboard-ui/RichTextEditorField';
import TextareaFieldForDescription from '@/components/dashboard-ui/TextareaFieldForDescription';
import TimeField from '@/components/dashboard-ui/TimeField';
import TimeRangePickerField from '@/components/dashboard-ui/TimeRangePickerField';
import UrlInputField from '@/components/dashboard-ui/UrlInputField';
import { BooleanInputField } from '@/components/dashboard-ui/BooleanInputField';
import { CheckboxField } from '@/components/dashboard-ui/CheckboxField';
import { DateField } from '@/components/dashboard-ui/DateField';
import { RadioButtonGroupField } from '@/components/dashboard-ui/RadioButtonGroupField';
import { SelectField } from '@/components/dashboard-ui/SelectField';

import LoadingComponent from '@/components/common/Loading';
import ErrorMessageComponent from '@/components/common/Error';

import {
  useAddPostsMutation,
  useBulkDeletePostsMutation,
  useBulkUpdatePostsMutation,
  useDeletePostsMutation,
  useGetPostsByIdQuery,
  useGetPostsQuery,
  useGetPostsSummaryQuery,
  useUpdatePostsMutation,
} from '@/redux/features/posts/postsSlice';

import { IPosts, StringArrayData, defaultPosts, pageLimitArr, postsSelectorArr, usePostsStore } from './store';

type ApiErrorResponse = { data: { message: string } };

const isApiErrorResponse = (error: unknown): error is ApiErrorResponse => {
  return (
    typeof error === 'object' &&
    error !== null &&
    'data' in error &&
    typeof (error as { data: unknown }).data === 'object' &&
    (error as { data: unknown }).data !== null &&
    'message' in (error as { data: Record<string, unknown> }).data
  );
};

const formatDuplicateKeyError = (msg?: string): string | undefined => {
  if (!msg) return undefined;
  const m = msg.match(/index:\s+(\S+?)_\d+\s+dup key/);
  if (m) return `Duplicate value for field: ${m[1]}`;
  const m2 = msg.match(/E11000[^:]*:\s*(.+)/);
  if (m2) return m2[1];
  return msg;
};

const handleSuccess = (message: string): void => {
  try {
    toast.success(message);
  } catch {
    console.log('[Success]', message);
  }
};

const handleError = (message: string): void => {
  try {
    toast.error(message);
  } catch {
    console.error('[Error]', message);
  }
};

interface StringArrayFieldProps {
  value: StringArrayData[];
  onChange: (value: StringArrayData[]) => void;
}

const StringArrayField: React.FC<StringArrayFieldProps> = ({ value, onChange }) => {
  const [input, setInput] = useState('');

  const addItem = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    const next = [...(value || []), { name: trimmed } as StringArrayData];
    onChange(next);
    setInput('');
  };

  const removeItem = (idx: number) => {
    const next = [...(value || [])];
    next.splice(idx, 1);
    onChange(next);
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        <Input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Add new item..."
          className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
          onKeyDown={e => {
            if (e.key === 'Enter') {
              e.preventDefault();
              addItem();
            }
          }}
        />
        <Button type="button" size="sm" variant="outlineWater" onClick={addItem}>
          <Plus className="w-4 h-4" />
        </Button>
      </div>
      <div className="flex flex-wrap gap-2">
        {(value || []).map((item, idx) => (
          <Badge key={(item._id as string) || idx} variant="secondary" className="flex items-center gap-1 bg-white/10 border border-white/20 text-white">
            {String(item.name || '')}
            <button type="button" onClick={() => removeItem(idx)} className="ml-1 rounded-full hover:bg-white/20" aria-label="Remove">
              <X className="w-3 h-3" />
            </button>
          </Badge>
        ))}
      </div>
    </div>
  );
};

interface DynamicDataSelectProps {
  label: string;
  newItemTags: string[];
  setNewItemTags: React.Dispatch<React.SetStateAction<string[]>>;
}

const DynamicDataSelect: React.FC<DynamicDataSelectProps> = ({ label, newItemTags, setNewItemTags }) => {
  const [input, setInput] = useState('');

  const addTag = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    setNewItemTags(prev => [...prev, trimmed]);
    setInput('');
  };

  const removeTag = (idx: number) => {
    setNewItemTags(prev => prev.filter((_, i) => i !== idx));
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      <Label className="text-white/90">{label}</Label>
      <div className="flex gap-2">
        <Input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Type and press Add"
          onKeyDown={e => {
            if (e.key === 'Enter') {
              e.preventDefault();
              addTag();
            }
          }}
        />
        <Button type="button" size="sm" variant="outline" onClick={addTag}>
          <Plus className="w-4 h-4" />
        </Button>
      </div>
      <div className="flex flex-wrap gap-2">
        {newItemTags.map((tag, idx) => (
          <Badge key={tag + idx} variant="secondary" className="flex items-center gap-1">
            {tag}
            <button type="button" onClick={() => removeTag(idx)} className="ml-1 rounded-full" aria-label="Remove">
              <X className="w-3 h-3" />
            </button>
          </Badge>
        ))}
      </div>
    </div>
  );
};

interface PaginationProps {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, itemsPerPage, totalItems, onPageChange }) => {
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const canPrev = currentPage > 1;
  const canNext = currentPage < totalPages;

  const pages: number[] = [];
  const maxPagesToShow = 5;
  let start = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
  const end = Math.min(totalPages, start + maxPagesToShow - 1);
  if (end - start + 1 < maxPagesToShow) {
    start = Math.max(1, end - maxPagesToShow + 1);
  }
  for (let i = start; i <= end; i++) pages.push(i);

  return (
    <div className="flex items-center justify-between gap-2 mt-6 flex-wrap w-full">
      <div className="flex items-center justify-start gap-2">
        <Button size="sm" variant="outlineWater" disabled={!canPrev} onClick={() => canPrev && onPageChange(currentPage - 1)} className="min-w-1">
          Previous
        </Button>
        {pages.map(p => (
          <Button key={p} size="sm" variant={p === currentPage ? 'outlineGarden' : 'outlineWater'} onClick={() => onPageChange(p)} className="min-w-1">
            {p}
          </Button>
        ))}
        <Button size="sm" variant="outlineWater" disabled={!canNext} onClick={() => canNext && onPageChange(currentPage + 1)} className="min-w-1">
          Next
        </Button>
      </div>
      <span className="text-sm text-slate-300 ml-2">
        Page {currentPage} of {totalPages}
      </span>
    </div>
  );
};

interface ExportDialogProps<T extends { key: string; label: string }> {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  headers: T[];
  data: IPosts[];
  fileName: string;
}

const ExportDialog = <T extends { key: string; label: string }>({ isOpen, onOpenChange, headers, data, fileName }: ExportDialogProps<T>) => {
  const [selectedKeys, setSelectedKeys] = useState<string[]>(headers.map(h => h.key));

  const toggleKey = (key: string, checked: boolean) => {
    setSelectedKeys(prev => (checked ? [...prev, key] : prev.filter(k => k !== key)));
  };

  const handleExport = () => {
    const activeHeaders = headers.filter(h => selectedKeys.includes(h.key));
    const csvRows: string[] = [];
    csvRows.push(activeHeaders.map(h => `"${h.label}"`).join(','));
    for (const row of data) {
      const values = activeHeaders.map(h => {
        const raw = (row as unknown as Record<string, unknown>)[h.key];
        const str = raw === null || raw === undefined ? '' : typeof raw === 'object' ? JSON.stringify(raw) : String(raw);
        return `"${str.replace(/"/g, '""')}"`;
      });
      csvRows.push(values.join(','));
    }
    const csv = csvRows.join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName.replace(/\.xlsx$/i, '.csv');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    onOpenChange(false);
    handleSuccess('Export Successful');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-xl border border-white/20 bg-white/10 backdrop-blur-2xl shadow-xl text-white">
        <DialogHeader>
          <DialogTitle className="bg-clip-text bg-linear-to-r from-white to-blue-200 text-white">Export Data</DialogTitle>
          <DialogDescription className="text-white/70">Select the columns you want to include in the export.</DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-[320px] w-full rounded-lg border border-white/20 bg-white/5 backdrop-blur-md p-4 mt-2">
          <div className="flex flex-col gap-2">
            {headers.map(h => (
              <label key={h.key} className="flex items-center gap-2 text-white/90">
                <Checkbox checked={selectedKeys.includes(h.key)} onCheckedChange={checked => toggleKey(h.key, !!checked)} />
                <span>{h.label}</span>
              </label>
            ))}
          </div>
        </ScrollArea>

        <p className="text-xs text-white/70 mt-2">
          Exporting <strong>{data.length}</strong> rows.
        </p>

        <DialogFooter className="gap-2 mt-2">
          <Button size="sm" variant="outlineWater" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button size="sm" variant="outlineGarden" disabled={selectedKeys.length === 0 || data.length === 0} onClick={handleExport}>
            <DownloadIcon className="w-4 h-4 mr-1" /> Export
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const AddNextComponents: React.FC = () => {
  const { toggleAddModal, isAddModalOpen, setPosts } = usePostsStore();
  const [addPosts, { isLoading }] = useAddPostsMutation();
  const [newPost, setNewPost] = useState<IPosts>(defaultPosts);

  const session = useSession();
  const author_email = session?.data?.user?.email || '---';

  const handleFieldChange = (name: string, value: unknown) => {
    setNewPost(prev => ({ ...prev, [name]: value }));
  };

  const handleAddPost = async () => {
    try {
      const updateData = { ...newPost };
      delete updateData._id;
      if (updateData.students) {
        updateData.students = updateData.students.map((i: StringArrayData) => {
          const r = { ...i };
          delete r._id;
          return r;
        });
      }
      updateData['author-email'] = author_email;
      const addedPost = await addPosts(updateData).unwrap();
      setPosts([addedPost]);
      toggleAddModal(false);
      setNewPost(defaultPosts);
      handleSuccess('Added Successfully');
    } catch (error: unknown) {
      console.error('Failed to add record:', error);
      let errMessage: string = 'An unknown error occurred.';
      if (isApiErrorResponse(error)) {
        errMessage = formatDuplicateKeyError(error.data.message) || 'An API error occurred.';
      } else if (error instanceof Error) {
        errMessage = error.message;
      }
      handleError(errMessage);
    }
  };

  const areaOptions = [
    { label: 'Bangladesh', value: 'Bangladesh' },
    { label: 'India', value: 'India' },
    { label: 'Pakistan', value: 'Pakistan' },
    { label: 'Canada', value: 'Canada' },
  ];

  const ideasOptions = [
    { label: 'O 1', value: 'O 1' },
    { label: 'O 2', value: 'O 2' },
    { label: 'O 3', value: 'O 3' },
    { label: 'O 4', value: 'O 4' },
  ];

  const shiftOptions = [
    { label: 'OP 1', value: 'OP 1' },
    { label: 'OP 2', value: 'OP 2' },
    { label: 'OP 3', value: 'OP 3' },
    { label: 'OP 4', value: 'OP 4' },
  ];

  useEffect(() => {
    const updateDefaultData = { ...defaultPosts };
    setNewPost(updateDefaultData);
  }, []);

  return (
    <Dialog open={isAddModalOpen} onOpenChange={toggleAddModal}>
      <DialogContent className="sm:max-w-[825px] rounded-xl border mt-[35px] border-white/20 bg-white/10 backdrop-blur-2xl shadow-2xl overflow-hidden transition-all duration-300 p-0">
        <ScrollArea className="h-[75vh] max-h-[calc(100vh-2rem)] rounded-xl">
          <DialogHeader className="p-6 pb-3">
            <DialogTitle className="text-xl font-semibold bg-clip-text text-transparent bg-linear-to-r from-white to-blue-200 drop-shadow-md">
              Add New Post
            </DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4 px-6 text-white">
            <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4 pr-1">
              <Label htmlFor="title" className="text-right ">
                Title
              </Label>
              <div className="col-span-3">
                <InputFieldForString
                  className="text-white"
                  id="title"
                  placeholder="Title"
                  value={newPost['title']}
                  onChange={value => handleFieldChange('title', value as string)}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4 pr-1">
              <Label htmlFor="email" className="text-right ">
                Email
              </Label>
              <div className="col-span-3">
                <InputFieldForEmail
                  className="text-white"
                  id="email"
                  value={newPost['email']}
                  onChange={value => handleFieldChange('email', value as string)}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4 pr-1">
              <Label htmlFor="author-email" className="text-right ">
                Author Email
              </Label>
              <div className="col-span-3">
                <InputFieldForEmail
                  readonly
                  className="text-white"
                  id="author-email"
                  value={author_email}
                  onChange={value => handleFieldChange('author-email', value as string)}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4 pr-1">
              <Label htmlFor="password" className="text-right ">
                Password
              </Label>
              <div className="col-span-3">
                <InputFieldForPassword id="password" value={newPost['password']} onChange={value => handleFieldChange('password', value as string)} />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4 pr-1">
              <Label htmlFor="passcode" className="text-right ">
                Passcode
              </Label>
              <div className="col-span-3">
                <InputFieldForPasscode id="passcode" value={newPost['passcode']} onChange={value => handleFieldChange('passcode', value as string)} />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4 pr-1">
              <Label htmlFor="area" className="text-right ">
                Area
              </Label>
              <div className="col-span-3">
                <SelectField options={areaOptions} value={newPost['area']} onValueChange={value => handleFieldChange('area', value)} />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 items-start gap-4 pr-1">
              <Label htmlFor="sub-area" className="text-right pt-3">
                Sub Area
              </Label>
              <div className="col-span-3">
                <DynamicSelectField
                  value={newPost['sub-area']}
                  apiUrl="https://jsonplaceholder.typicode.com/users"
                  onChange={values => handleFieldChange('sub-area', values)}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4 pr-1">
              <Label htmlFor="products-images" className="text-right ">
                Products Images
              </Label>
              <div className="col-span-3">
                <ImageUploadManager value={newPost['products-images']} onChange={urls => handleFieldChange('products-images', urls)} />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4 pr-1">
              <Label htmlFor="personal-image" className="text-right ">
                Personal Image
              </Label>
              <div className="col-span-3">
                <ImageUploadManagerSingle value={newPost['personal-image']} onChange={url => handleFieldChange('personal-image', url)} />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 items-start gap-4 pr-1">
              <Label htmlFor="description" className="text-right pt-3">
                Description
              </Label>
              <div className="col-span-3">
                <TextareaFieldForDescription
                  className="text-white"
                  id="description"
                  value={newPost['description']}
                  onChange={e => handleFieldChange('description', e.target.value)}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4 pr-1">
              <Label htmlFor="age" className="text-right ">
                Age
              </Label>
              <div className="col-span-3">
                <NumberInputFieldInteger id="age" value={newPost['age']} onChange={value => handleFieldChange('age', value as number)} />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4 pr-1">
              <Label htmlFor="amount" className="text-right ">
                Amount
              </Label>
              <div className="col-span-3">
                <NumberInputFieldFloat id="amount" value={newPost['amount']} onChange={value => handleFieldChange('amount', value as number)} />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4 pr-1">
              <Label htmlFor="isActive" className="text-right ">
                IsActive
              </Label>
              <div className="col-span-3">
                <BooleanInputField id="isActive" checked={newPost['isActive']} onCheckedChange={checked => handleFieldChange('isActive', checked)} />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4 pr-1">
              <Label htmlFor="start-date" className="text-right ">
                Start Date
              </Label>
              <div className="col-span-3">
                <DateField id="start-date" value={newPost['start-date']} onChange={date => handleFieldChange('start-date', date)} />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4 pr-1">
              <Label htmlFor="start-time" className="text-right ">
                Start Time
              </Label>
              <div className="col-span-3">
                <TimeField id="start-time" value={newPost['start-time']} onChange={time => handleFieldChange('start-time', time)} />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4 pr-1">
              <Label htmlFor="schedule-date" className="text-right ">
                Schedule Date
              </Label>
              <div className="col-span-3">
                <DateRangePickerField id="schedule-date" value={newPost['schedule-date']} onChange={range => handleFieldChange('schedule-date', range)} />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4 pr-1">
              <Label htmlFor="schedule-time" className="text-right ">
                Schedule Time
              </Label>
              <div className="col-span-3">
                <TimeRangePickerField id="schedule-time" value={newPost['schedule-time']} onChange={range => handleFieldChange('schedule-time', range)} />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4 pr-1">
              <Label htmlFor="favorite-color" className="text-right ">
                Favorite Color
              </Label>
              <div className="col-span-3">
                <ColorPickerField
                  id="favorite-color"
                  value={newPost['favorite-color']}
                  onChange={value => handleFieldChange('favorite-color', value as string)}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4 pr-1">
              <Label htmlFor="number" className="text-right ">
                Number
              </Label>
              <div className="col-span-3">
                <PhoneInputField id="number" value={newPost['number']} onChange={value => handleFieldChange('number', value)} />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4 pr-1">
              <Label htmlFor="profile" className="text-right ">
                Profile
              </Label>
              <div className="col-span-3">
                <UrlInputField id="profile" value={newPost['profile']} onChange={value => handleFieldChange('profile', value as string)} />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 items-start gap-4 pr-1">
              <Label htmlFor="test" className="text-right pt-3">
                Test
              </Label>
              <div className="col-span-3">
                <RichTextEditorField id="test" value={newPost['test']} onChange={value => handleFieldChange('test', value)} />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4 pr-1">
              <Label htmlFor="info" className="text-right ">
                Info
              </Label>
              <div className="col-span-3">
                <AutocompleteField id="info" value={newPost['info']} />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4 pr-1">
              <Label htmlFor="shift" className="text-right ">
                Shift
              </Label>
              <div className="col-span-3">
                <RadioButtonGroupField options={shiftOptions} value={newPost['shift']} onChange={value => handleFieldChange('shift', value)} />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4 pr-1">
              <Label htmlFor="policy" className="text-right ">
                Policy
              </Label>
              <div className="col-span-3">
                <CheckboxField id="policy" checked={newPost['policy']} onCheckedChange={checked => handleFieldChange('policy', checked)} />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 items-start gap-4 pr-1">
              <Label htmlFor="hobbies" className="text-right pt-3">
                Hobbies
              </Label>
              <div className="col-span-3">
                <MultiCheckboxGroupField value={newPost['hobbies']} onChange={values => handleFieldChange('hobbies', values)} />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4 pr-1">
              <Label htmlFor="ideas" className="text-right ">
                Ideas
              </Label>
              <div className="col-span-3">
                <MultiOptionsField options={ideasOptions} value={newPost['ideas']} onChange={values => handleFieldChange('ideas', values)} />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 items-start gap-4 pr-1">
              <Label htmlFor="students" className="text-right pt-3">
                Students
              </Label>
              <div className="col-span-3">
                <StringArrayField value={newPost['students']} onChange={value => handleFieldChange('students', value)} />
              </div>
            </div>
            <div className="grid grid-cols-4 items-start gap-4 pr-1">
              <Label htmlFor="complexValue" className="text-right pt-3">
                ComplexValue
              </Label>
              <div className="col-span-3">
                <JsonTextareaField
                  id="complexValue"
                  value={JSON.stringify(newPost['complexValue'], null, 2) || ''}
                  onChange={value => {
                    handleFieldChange('complexValue', value);
                  }}
                />
              </div>
            </div>
          </div>
        </ScrollArea>

        <DialogFooter className="p-6 pt-4 gap-3">
          <Button variant="outlineWater" onClick={() => toggleAddModal(false)} size="sm">
            Cancel
          </Button>
          <Button disabled={isLoading} onClick={handleAddPost} variant="outlineGarden" size="sm">
            {isLoading ? 'Adding...' : 'Add Post'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const EditNextComponents: React.FC = () => {
  const { toggleEditModal, isEditModalOpen, selectedPosts, setSelectedPosts } = usePostsStore();

  const [updatePosts, { isLoading }] = useUpdatePostsMutation();
  const [editedPost, setPost] = useState<IPosts>(defaultPosts);

  useEffect(() => {
    if (selectedPosts) {
      setPost(selectedPosts);
    }
  }, [selectedPosts]);

  const handleFieldChange = (name: string, value: unknown) => {
    setPost(prev => ({ ...prev, [name]: value }));
  };

  const handleEditPost = async () => {
    if (!selectedPosts) return;
    try {
      const updateData = { ...editedPost };
      delete updateData._id;
      delete updateData.createdAt;
      delete updateData.updatedAt;

      if (updateData.students) {
        updateData.students = updateData.students.map((i: StringArrayData) => {
          const r = { ...i };
          delete r._id;
          return r;
        });
      }

      await updatePosts({
        id: selectedPosts._id,
        ...updateData,
      }).unwrap();

      toggleEditModal(false);
      handleSuccess('Edit Successful');
    } catch (error: unknown) {
      console.error('Failed to update record:', error);
      let errMessage: string = 'An unknown error occurred.';
      if (isApiErrorResponse(error)) {
        errMessage = formatDuplicateKeyError(error.data.message) || 'An API error occurred.';
      } else if (error instanceof Error) {
        errMessage = error.message;
      }
      handleError(errMessage);
    }
  };

  const areaOptions = [
    { label: 'Bangladesh', value: 'Bangladesh' },
    { label: 'India', value: 'India' },
    { label: 'Pakistan', value: 'Pakistan' },
    { label: 'Canada', value: 'Canada' },
  ];

  const ideasOptions = [
    { label: 'O 1', value: 'O 1' },
    { label: 'O 2', value: 'O 2' },
    { label: 'O 3', value: 'O 3' },
    { label: 'O 4', value: 'O 4' },
  ];

  const shiftOptions = [
    { label: 'OP 1', value: 'OP 1' },
    { label: 'OP 2', value: 'OP 2' },
    { label: 'OP 3', value: 'OP 3' },
    { label: 'OP 4', value: 'OP 4' },
  ];

  return (
    <Dialog open={isEditModalOpen} onOpenChange={toggleEditModal}>
      <DialogContent className="sm:max-w-[825px] rounded-xl border mt-[35px] border-white/20 bg-white/10 backdrop-blur-2xl shadow-2xl overflow-hidden transition-all duration-300 p-0">
        <ScrollArea className="h-[75vh] max-h-[calc(100vh-2rem)] rounded-xl">
          <DialogHeader className="p-6 pb-3">
            <DialogTitle className="text-xl font-semibold bg-clip-text text-transparent bg-linear-to-r from-white to-blue-200 drop-shadow-md">
              Edit Post
            </DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4 px-6 text-white">
            <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4 pr-1">
              <Label htmlFor="title" className="text-right ">
                Title
              </Label>
              <div className="col-span-3">
                <InputFieldForString
                  className="text-white"
                  id="title"
                  placeholder="Title"
                  value={editedPost['title']}
                  onChange={value => handleFieldChange('title', value as string)}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4 pr-1">
              <Label htmlFor="email" className="text-right ">
                Email
              </Label>
              <div className="col-span-3">
                <InputFieldForEmail
                  className="text-white"
                  id="email"
                  value={editedPost['email']}
                  onChange={value => handleFieldChange('email', value as string)}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4 pr-1">
              <Label htmlFor="author-email" className="text-right ">
                Author Email
              </Label>
              <div className="col-span-3">
                <InputFieldForEmail
                  readonly
                  className="text-white"
                  id="author-email"
                  value={editedPost['author-email']}
                  onChange={value => handleFieldChange('author-email', value as string)}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4 pr-1">
              <Label htmlFor="password" className="text-right ">
                Password
              </Label>
              <div className="col-span-3">
                <InputFieldForPassword id="password" value={editedPost['password']} onChange={value => handleFieldChange('password', value as string)} />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4 pr-1">
              <Label htmlFor="passcode" className="text-right ">
                Passcode
              </Label>
              <div className="col-span-3">
                <InputFieldForPasscode id="passcode" value={editedPost['passcode']} onChange={value => handleFieldChange('passcode', value as string)} />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4 pr-1">
              <Label htmlFor="area" className="text-right ">
                Area
              </Label>
              <div className="col-span-3">
                <SelectField options={areaOptions} value={editedPost['area']} onValueChange={value => handleFieldChange('area', value)} />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 items-start gap-4 pr-1">
              <Label htmlFor="sub-area" className="text-right pt-3">
                Sub Area
              </Label>
              <div className="col-span-3">
                <DynamicSelectField
                  value={editedPost['sub-area']}
                  apiUrl="https://jsonplaceholder.typicode.com/users"
                  onChange={values => handleFieldChange('sub-area', values)}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4 pr-1">
              <Label htmlFor="products-images" className="text-right ">
                Products Images
              </Label>
              <div className="col-span-3">
                <ImageUploadManager value={editedPost['products-images']} onChange={urls => handleFieldChange('products-images', urls)} />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4 pr-1">
              <Label htmlFor="personal-image" className="text-right ">
                Personal Image
              </Label>
              <div className="col-span-3">
                <ImageUploadManagerSingle value={editedPost['personal-image']} onChange={url => handleFieldChange('personal-image', url)} />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 items-start gap-4 pr-1">
              <Label htmlFor="description" className="text-right pt-3">
                Description
              </Label>
              <div className="col-span-3">
                <TextareaFieldForDescription
                  className="text-white"
                  id="description"
                  value={editedPost['description']}
                  onChange={e => handleFieldChange('description', e.target.value)}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4 pr-1">
              <Label htmlFor="age" className="text-right ">
                Age
              </Label>
              <div className="col-span-3">
                <NumberInputFieldInteger id="age" value={editedPost['age']} onChange={value => handleFieldChange('age', value as number)} />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4 pr-1">
              <Label htmlFor="amount" className="text-right ">
                Amount
              </Label>
              <div className="col-span-3">
                <NumberInputFieldFloat id="amount" value={editedPost['amount']} onChange={value => handleFieldChange('amount', value as number)} />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4 pr-1">
              <Label htmlFor="isActive" className="text-right ">
                IsActive
              </Label>
              <div className="col-span-3">
                <BooleanInputField id="isActive" checked={editedPost['isActive']} onCheckedChange={checked => handleFieldChange('isActive', checked)} />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4 pr-1">
              <Label htmlFor="start-date" className="text-right ">
                Start Date
              </Label>
              <div className="col-span-3">
                <DateField id="start-date" value={editedPost['start-date']} onChange={date => handleFieldChange('start-date', date)} />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4 pr-1">
              <Label htmlFor="start-time" className="text-right ">
                Start Time
              </Label>
              <div className="col-span-3">
                <TimeField id="start-time" value={editedPost['start-time']} onChange={time => handleFieldChange('start-time', time)} />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4 pr-1">
              <Label htmlFor="schedule-date" className="text-right ">
                Schedule Date
              </Label>
              <div className="col-span-3">
                <DateRangePickerField id="schedule-date" value={editedPost['schedule-date']} onChange={range => handleFieldChange('schedule-date', range)} />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4 pr-1">
              <Label htmlFor="schedule-time" className="text-right ">
                Schedule Time
              </Label>
              <div className="col-span-3">
                <TimeRangePickerField id="schedule-time" value={editedPost['schedule-time']} onChange={range => handleFieldChange('schedule-time', range)} />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4 pr-1">
              <Label htmlFor="favorite-color" className="text-right ">
                Favorite Color
              </Label>
              <div className="col-span-3">
                <ColorPickerField
                  id="favorite-color"
                  value={editedPost['favorite-color']}
                  onChange={value => handleFieldChange('favorite-color', value as string)}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4 pr-1">
              <Label htmlFor="number" className="text-right ">
                Number
              </Label>
              <div className="col-span-3">
                <PhoneInputField id="number" value={editedPost['number']} onChange={value => handleFieldChange('number', value)} />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4 pr-1">
              <Label htmlFor="profile" className="text-right ">
                Profile
              </Label>
              <div className="col-span-3">
                <UrlInputField id="profile" value={editedPost['profile']} onChange={value => handleFieldChange('profile', value as string)} />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 items-start gap-4 pr-1">
              <Label htmlFor="test" className="text-right pt-3">
                Test
              </Label>
              <div className="col-span-3">
                <RichTextEditorField id="test" value={editedPost['test']} onChange={value => handleFieldChange('test', value)} />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4 pr-1">
              <Label htmlFor="info" className="text-right ">
                Info
              </Label>
              <div className="col-span-3">
                <AutocompleteField id="info" value={editedPost['info']} />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4 pr-1">
              <Label htmlFor="shift" className="text-right ">
                Shift
              </Label>
              <div className="col-span-3">
                <RadioButtonGroupField options={shiftOptions} value={editedPost['shift']} onChange={value => handleFieldChange('shift', value)} />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4 pr-1">
              <Label htmlFor="policy" className="text-right ">
                Policy
              </Label>
              <div className="col-span-3">
                <CheckboxField id="policy" checked={editedPost['policy']} onCheckedChange={checked => handleFieldChange('policy', checked)} />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 items-start gap-4 pr-1">
              <Label htmlFor="hobbies" className="text-right pt-3">
                Hobbies
              </Label>
              <div className="col-span-3">
                <MultiCheckboxGroupField value={editedPost['hobbies']} onChange={values => handleFieldChange('hobbies', values)} />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4 pr-1">
              <Label htmlFor="ideas" className="text-right ">
                Ideas
              </Label>
              <div className="col-span-3">
                <MultiOptionsField options={ideasOptions} value={editedPost['ideas']} onChange={values => handleFieldChange('ideas', values)} />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 items-start gap-4 pr-1">
              <Label htmlFor="students" className="text-right pt-3">
                Students
              </Label>
              <div className="col-span-3">
                <StringArrayField value={editedPost['students']} onChange={value => handleFieldChange('students', value)} />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 items-start gap-4 pr-1">
              <Label htmlFor="complexValue" className="text-right pt-3">
                ComplexValue
              </Label>
              <div className="col-span-3">
                <JsonTextareaField
                  id="complexValue"
                  value={JSON.stringify(editedPost['complexValue'], null, 2) || ''}
                  onChange={value => {
                    handleFieldChange('complexValue', value);
                  }}
                />
              </div>
            </div>
          </div>
        </ScrollArea>

        <DialogFooter className="p-6 pt-4 gap-3">
          <Button
            variant="outlineWater"
            onClick={() => {
              toggleEditModal(false);
              setSelectedPosts(null);
            }}
            size="sm"
          >
            Cancel
          </Button>
          <Button disabled={isLoading} onClick={handleEditPost} variant="outlineGarden" size="sm">
            {isLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

type Primitive = string | number | boolean | null | undefined;
type Arrayish = Array<string | number | boolean>;
type JSONLike = string | number | boolean | null | undefined | Record<string, unknown> | StringArrayData[];

const ViewNextComponents: React.FC = () => {
  const { selectedPosts, isViewModalOpen, toggleViewModal, setSelectedPosts } = usePostsStore();

  const { data: postData, refetch } = useGetPostsByIdQuery(selectedPosts?._id, { skip: !selectedPosts?._id });

  useEffect(() => {
    if (selectedPosts?._id) refetch();
  }, [selectedPosts?._id, refetch]);

  useEffect(() => {
    if (postData?.data) setSelectedPosts(postData.data as IPosts);
  }, [postData, setSelectedPosts]);

  const formatDate = (d?: string | Date): string => {
    if (!d) return 'N/A';
    try {
      return format(new Date(d), 'MMM dd, yyyy');
    } catch (error: unknown) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      let errMessage: string = 'Invalid Date';
      if (isApiErrorResponse(error)) {
        errMessage = formatDuplicateKeyError(error.data.message) || 'API error';
      } else if (error instanceof Error) {
        errMessage = error.message;
      }
      return 'Invalid';
    }
  };

  const formatBoolean = (v?: boolean): string => (v ? 'Yes' : 'No');

  const DetailRow: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
    <div className="grid grid-cols-3 gap-2 py-2 border-b border-white/10">
      <span className="text-sm text-white/80">{label}</span>
      <span className="col-span-2 text-sm text-white">{(value ?? 'N/A') as Primitive}</span>
    </div>
  );

  const DetailRowArray: React.FC<{
    label: string;
    values?: Arrayish | null;
  }> = ({ label, values }) => <DetailRow label={label} value={values?.join(', ') || 'N/A'} />;

  const DetailRowJson: React.FC<{ label: string; value?: JSONLike }> = ({ label, value }) => (
    <div className="py-2 border-b border-white/10">
      <div className="text-sm text-white/80">{label}</div>
      <pre className="text-[11px] text-white/90 bg-white/5 rounded-md p-2 mt-1 overflow-auto">{value ? JSON.stringify(value, null, 2) : 'N/A'}</pre>
    </div>
  );

  return (
    <Dialog open={isViewModalOpen} onOpenChange={toggleViewModal}>
      <DialogContent className="sm:max-w-2xl mt-8 rounded-xl bg-white/10 backdrop-blur-2xl border border-white/20 text-white">
        <DialogHeader>
          <DialogTitle className="bg-clip-text text-transparent bg-linear-to-r from-white to-blue-200">Posts Details</DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[520px] rounded-lg border border-white/10 bg-white/5 backdrop-blur-xl p-4 mt-3">
          {selectedPosts && (
            <>
              <DetailRow label="Title" value={selectedPosts['title']} />
              <DetailRow label="Email" value={selectedPosts['email']} />
              <DetailRow label="Author Email" value={selectedPosts['author-email']} />
              <DetailRow label="Password" value={selectedPosts['password']} />
              <DetailRow label="Passcode" value={selectedPosts['passcode']} />
              <DetailRow label="Area" value={selectedPosts['area']} />
              <DetailRowArray label="Sub Area" values={selectedPosts['sub-area']} />

              <DetailRow label="Description" value={selectedPosts['description']} />
              <DetailRow label="Age" value={selectedPosts['age']} />
              <DetailRow label="Amount" value={selectedPosts['amount']} />
              <DetailRow label="IsActive" value={formatBoolean(selectedPosts['isActive'])} />
              <DetailRow label="Start Date" value={formatDate(selectedPosts['start-date'])} />
              <DetailRow label="Start Time" value={selectedPosts['start-time']} />
              <DetailRow
                label="Schedule Date"
                value={`${formatDate(selectedPosts['schedule-date']?.from)} - ${formatDate(selectedPosts['schedule-date']?.to)}`}
              />
              <DetailRow label="Schedule Time" value={`${selectedPosts['schedule-time']?.start || 'N/A'} - ${selectedPosts['schedule-time']?.end || 'N/A'}`} />
              <DetailRow
                label="Favorite Color"
                value={
                  <div className="flex items-center gap-2">
                    <span>{selectedPosts['favorite-color']}</span>
                    <div className="w-5 h-5 rounded-full border border-white/20" style={{ backgroundColor: selectedPosts['favorite-color'] }} />
                  </div>
                }
              />
              <DetailRow label="Number" value={selectedPosts['number']} />
              <DetailRow label="Profile" value={selectedPosts['profile']} />
              <DetailRow label="Test" value={selectedPosts['test']} />
              <DetailRow label="Info" value={selectedPosts['info']} />
              <DetailRow label="Shift" value={selectedPosts['shift']} />
              <DetailRow label="Policy" value={formatBoolean(selectedPosts['policy'])} />
              <DetailRowArray label="Hobbies" values={selectedPosts['hobbies']} />
              <DetailRowArray label="Ideas" values={selectedPosts['ideas']} />
              <DetailRowJson label="Students" value={selectedPosts['students']} />
              <DetailRowJson label="ComplexValue" value={selectedPosts['complexValue']} />
              <DetailRow label="Created At" value={formatDate(selectedPosts.createdAt)} />
              <DetailRow label="Updated At" value={formatDate(selectedPosts.updatedAt)} />

              <div className="mt-6">
                <h3 className="text-white font-medium mb-2">Products Images</h3>
                {Array.isArray(selectedPosts['products-images']) && selectedPosts['products-images'].length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {selectedPosts['products-images'].map((val: { url: string; name: string }, i: number) => (
                      <div key={i} className="relative h-32 rounded-lg overflow-hidden border border-white/20 bg-white/10 backdrop-blur-lg">
                        <Image src={val.url} fill className="object-cover" alt={val.name || `Products Images ${i + 1}`} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-white/70 text-sm">No images.</p>
                )}
              </div>

              <div className="mt-6">
                <h3 className="text-white font-medium mb-2">Personal Image</h3>
                {selectedPosts['personal-image'] ? (
                  <div className="relative w-full h-48 rounded-lg overflow-hidden border border-white/20 bg-white/10 backdrop-blur-lg">
                    <Image src={selectedPosts['personal-image'].url} fill className="object-cover" alt="Personal Image" />
                  </div>
                ) : (
                  <p className="text-white/70 text-sm">No image.</p>
                )}
              </div>
            </>
          )}
        </ScrollArea>

        <DialogFooter className="gap-2">
          <Button
            variant="outlineWater"
            onClick={() => {
              toggleViewModal(false);
              setSelectedPosts(defaultPosts as IPosts);
            }}
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const DeleteNextComponents: React.FC = () => {
  const { toggleDeleteModal, isDeleteModalOpen, selectedPosts, setSelectedPosts } = usePostsStore();

  const [deletePost, { isLoading }] = useDeletePostsMutation();

  const handleDelete = async () => {
    if (!selectedPosts) return;

    try {
      await deletePost({ id: selectedPosts._id }).unwrap();
      handleSuccess('Delete Successful');
      toggleDeleteModal(false);
      setSelectedPosts(defaultPosts as IPosts);
    } catch (error) {
      console.error('Failed to delete Post:', error);
      handleError('Failed to delete item. Please try again.');
    }
  };

  const handleCancel = () => {
    toggleDeleteModal(false);
    setSelectedPosts(defaultPosts as IPosts);
  };

  const displayName = selectedPosts?.['title'] || 'this item';

  return (
    <Dialog open={isDeleteModalOpen} onOpenChange={toggleDeleteModal}>
      <DialogContent className="sm:max-w-md rounded-xl border border-white/20 bg-white/10 backdrop-blur-2xl shadow-xl text-white">
        <DialogHeader>
          <DialogTitle className="bg-clip-text text-transparent bg-linear-to-r from-white to-red-200">Confirm Deletion</DialogTitle>
        </DialogHeader>

        <p className="text-white/80 py-3">
          Are you sure you want to delete:&nbsp;
          <strong className="text-white">{displayName}</strong> ?
        </p>

        <DialogFooter className="gap-2">
          <Button variant="outlineWater" size="sm" onClick={handleCancel}>
            Cancel
          </Button>
          <Button variant="outlineFire" size="sm" disabled={isLoading} onClick={handleDelete}>
            {isLoading ? 'Deleting…' : 'Delete'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const BulkEditNextComponents: React.FC = () => {
  const { isBulkEditModalOpen, toggleBulkEditModal, bulkData, setBulkData } = usePostsStore();

  const [bulkUpdatePosts, { isLoading }] = useBulkUpdatePostsMutation();

  const handleFieldChange = (id: string, key: string, value: string) => {
    const updatedData = bulkData.map(item => (item._id === id ? { ...item, [key]: value } : item));
    setBulkData(updatedData);
  };

  const handleBulkEdit = async () => {
    if (!bulkData.length) return;
    try {
      const formatted = bulkData.map(({ _id, ...rest }) => ({
        id: _id,
        updateData: rest,
      }));
      await bulkUpdatePosts(formatted).unwrap();

      toggleBulkEditModal(false);
      setBulkData([]);
      handleSuccess('Bulk Update Successful');
    } catch (error) {
      console.error('Bulk Update Failed:', error);
      handleError('Failed to update selected items.');
    }
  };

  return (
    <Dialog open={isBulkEditModalOpen} onOpenChange={toggleBulkEditModal}>
      <DialogContent className="sm:max-w-xl rounded-xl border border-white/20 bg-white/10 backdrop-blur-2xl shadow-xl text-white">
        <DialogHeader>
          <DialogTitle className="bg-clip-text bg-linear-to-r from-white to-blue-200 text-white">Bulk Edit Posts</DialogTitle>
        </DialogHeader>

        {bulkData.length > 0 && (
          <p className="text-white/80">
            Editing <strong>{bulkData.length}</strong> selected posts.
          </p>
        )}

        <ScrollArea className="h-[420px] w-full rounded-lg border border-white/20 bg-white/5 backdrop-blur-md p-4 mt-3">
          <div className="flex flex-col gap-3">
            {bulkData.map((item, idx) => (
              <div key={item._id || idx} className="p-3 border border-white/20 rounded-lg bg-white/10 backdrop-blur-lg flex flex-col gap-3">
                <span className="font-medium text-white">
                  {idx + 1}. {String(item['title'] || '')}
                </span>

                <div className="flex items-center gap-3">
                  <Label className="min-w-[120px] text-white">Area</Label>
                  <Select onValueChange={v => handleFieldChange(item._id as string, 'area', v)} defaultValue={String(item['area'] ?? '')}>
                    <SelectTrigger className="w-[180px] bg-white/10 backdrop-blur-md border-white/30 text-white">
                      <SelectValue placeholder="Select…" />
                    </SelectTrigger>
                    <SelectContent className="border-white/20 bg-white/10 backdrop-blur-xl text-white">
                      <SelectItem value="Bangladesh">Bangladesh</SelectItem>
                      <SelectItem value="India">India</SelectItem>
                      <SelectItem value="Pakistan">Pakistan</SelectItem>
                      <SelectItem value="Canada">Canada</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center gap-3">
                  <Label className="min-w-[120px] text-white">Shift</Label>
                  <Select onValueChange={v => handleFieldChange(item._id as string, 'shift', v)} defaultValue={String(item['shift'] ?? '')}>
                    <SelectTrigger className="w-[180px] bg-white/10 backdrop-blur-md border-white/30 text-white">
                      <SelectValue placeholder="Select…" />
                    </SelectTrigger>
                    <SelectContent className="border-white/20 bg-white/10 backdrop-blur-xl text-white">
                      <SelectItem value="OP 1">OP 1</SelectItem>
                      <SelectItem value="OP 2">OP 2</SelectItem>
                      <SelectItem value="OP 3">OP 3</SelectItem>
                      <SelectItem value="OP 4">OP 4</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <DialogFooter className="gap-2">
          <Button variant="outlineWater" size="sm" onClick={() => toggleBulkEditModal(false)}>
            Cancel
          </Button>
          <Button disabled={isLoading} onClick={handleBulkEdit} variant="outlineWater" size="sm">
            {isLoading ? 'Updating…' : 'Update Selected'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const BulkDeleteNextComponents: React.FC = () => {
  const { isBulkDeleteModalOpen, toggleBulkDeleteModal, bulkData, setBulkData } = usePostsStore();

  const [bulkDeletePosts, { isLoading }] = useBulkDeletePostsMutation();

  const handleBulkDelete = async () => {
    if (!bulkData?.length) return;
    try {
      const ids = bulkData.map(item => item._id);
      await bulkDeletePosts({ ids }).unwrap();

      toggleBulkDeleteModal(false);
      setBulkData([]);
      handleSuccess('Delete Successful');
    } catch (error) {
      console.error('Failed to delete posts:', error);
      handleError('Failed to delete items. Please try again.');
    }
  };

  return (
    <Dialog open={isBulkDeleteModalOpen} onOpenChange={toggleBulkDeleteModal}>
      <DialogContent className="sm:max-w-md rounded-xl border border-white/20 bg-white/10 backdrop-blur-2xl shadow-xl text-white">
        <DialogHeader>
          <DialogTitle className="text-white bg-clip-text bg-linear-to-r from-white to-red-200">Confirm Deletion</DialogTitle>
        </DialogHeader>

        {bulkData?.length > 0 && (
          <p className="text-white/80 mt-2">
            You are deleting&nbsp;
            <strong>({bulkData.length})</strong> posts.
          </p>
        )}

        <ScrollArea className="h-[420px] w-full rounded-lg border border-white/20 bg-white/5 backdrop-blur-md p-4 mt-3">
          <div className="flex flex-col gap-2">
            {bulkData.map((item, idx) => (
              <span key={(item._id as string) + idx} className="text-sm text-white/90">
                {idx + 1}. {String(item['title'] || '')}
              </span>
            ))}
          </div>
        </ScrollArea>

        <DialogFooter className="gap-2 mt-3">
          <Button variant="outlineWater" size="sm" onClick={() => toggleBulkDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="outlineFire" size="sm" disabled={isLoading} onClick={handleBulkDelete}>
            {isLoading ? 'Deleting…' : 'Delete Selected'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const BulkUpdatePosts: React.FC = () => {
  const { toggleBulkUpdateModal, isBulkUpdateModalOpen, bulkData, setBulkData } = usePostsStore();

  const [bulkUpdatePosts, { isLoading }] = useBulkUpdatePostsMutation();

  const handleBulkUpdate = async () => {
    if (!bulkData.length) return;
    try {
      const newBulkData = bulkData.map(({ _id, ...rest }) => ({
        id: _id,
        updateData: rest,
      }));
      await bulkUpdatePosts(newBulkData).unwrap();
      toggleBulkUpdateModal(false);
      setBulkData([]);
      handleSuccess('Update Successful');
    } catch (error) {
      console.error('Failed to edit posts:', error);
      handleError('Failed to update items. Please try again.');
    }
  };

  const handleFieldChangeForAll = (value: string) => {
    setBulkData(
      bulkData.map(post => ({
        ...post,
        ['area']: value,
      })) as IPosts[],
    );
  };

  return (
    <Dialog open={isBulkUpdateModalOpen} onOpenChange={toggleBulkUpdateModal}>
      <DialogContent className="sm:max-w-lg rounded-xl border border-white/20 bg-white/10 backdrop-blur-2xl shadow-xl transition-all text-white">
        <DialogHeader>
          <DialogTitle className="bg-clip-text bg-linear-to-r from-white to-blue-200 text-white">Confirm Bulk Update</DialogTitle>
        </DialogHeader>

        {bulkData.length > 0 && (
          <div className="space-y-3">
            <p className="pt-2 text-white/80">
              You are about to update <span className="font-semibold text-white">({bulkData.length})</span> posts.
            </p>

            <div className="flex items-center justify-between rounded-lg p-3 bg-white/5 border border-white/10 backdrop-blur-md">
              <p className="text-white/90">
                Set all <span className="font-semibold text-blue-300">Area</span> to
              </p>

              <Select onValueChange={value => handleFieldChangeForAll(value)} defaultValue={(postsSelectorArr[0] as string) || ''}>
                <SelectTrigger className="w-[180px] border-white/20 bg-white/10 text-white backdrop-blur-md">
                  <SelectValue placeholder="Select value" />
                </SelectTrigger>
                <SelectContent className="border-white/20 bg-white/10 backdrop-blur-xl text-white">
                  {postsSelectorArr?.map((option, index) => (
                    <SelectItem key={option + index} value={option} className="cursor-pointer hover:bg-white/20 text-white">
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        <ScrollArea className="h-[300px] w-full rounded-xl border border-white/10 bg-white/5 backdrop-blur-md p-4 mt-3">
          <div className="flex flex-col gap-2">
            {bulkData.map((item, idx) => (
              <div
                key={(item._id as string) || idx}
                className="flex justify-between items-center text-white/90 rounded-md p-2 bg-white/5 border border-white/10"
              >
                <span>
                  {idx + 1}. {(item['title'] as string) || ''}
                </span>
                <span className="text-blue-300">{item['title'] as string}</span>
              </div>
            ))}
          </div>
        </ScrollArea>

        <DialogFooter className="gap-2 mt-4">
          <Button variant="outlineWater" className="text-white hover:text-white" onClick={() => toggleBulkUpdateModal(false)}>
            Cancel
          </Button>
          <Button
            disabled={isLoading}
            onClick={handleBulkUpdate}
            className="px-6 py-2 bg-green-600/80 hover:bg-green-600 border border-green-400 text-white hover:shadow-md backdrop-blur-xl"
          >
            {isLoading ? 'Updating...' : 'Update Selected'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const BulkDynamicUpdateNextComponents: React.FC = () => {
  const [newItemTags, setNewItemTags] = useState<string[]>([]);
  const { toggleBulkDynamicUpdateModal, isBulkDynamicUpdateModal, bulkData, setBulkData } = usePostsStore();

  const [bulkUpdatePosts, { isLoading }] = useBulkUpdatePostsMutation();

  const handleBulkEditPosts = async () => {
    if (!bulkData.length) return;
    try {
      const newBulkData = bulkData.map(({ _id, ...rest }) => ({
        id: _id,
        updateData: { ...rest, dataArr: newItemTags },
      }));

      await bulkUpdatePosts(newBulkData).unwrap();
      toggleBulkDynamicUpdateModal(false);
      setBulkData([]);
      setNewItemTags([]);
      handleSuccess('Update Successful');
    } catch (error) {
      console.error('Failed to edit posts:', error);
      handleError('Failed to update items. Please try again.');
    }
  };

  return (
    <Dialog open={isBulkDynamicUpdateModal} onOpenChange={toggleBulkDynamicUpdateModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Dynamic Update</DialogTitle>
        </DialogHeader>
        {bulkData.length > 0 && (
          <div>
            <p className="pt-2">
              You are about to update <span className="font-semibold">({bulkData.length})</span> posts.
            </p>
            <div className="w-full flex items-center justify-between pt-2">
              <DynamicDataSelect label="Update all data as" newItemTags={newItemTags as string[]} setNewItemTags={setNewItemTags} />
            </div>
          </div>
        )}
        <ScrollArea className="h-[400px] w-full rounded-md border p-4">
          <div className="flex flex-col gap-2">
            {bulkData.map((post, idx) => (
              <div key={(post._id as string) || idx} className="flex items-start mb-2 justify-between flex-col">
                <div className="flex flex-col">
                  <span>
                    {idx + 1}. {(post['title'] as string) || ''}
                  </span>
                  <span className="text-xs mt-0 text-blue-500">Will be updated to: {newItemTags.join(', ') || 'N/A'}</span>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
        <DialogFooter>
          <Button variant="outline" onClick={() => toggleBulkDynamicUpdateModal(false)} className="cursor-pointer border-slate-400 hover:border-slate-500">
            Cancel
          </Button>
          <Button
            disabled={isLoading}
            variant="outline"
            onClick={handleBulkEditPosts}
            className="text-green-500 hover:text-green-600 cursor-pointer bg-green-100 hover:bg-green-200 border border-green-300 hover:border-green-400"
          >
            {isLoading ? 'Updating...' : 'Update Selected'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

interface SearchBoxProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
  debounceTime?: number;
}

const SearchBox: React.FC<SearchBoxProps> = ({ onSearch, placeholder = 'Search...', autoFocus = false, debounceTime = 500 }) => {
  const [query, setQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    setIsTyping(true);
    debounceTimerRef.current = setTimeout(() => {
      onSearch(query);
      setIsTyping(false);
    }, debounceTime);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [query, debounceTime, onSearch]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      onSearch(query);
      setIsTyping(false);
    }
  };

  const handleClearSearch = () => {
    setQuery('');
    onSearch('');
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div className="relative w-full mb-4">
      <div className="relative flex items-center">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Search size={18} className="text-gray-400" />
        </div>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full py-2 pl-10 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
        />
        {query.length > 0 && (
          <button onClick={handleClearSearch} className="absolute inset-y-0 right-0 flex items-center pr-3" aria-label="Clear search">
            <X size={18} className="text-gray-400 hover:text-gray-600" />
          </button>
        )}
        {isTyping && query.length > 0 && (
          <div className="absolute inset-y-0 right-10 flex items-center pr-3">
            <div className="w-4 h-4 border-2 border-t-primary border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </div>
    </div>
  );
};

interface TooManyRequestsProps {
  message?: string;
  retrySeconds?: number;
}

const TooManyRequests: React.FC<TooManyRequestsProps> = ({ message = 'Too many requests. Please try again later.', retrySeconds = 30 }) => {
  const [countdown, setCountdown] = useState(retrySeconds);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleRetry = () => window.location.reload();

  const containerVariants = {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
    exit: { opacity: 0, scale: 0.9, transition: { duration: 0.3 } },
  };

  const pulseVariants = {
    initial: { scale: 1 },
    animate: {
      scale: [1, 1.05, 1],
      transition: {
        repeat: Infinity,
        repeatType: 'reverse',
        duration: 2,
      } as const,
    },
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 px-4">
      <motion.div className="w-full max-w-md" variants={containerVariants} initial="initial" animate="animate" exit="exit">
        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          <div className="bg-red-50 px-6 py-4 flex items-center justify-center">
            <motion.div variants={pulseVariants} initial="initial" animate="animate">
              <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </motion.div>
          </div>
          <div className="px-6 py-8">
            <motion.h3
              className="text-xl md:text-2xl font-bold text-center text-gray-800 mb-6"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {message}
            </motion.h3>
            <motion.div className="space-y-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-red-400 rounded-full"
                  initial={{ width: '100%' }}
                  animate={{
                    width: `${(countdown / retrySeconds) * 100}%`,
                  }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              <div className="flex justify-center mt-6">
                <button
                  onClick={handleRetry}
                  disabled={countdown > 0}
                  className={`cursor-pointer px-6 py-3 rounded-lg text-white font-medium transition-all duration-150 transform hover:scale-105 ${
                    countdown > 0 ? 'bg-gray-400 cursor-text' : 'bg-red-500 hover:bg-red-600 shadow-md hover:shadow-lg'
                  }`}
                >
                  {countdown > 0 ? `Retry in ${countdown}s` : 'Try Again'}
                </button>
              </div>
            </motion.div>
          </div>
          <div className="bg-gray-50 px-6 py-4 text-sm text-center text-gray-500">If the problem persists, please contact support.</div>
        </div>
      </motion.div>
    </div>
  );
};

type FilterPayload = { type: 'month'; value: { start: string; end: string } } | { type: 'range'; value: { start: string; end: string } };

interface FilterDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onApplyFilter: (filter: FilterPayload) => void;
  onClearFilter: () => void;
  initialFilter?: FilterPayload;
}

const FilterDialog: React.FC<FilterDialogProps> = ({ isOpen, onOpenChange, onApplyFilter, onClearFilter, initialFilter }) => {
  const [activeTab, setActiveTab] = useState('month');
  const [selectedMonth, setSelectedMonth] = useState<string>('');
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [tempDateRange, setTempDateRange] = useState<DateRange | undefined>();

  useEffect(() => {
    if (isOpen) {
      if (initialFilter) {
        if (initialFilter.type === 'month') {
          setActiveTab('month');
          setSelectedMonth(format(new Date(initialFilter.value.start), 'yyyy-MM'));
          setDateRange(undefined);
        } else if (initialFilter.type === 'range') {
          setActiveTab('range');
          setDateRange({
            from: new Date(initialFilter.value.start),
            to: new Date(initialFilter.value.end),
          });
          setSelectedMonth('');
        }
      } else {
        setSelectedMonth('');
        setDateRange(undefined);
      }
      setTempDateRange(dateRange);
    }
  }, [initialFilter, isOpen, dateRange]);

  useEffect(() => {
    if (isCalendarOpen) {
      setTempDateRange(dateRange);
    }
  }, [isCalendarOpen, dateRange]);

  const monthOptions = useMemo(() => {
    const options = [];
    const now = new Date();
    for (let i = 0; i < 12; i++) {
      const date = subMonths(now, i);
      options.push({
        label: format(date, 'MMMM yyyy'),
        value: format(date, 'yyyy-MM'),
      });
    }
    return options;
  }, []);

  const handleApply = () => {
    if (activeTab === 'month' && selectedMonth) {
      const monthDate = new Date(selectedMonth);
      const startDate = startOfMonth(monthDate);
      const endDate = endOfMonth(monthDate);
      onApplyFilter({
        type: 'month',
        value: {
          start: format(startDate, 'yyyy-MM-dd'),
          end: format(endDate, 'yyyy-MM-dd'),
        },
      });
    } else if (activeTab === 'range' && dateRange?.from && dateRange?.to) {
      onApplyFilter({
        type: 'range',
        value: {
          start: format(dateRange.from, 'yyyy-MM-dd'),
          end: format(dateRange.to, 'yyyy-MM-dd'),
        },
      });
    }
    onOpenChange(false);
  };

  const handleClear = () => {
    onClearFilter();
    setSelectedMonth('');
    setDateRange(undefined);
    setTempDateRange(undefined);
    onOpenChange(false);
  };

  const handleCalendarUpdate = () => {
    setDateRange(tempDateRange);
    setIsCalendarOpen(false);
  };

  const handleCalendarClose = () => {
    setTempDateRange(dateRange);
    setIsCalendarOpen(false);
  };

  const isApplyDisabled = (activeTab === 'month' && !selectedMonth) || (activeTab === 'range' && (!dateRange?.from || !dateRange?.to));
  const isCalendarUpdateDisabled = !tempDateRange?.from || !tempDateRange?.to;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px] rounded-xl border border-white/20 bg-white/10 backdrop-blur-2xl shadow-xl transition-all text-white">
          <DialogHeader className="pb-3">
            <DialogTitle className="text-white bg-clip-text bg-linear-to-r from-white to-blue-200">Filter Posts</DialogTitle>
            <DialogDescription className="text-white/70">Select a filter option to narrow down data.</DialogDescription>
          </DialogHeader>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-white/10 backdrop-blur-lg rounded-lg text-white border border-white/20">
              <TabsTrigger value="month" className="data-[state=active]:bg-white/20 data-[state=active]:shadow-none text-white">
                By Month
              </TabsTrigger>
              <TabsTrigger value="range" className="data-[state=active]:bg-white/20 data-[state=active]:shadow-none text-white">
                By Date Range
              </TabsTrigger>
            </TabsList>

            <TabsContent value="month" className="py-4">
              <div className="grid gap-2">
                <Label htmlFor="month-select" className="text-white">
                  Select Month
                </Label>
                <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                  <SelectTrigger id="month-select" className="text-white border border-white/20 bg-white/5">
                    <SelectValue placeholder="Choose a month" />
                  </SelectTrigger>
                  <SelectContent className="bg-white/20 backdrop-blur-xl text-white border border-white/20">
                    {monthOptions.map(option => (
                      <SelectItem key={option.value} value={option.value} className="focus:bg-white/30">
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </TabsContent>

            <TabsContent value="range" className="py-4">
              <div className="grid gap-2">
                <Label className="text-white">Select Date Range</Label>
                <Button id="date" variant="outlineGlassy" onClick={() => setIsCalendarOpen(true)}>
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange?.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, 'LLL dd, y')} - {format(dateRange.to, 'LLL dd, y')}
                      </>
                    ) : (
                      format(dateRange.from, 'LLL dd, y')
                    )
                  ) : (
                    <span>Pick a date range</span>
                  )}
                </Button>
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter className="mt-2 gap-2">
            <Button size="sm" variant="outlineFire" onClick={handleClear}>
              Clear Filter
            </Button>
            <Button size="sm" variant="outlineGarden" disabled={isApplyDisabled} onClick={handleApply}>
              Apply Filter
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isCalendarOpen} onOpenChange={handleCalendarClose}>
        <DialogContent className="p-2 rounded-xl border border-white/20 bg-white/10 backdrop-blur-xl shadow-lg md:p-4 max-w-[608px] min-w-[608px] w-[608px] text-white">
          <DialogTitle className="text-white">Select Date Range</DialogTitle>
          <Calendar mode="range" selected={tempDateRange} onSelect={setTempDateRange} numberOfMonths={2} />

          <DialogFooter className="mt-4 flex justify-end gap-2">
            <Button variant="outlineWater" size="sm" onClick={handleCalendarClose}>
              Close
            </Button>
            <Button variant="outlineGarden" size="sm" disabled={isCalendarUpdateDisabled} onClick={handleCalendarUpdate}>
              Update
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

interface SummaryData {
  overall: {
    totalRecords: number;
    recordsLast24Hours: number;
    recordsLastMonth: number;
  };
  monthlyTable?: Array<Record<string, string | number>>;
  tableSummary?: {
    totalMonths: number;
    [key: string]: number;
  };
  pagination?: {
    currentPage: number;
    limit: number;
    totalMonths: number;
    totalPages: number;
  };
}

const SUMMARY_COLORS = ['#60a5fa', '#34d399', '#fbbf24', '#f87171', '#a78bfa', '#fb923c', '#ec4899', '#06b6d4'];

const PostsSummary: React.FC = () => {
  const [page, setPage] = useState(1);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'table' | 'bar' | 'pie'>('table');
  const limit = 10;

  const { data, isLoading, isError, isFetching } = useGetPostsSummaryQuery({ page, limit }, { skip: !isDialogOpen });

  const summaryData: SummaryData | undefined = data?.data;

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= (summaryData?.pagination?.totalPages || 1)) {
      setPage(newPage);
    }
  };

  const tableHeaders = summaryData?.monthlyTable?.[0] ? Object.keys(summaryData.monthlyTable[0]) : [];

  const summaryKeys = summaryData?.tableSummary ? Object.keys(summaryData.tableSummary).filter(key => key !== 'totalMonths') : [];

  const barChartData =
    summaryData?.monthlyTable?.map(row => {
      const formattedRow: Record<string, number | string> = {};
      Object.keys(row).forEach(key => {
        formattedRow[key] = typeof row[key] === 'number' ? row[key] : row[key];
      });
      return formattedRow;
    }) || [];

  const pieChartData = summaryData?.tableSummary
    ? summaryKeys.map(key => ({
        name: key.replace(/([A-Z])/g, ' $1').trim(),
        value: summaryData.tableSummary![key] as number,
      }))
    : [];

  const overallStatsData = [
    { name: 'Total Records', value: summaryData?.overall.totalRecords || 0 },
    {
      name: 'Last 24 Hours',
      value: summaryData?.overall.recordsLast24Hours || 0,
    },
    { name: 'Last Month', value: summaryData?.overall.recordsLastMonth || 0 },
  ];

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outlineGlassy" size="sm">
          <TrendingUp className="mr-2 h-4 w-4" />
          Summary
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-7xl max-h-[90vh] mt-4 overflow-y-auto rounded-2xl border border-white/20 bg-gradient-to-br from-slate-900/95 via-blue-900/90 to-purple-900/95 backdrop-blur-3xl shadow-2xl text-white">
        <DialogHeader className="space-y-3 pb-4 border-b border-white/10">
          <DialogTitle className="text-3xl font-bold bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Posts Analytics Dashboard
          </DialogTitle>
          <DialogDescription className="text-white/60 text-base">Comprehensive overview of your posts data with interactive visualizations</DialogDescription>
        </DialogHeader>

        {isLoading && (
          <div className="flex items-center justify-center p-16">
            <div className="text-center space-y-4">
              <Loader2 className="h-12 w-12 animate-spin text-blue-400 mx-auto" />
              <p className="text-white/70">Loading analytics...</p>
            </div>
          </div>
        )}

        {isError && (
          <div className="text-center p-16">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-500/20 mb-4">
              <Activity className="h-8 w-8 text-red-400" />
            </div>
            <p className="text-red-300 text-lg">Failed to load summary data.</p>
          </div>
        )}

        {!isLoading && !isError && summaryData && (
          <div className="space-y-6 py-2">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="border-white/20 bg-gradient-to-br from-blue-500/20 to-blue-600/10 backdrop-blur-xl shadow-lg text-white hover:shadow-blue-500/20 transition-all duration-300 hover:scale-[1.02]">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white/60 text-sm mb-1">Total Records</p>
                      <p className="text-3xl font-bold">{summaryData.overall.totalRecords ?? 'N/A'}</p>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-blue-500/30 flex items-center justify-center">
                      <CalendarIconRC className="h-6 w-6 text-blue-300" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-white/20 bg-gradient-to-br from-green-500/20 to-green-600/10 backdrop-blur-xl shadow-lg text-white hover:shadow-green-500/20 transition-all duration-300 hover:scale-[1.02]">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white/60 text-sm mb-1">Last 24 Hours</p>
                      <p className="text-3xl font-bold">{summaryData.overall.recordsLast24Hours ?? 'N/A'}</p>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-green-500/30 flex items-center justify-center">
                      <Activity className="h-6 w-6 text-green-300" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-white/20 bg-gradient-to-br from-purple-500/20 to-purple-600/10 backdrop-blur-xl shadow-lg text-white hover:shadow-purple-500/20 transition-all duration-300 hover:scale-[1.02]">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white/60 text-sm mb-1">Last Month</p>
                      <p className="text-3xl font-bold">{summaryData.overall.recordsLastMonth ?? 'N/A'}</p>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-purple-500/30 flex items-center justify-center">
                      <TrendingUp className="h-6 w-6 text-purple-300" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-white/20 bg-white/5 backdrop-blur-xl shadow-lg text-white">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-blue-400" />
                    Overall Statistics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={overallStatsData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                      <XAxis dataKey="name" stroke="rgba(255,255,255,0.7)" tick={{ fontSize: 12 }} />
                      <YAxis stroke="rgba(255,255,255,0.7)" tick={{ fontSize: 12 }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'rgba(0,0,0,0.9)',
                          border: '1px solid rgba(255,255,255,0.2)',
                          borderRadius: '12px',
                          color: 'white',
                        }}
                      />
                      <Bar dataKey="value" fill="url(#colorGradient)" radius={[8, 8, 0, 0]} />
                      <defs>
                        <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#60a5fa" stopOpacity={1} />
                          <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.8} />
                        </linearGradient>
                      </defs>
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {summaryData.tableSummary && (
                <Card className="border-white/20 bg-white/5 backdrop-blur-xl shadow-lg text-white">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <PieChart className="h-5 w-5 text-purple-400" />
                      Grand Total Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                          <p className="text-white/60 text-xs mb-1">Total Months</p>
                          <p className="text-2xl font-bold">{summaryData.tableSummary.totalMonths}</p>
                        </div>
                        {summaryKeys.map((key, index) => (
                          <div key={key} className="p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                            <p className="text-white/60 text-xs mb-1">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                            <p
                              className="text-xl font-bold"
                              style={{
                                color: SUMMARY_COLORS[index % SUMMARY_COLORS.length],
                              }}
                            >
                              {summaryData.tableSummary![key].toLocaleString()}
                            </p>
                          </div>
                        ))}
                      </div>
                      <ResponsiveContainer width="100%" height={250}>
                        <RechartsPieChart>
                          <Pie
                            data={pieChartData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={(props: PieLabelRenderProps) => {
                              const percent = props.percent as number;
                              return `${(percent * 100).toFixed(0)}%`;
                            }}
                            outerRadius={85}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {pieChartData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={SUMMARY_COLORS[index % SUMMARY_COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip
                            contentStyle={{
                              backgroundColor: 'rgba(0,0,0,0.9)',
                              border: '1px solid rgba(255,255,255,0.2)',
                              borderRadius: '12px',
                              color: 'white',
                            }}
                          />
                        </RechartsPieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {summaryData.monthlyTable && (
              <Card className="border-white/20 bg-white/5 backdrop-blur-xl shadow-lg text-white">
                <CardHeader>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <CardTitle className="text-xl">Monthly Data Breakdown</CardTitle>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant={viewMode === 'table' ? 'default' : 'ghost'}
                        onClick={() => setViewMode('table')}
                        className={cn(
                          'h-9 px-4 transition-all duration-200',
                          viewMode === 'table' ? 'bg-blue-500 hover:bg-blue-600 text-white' : 'text-white/70 hover:text-white hover:bg-white/10',
                        )}
                      >
                        Table
                      </Button>
                      <Button
                        size="sm"
                        variant={viewMode === 'bar' ? 'default' : 'ghost'}
                        onClick={() => setViewMode('bar')}
                        className={cn(
                          'h-9 px-4 transition-all duration-200',
                          viewMode === 'bar' ? 'bg-blue-500 hover:bg-blue-600 text-white' : 'text-white/70 hover:text-white hover:bg-white/10',
                        )}
                      >
                        <BarChart3 className="h-4 w-4 mr-1" />
                        Bar
                      </Button>
                      <Button
                        size="sm"
                        variant={viewMode === 'pie' ? 'default' : 'ghost'}
                        onClick={() => setViewMode('pie')}
                        className={cn(
                          'h-9 px-4 transition-all duration-200',
                          viewMode === 'pie' ? 'bg-blue-500 hover:bg-blue-600 text-white' : 'text-white/70 hover:text-white hover:bg-white/10',
                        )}
                      >
                        <PieChart className="h-4 w-4 mr-1" />
                        Pie
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className={`relative transition-opacity duration-200 ${isFetching ? 'opacity-50' : ''}`}>
                    {isFetching && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-lg backdrop-blur-sm z-10">
                        <Loader2 className="h-8 w-8 animate-spin text-white" />
                      </div>
                    )}

                    {viewMode === 'table' && (
                      <div className="rounded-xl border border-white/20 bg-white/5 backdrop-blur-xl overflow-hidden">
                        <Table className="text-white">
                          <TableHeader className="bg-linear-to-r from-blue-500/20 to-purple-500/20">
                            <TableRow className="border-white/10 hover:bg-transparent">
                              {tableHeaders.map(header => (
                                <TableHead key={header} className="text-white font-semibold whitespace-nowrap">
                                  {header.charAt(0).toUpperCase() +
                                    header
                                      .slice(1)
                                      .replace(/([A-Z])/g, ' $1')
                                      .trim()}
                                </TableHead>
                              ))}
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {summaryData.monthlyTable.length > 0 ? (
                              summaryData.monthlyTable.map((row, index) => (
                                <TableRow key={index} className="hover:bg-white/10 transition-colors border-white/5">
                                  {tableHeaders.map(header => (
                                    <TableCell key={header} className="text-white/90">
                                      {row[header]}
                                    </TableCell>
                                  ))}
                                </TableRow>
                              ))
                            ) : (
                              <TableRow>
                                <TableCell colSpan={tableHeaders.length} className="h-32 text-center text-white/70">
                                  No monthly data to display.
                                </TableCell>
                              </TableRow>
                            )}
                          </TableBody>
                        </Table>
                      </div>
                    )}

                    {viewMode === 'bar' && (
                      <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                        <ResponsiveContainer width="100%" height={400}>
                          <BarChart data={barChartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                            <XAxis dataKey={tableHeaders[0]} stroke="rgba(255,255,255,0.7)" angle={-45} textAnchor="end" height={80} />
                            <YAxis stroke="rgba(255,255,255,0.7)" />
                            <Tooltip
                              contentStyle={{
                                backgroundColor: 'rgba(0,0,0,0.9)',
                                border: '1px solid rgba(255,255,255,0.2)',
                                borderRadius: '12px',
                                color: 'white',
                              }}
                            />
                            <Legend />
                            {tableHeaders.slice(1).map((header, index) => (
                              <Bar key={header} dataKey={header} fill={SUMMARY_COLORS[index % SUMMARY_COLORS.length]} radius={[8, 8, 0, 0]} />
                            ))}
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    )}

                    {viewMode === 'pie' && barChartData.length > 0 && (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {tableHeaders.slice(1).map((header, idx) => {
                          const chartData = barChartData
                            .map(row => ({
                              name: String(row[tableHeaders[0]]),
                              value: Number(row[header]) || 0,
                            }))
                            .filter(item => item.value > 0);

                          return (
                            <div
                              key={header}
                              className="border border-white/20 rounded-xl p-5 bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300 hover:scale-[1.02]"
                            >
                              <h3 className="text-base font-semibold mb-4 text-center text-white/90 pb-2 border-b border-white/10">
                                {header.replace(/([A-Z])/g, ' $1').trim()}
                              </h3>
                              <ResponsiveContainer width="100%" height={220}>
                                <RechartsPieChart>
                                  <Pie
                                    data={chartData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={(props: PieLabelRenderProps) => {
                                      const value = props.value as number;
                                      return value && value > 0 ? String(value) : '';
                                    }}
                                    outerRadius={70}
                                    fill="#8884d8"
                                    dataKey="value"
                                  >
                                    {chartData.map((entry, index) => (
                                      <Cell key={`cell-${index}`} fill={SUMMARY_COLORS[(index + idx) % SUMMARY_COLORS.length]} />
                                    ))}
                                  </Pie>
                                  <Tooltip
                                    contentStyle={{
                                      backgroundColor: 'rgba(0,0,0,0.9)',
                                      border: '1px solid rgba(255,255,255,0.2)',
                                      borderRadius: '12px',
                                      color: 'white',
                                    }}
                                  />
                                </RechartsPieChart>
                              </ResponsiveContainer>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        <DialogFooter className="border-t border-white/10 pt-4 mt-2">
          {summaryData?.pagination && summaryData.pagination.totalPages > 1 && (
            <UIPagination className="text-white w-full justify-center">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={e => {
                      e.preventDefault();
                      handlePageChange(page - 1);
                    }}
                    className={cn(
                      'border-white/30 bg-white/10 backdrop-blur-lg text-white hover:bg-white/20 transition-all duration-200',
                      page <= 1 && 'pointer-events-none opacity-40',
                    )}
                  />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink
                    isActive
                    className="border-white/30 bg-blue-500/30 backdrop-blur-xl text-white hover:bg-blue-500/40 transition-all duration-200"
                  >
                    Page {page} of {summaryData.pagination.totalPages}
                  </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={e => {
                      e.preventDefault();
                      handlePageChange(page + 1);
                    }}
                    className={cn(
                      'border-white/30 bg-white/10 backdrop-blur-lg text-white hover:bg-white/20 transition-all duration-200',
                      page >= summaryData.pagination.totalPages && 'pointer-events-none opacity-40',
                    )}
                  />
                </PaginationItem>
              </PaginationContent>
            </UIPagination>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

type DisplayablePostsKeys = 'title' | 'email' | 'age' | 'amount' | 'isActive' | 'policy' | 'createdAt';
type ColumnVisibilityState = Record<DisplayablePostsKeys, boolean>;

const ViewTableNextComponents: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [sortConfig, setSortConfig] = useState<{
    key: DisplayablePostsKeys;
    direction: 'asc' | 'desc';
  } | null>(null);

  const [isExportDialogOpen, setExportDialogOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const {
    setSelectedPosts,
    toggleBulkEditModal,
    toggleBulkUpdateModal,
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
  } = usePostsStore();

  const {
    data: getResponseData,
    isLoading,
    isError,
    error,
  } = useGetPostsQuery({
    q: queryPramsQ,
    limit: queryPramsLimit,
    page: queryPramsPage,
  });

  const allData: IPosts[] = useMemo(() => getResponseData?.data?.posts || [], [getResponseData]);

  const tableHeaders: { key: DisplayablePostsKeys; label: string }[] = useMemo(
    () => [
      { key: 'title', label: 'Title' },
      { key: 'email', label: 'Email' },
      { key: 'age', label: 'Age' },
      { key: 'amount', label: 'Amount' },
      { key: 'isActive', label: 'Is Active' },
      { key: 'policy', label: 'Policy' },
      { key: 'createdAt', label: 'Created At' },
    ],
    [],
  );

  const [columnVisibility, setColumnVisibility] = useState<ColumnVisibilityState>(() => {
    const initialState = {} as ColumnVisibilityState;
    let counter = 0;
    for (const header of tableHeaders) {
      if (counter > 3) {
        initialState[header.key] = false;
      } else {
        initialState[header.key] = true;
      }
      counter++;
    }
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

  const handleSort = (key: DisplayablePostsKeys) => {
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
  const handleSelectRow = (isChecked: boolean, item: IPosts) => setBulkData(isChecked ? [...bulkData, item] : bulkData.filter(i => i._id !== item._id));

  const renderActions = (item: IPosts) => {
    return (
      <div className="flex justify-end items-center">
        <div className="hidden md:flex gap-2">
          <Button
            variant="outlineWater"
            className="min-w-[8px]"
            size="sm"
            onClick={() => {
              setSelectedPosts(item);
              toggleViewModal(true);
            }}
          >
            <EyeIcon className="w-4 h-4" />
          </Button>
          <Button
            variant="outlineWater"
            className="min-w-[8px]"
            size="sm"
            onClick={() => {
              setSelectedPosts(item);
              toggleEditModal(true);
            }}
          >
            <PencilIcon className="w-4 h-4" />
          </Button>
          <Button
            variant="destructive"
            className="min-w-[8px]"
            size="sm"
            onClick={() => {
              setSelectedPosts(item);
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
                  setSelectedPosts(item);
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
                  setSelectedPosts(item);
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
                  setSelectedPosts(item);
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

  const renderTableRows = () =>
    sortedData.map((item: IPosts) => (
      <TableRow key={item._id}>
        <TableCell>
          <Checkbox onCheckedChange={checked => handleSelectRow(!!checked, item)} checked={bulkData.some(i => i._id === item._id)} />
        </TableCell>
        {visibleHeaders.map(header => (
          <TableCell key={header.key}>{header.key === 'createdAt' ? formatDate(item.createdAt) : String(item[header.key] ?? '')}</TableCell>
        ))}
        <TableCell className="text-right max-w-[10px]">{renderActions(item)}</TableCell>
      </TableRow>
    ));

  if (isLoading) return <LoadingComponent />;
  if (isError) return <ErrorMessageComponent message={error?.toString() || 'An error occurred'} />;

  return (
    <div className="w-full flex flex-col">
      <div className="w-full my-4">
        <div className="w-full flex md:flex-row items-center justify-between gap-4 pb-2 border-b">
          <div className="flex items-center gap-2 justify-start w-full">
            <Label>Selected:</Label>
            <span className="text-sm text-slate-300">({bulkData.length})</span>
          </div>

          <div className="hidden md:flex items-center justify-end w-full gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outlineWater" size="sm">
                  <MoreHorizontalIcon className="w-4 h-4 mr-2" />
                  Columns
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Toggle Columns</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {tableHeaders.map(header => (
                  <DropdownMenuCheckboxItem
                    key={header.key}
                    className="capitalize"
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

            <Button size="sm" variant="outlineWater" onClick={() => setExportDialogOpen(true)} disabled={bulkData.length === 0}>
              <DownloadIcon className="w-4 h-4 mr-1" /> Export
            </Button>
            <Button size="sm" variant="outlineWater" onClick={() => toggleBulkUpdateModal(true)} disabled={bulkData.length === 0}>
              <PencilIcon className="w-4 h-4 mr-1" /> B.Update
            </Button>
            <Button size="sm" variant="outlineWater" onClick={() => toggleBulkEditModal(true)} disabled={bulkData.length === 0}>
              <PencilIcon className="w-4 h-4 mr-1" /> B.Edit
            </Button>
            <Button size="sm" variant="destructive" onClick={() => toggleBulkDeleteModal(true)} disabled={bulkData.length === 0}>
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
                  <SheetTitle className="text-lg font-semibold text-white/90"></SheetTitle>
                </SheetHeader>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outlineWater" size="sm" className="justify-start">
                      Columns
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Toggle Columns</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {tableHeaders.map(header => (
                      <DropdownMenuCheckboxItem
                        key={header.key}
                        className="capitalize"
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

                <Button size="sm" variant="outlineWater" onClick={() => setExportDialogOpen(true)} disabled={bulkData.length === 0}>
                  <DownloadIcon className="w-4 h-4 mr-1" /> Export
                </Button>
                <Button size="sm" variant="outlineWater" onClick={() => toggleBulkUpdateModal(true)} disabled={bulkData.length === 0}>
                  <PencilIcon className="w-4 h-4 mr-1" /> B.Update
                </Button>
                <Button size="sm" variant="outlineWater" onClick={() => toggleBulkEditModal(true)} disabled={bulkData.length === 0}>
                  <PencilIcon className="w-4 h-4 mr-1" /> B.Edit
                </Button>
                <Button size="sm" variant="destructive" onClick={() => toggleBulkDeleteModal(true)} disabled={bulkData.length === 0}>
                  <TrashIcon className="w-4 h-4 mr-1" /> B.Delete
                </Button>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      {allData.length === 0 ? (
        <div className="py-12 text-center text-2xl text-slate-300">Ops! Nothing was found.</div>
      ) : (
        <Table className="min-w-max border">
          <>
            <TableHeader>
              <TableRow className="bg-blue-300/40 text-white font-bold">
                <TableHead>
                  <Checkbox onCheckedChange={checked => handleSelectAll(!!checked)} checked={bulkData.length === allData.length && allData.length > 0} />
                </TableHead>
                {visibleHeaders.map(({ key, label }) => (
                  <TableHead key={key} className="cursor-pointer bg-accent-100/60 text-slate-50 font-bold whitespace-nowrap" onClick={() => handleSort(key)}>
                    {label}
                    {sortConfig?.key === key && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </TableHead>
                ))}
                <TableHead className="text-right bg-accent-100/60 text-slate-50 font-bold whitespace-nowrap">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>{renderTableRows()}</TableBody>
          </>
        </Table>
      )}

      <Pagination
        currentPage={queryPramsPage}
        itemsPerPage={queryPramsLimit}
        onPageChange={page => setQueryPramsPage(page)}
        totalItems={getResponseData?.data?.total || 0}
      />

      <div className="max-w-xs flex items-center self-center justify-between pl-2 gap-4 border rounded-lg w-full mx-auto mt-8">
        <Label htmlFor="set-limit" className="text-right text-slate-50 font-normal pl-3">
          Posts per page
        </Label>
        <Select
          onValueChange={value => {
            setQueryPramsLimit(Number(value));
            setQueryPramsPage(1);
          }}
          defaultValue={queryPramsLimit.toString()}
        >
          <SelectTrigger className="border-0">
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            {pageLimitArr.map(i => (
              <SelectItem key={i} value={i.toString()} className="cursor-pointer">
                {i}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <ExportDialog
        isOpen={isExportDialogOpen}
        onOpenChange={setExportDialogOpen}
        headers={tableHeaders}
        data={bulkData}
        fileName={`Exported_Posts_${new Date().toISOString()}.xlsx`}
      />
    </div>
  );
};

const MainNextPage: React.FC = () => {
  const [hashSearchText, setHashSearchText] = useState('');
  const [isFilterModalOpen, setFilterModalOpen] = useState(false);

  const { toggleAddModal, queryPramsLimit, queryPramsPage, queryPramsQ, setQueryPramsPage, setQueryPramsQ } = usePostsStore();

  const {
    data: getResponseData,
    isSuccess,
    isLoading,
    refetch,
    status: statusCode,
  } = useGetPostsQuery(
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

  const modals = [
    AddNextComponents,
    ViewNextComponents,
    BulkDeleteNextComponents,
    BulkEditNextComponents,
    EditNextComponents,
    DeleteNextComponents,
    BulkUpdatePosts,
    BulkDynamicUpdateNextComponents,
  ];

  let renderUI = (
    <div className="container mx-auto md:p-4">
      <div className="flex flex-col md:flex-row gap-2 justify-between items-center mb-6">
        <h1 className="h2 w-full text-white">
          Post Management {isSuccess && <sup className="text-xs text-gray-300">(total:{getResponseData?.data?.total || '00'})</sup>}
        </h1>

        <div className="w-full flex md:hidden justify-end">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outlineGlassy" size="icon">
                <Settings2 className="w-5 h-5" />
              </Button>
            </SheetTrigger>

            <SheetContent side="bottom" className="p-6 space-y-5 bg-white/10 backdrop-blur-xl border-t border-white/20 shadow-lg rounded-t-2xl">
              <SheetHeader>
                <SheetTitle className="text-white text-lg font-medium text-center">Post Actions</SheetTitle>
              </SheetHeader>

              <div className="flex flex-col gap-3">
                <PostsSummary />

                <Button size="sm" variant="outlineGlassy" onClick={handleFilter} disabled={isLoading} className="w-full">
                  <Filter className="w-4 h-4 mr-2" /> Filter
                </Button>

                <Button
                  size="sm"
                  variant="outlineGlassy"
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
                  <PlusIcon className="w-4 h-4 mr-2" /> Add Post
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        <div className="hidden md:flex flex-row gap-2 items-center justify-end w-full">
          <PostsSummary />
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
            <PlusIcon className="w-4 h-4 mr-2" /> Add Post
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
        <ViewTableNextComponents />
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
