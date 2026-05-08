/*
|-----------------------------------------
| setting up Add for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

'use client';

import { useState, useEffect } from 'react';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { authClient } from '@/lib/auth-client';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useGetUsersQuery } from '@/redux/features/user/userSlice';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useAddAccessManagementsMutation } from '@/redux/features/accessManagements/accessManagementsSlice';

import { useAccessManagementsStore } from '../store/store';
import { IAccessManagements, defaultAccessManagements } from '../store/data/data';
import { formatDuplicateKeyError, handleError, handleSuccess, isApiErrorResponse } from './utils';

function useDebounce<T>(value: T, delay = 1000): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

const AddNextComponents: React.FC = () => {
  const { toggleAddModal, isAddModalOpen, setAccessManagements } = useAccessManagementsStore();
  const [addAccessManagements, { isLoading: isAdding }] = useAddAccessManagementsMutation();

  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 1000);

  const queryPramsPage = 1;
  const queryPramsLimit = 10;
  const queryPramsQ = debouncedSearch.length >= 3 ? debouncedSearch : '';

  const {
    data: getResponseData,
    isLoading: isFetching,
    isError,
  } = useGetUsersQuery({ q: queryPramsQ, limit: queryPramsLimit, page: queryPramsPage }, { skip: debouncedSearch.length < 3 });

  const users = getResponseData?.data?.users ?? [];
  const sessionEmail = authClient.useSession().data?.user.email || '';

  const handleAddAccessManagement = async (user: { _id: string; name: string; email: string }) => {
    try {
      const payload: IAccessManagements = {
        ...defaultAccessManagements,
        user_name: user.name,
        user_email: user.email,
        given_by_email: sessionEmail,
      };
      delete payload._id;
      const addedAccessManagement = await addAccessManagements(payload).unwrap();
      setAccessManagements([addedAccessManagement]);
      handleSuccess(`Access granted to ${user.name}`);
      toggleAddModal(false);
    } catch (error: unknown) {
      console.error('Failed to add record:', error);
      let errMessage = 'An unknown error occurred.';
      if (isApiErrorResponse(error)) {
        errMessage = formatDuplicateKeyError(error.data.message) || 'An API error occurred.';
      } else if (error instanceof Error) {
        errMessage = error.message;
      }
      handleError(errMessage);
    }
  };

  return (
    <Dialog open={isAddModalOpen} onOpenChange={toggleAddModal}>
      <DialogContent className="sm:max-w-[600px] bg-white/10 backdrop-blur-xl border border-white/20 shadow-xl mt-10 rounded-sm text-white transition-all duration-300">
        <DialogHeader className="border-b border-white/10 pb-3">
          <DialogTitle className="text-lg font-semibold tracking-wide text-white/90">Add Access for User</DialogTitle>
        </DialogHeader>

        <div className="space-y-5 mt-4">
          <div className="flex flex-col space-y-2">
            <Label htmlFor="search" className="text-white/70 text-sm font-medium">
              Search User
            </Label>
            <Input
              id="search"
              placeholder="Type at least 3 characters..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="bg-white/10 border border-white/20 placeholder:text-white/40 text-white 
                         rounded-sm focus-visible:ring-0 focus:border-white/40 backdrop-blur-md"
            />
          </div>

          <ScrollArea className="h-[300px] rounded-sm border border-white/40 bg-white/5 backdrop-blur-md shadow-inner">
            {isFetching ? (
              <p className="text-center text-sm text-white/60 p-3 ">Loading users...</p>
            ) : isError ? (
              <p className="text-center text-sm text-red-400 p-3 ">Failed to fetch users.</p>
            ) : users.length === 0 ? (
              <p className="text-center text-sm text-white/50 p-3 ">No users found.</p>
            ) : (
              <div className="space-y-2 py-2">
                {users.map((user: { _id: string; name: string; email: string }, idx: number) => (
                  <div
                    key={user._id + idx}
                    className="flex justify-between items-center rounded-sm border border-white/10 p-3 py-1 mx-2 
                               bg-white/10 hover:bg-white/20 backdrop-blur-md transition-all duration-200 shadow-sm"
                  >
                    <div>
                      <p className="font-medium text-white/90">{user.name}</p>
                      <p className="text-xs text-white/70 ">{user.email}</p>
                    </div>
                    <Button size="sm" variant="outlineWater" disabled={isAdding} onClick={() => handleAddAccessManagement(user)}>
                      {isAdding ? 'Adding...' : 'Add'}
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>

        <DialogFooter className="mt-4 border-t border-white/10 pt-3">
          <Button variant="outlineWater" size="sm" onClick={() => toggleAddModal(false)} className="border-white/30 text-white/80 hover:bg-white/20">
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddNextComponents;
