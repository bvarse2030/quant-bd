/*
|-----------------------------------------
| setting up BulkDelete for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

import React from 'react';

import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useBulkDeleteUsersMutation } from '@/redux/features/user/userSlice';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

import { useUsersStore } from '../store/store';
import { handleSuccess, handleError } from './utils';

const BulkDeleteNextComponents: React.FC = () => {
  const { isBulkDeleteModalOpen, toggleBulkDeleteModal, bulkData, setBulkData } = useUsersStore();

  const [bulkDeleteUsers, { isLoading }] = useBulkDeleteUsersMutation();

  const handleBulkDelete = async () => {
    if (!bulkData?.length) return;
    try {
      const ids = bulkData.map(users => users._id);
      await bulkDeleteUsers({ ids }).unwrap();
      toggleBulkDeleteModal(false);
      setBulkData([]);
      handleSuccess('Delete Successful');
    } catch (error) {
      console.error('Failed to delete Users:', error);
      handleError('Failed to delete items. Please try again.');
    }
  };

  return (
    <Dialog open={isBulkDeleteModalOpen} onOpenChange={toggleBulkDeleteModal}>
      <DialogContent className="sm:max-w-md mt-3 rounded-xl border border-white/20 bg-white/10 backdrop-blur-2xl shadow-xl text-white">
        <DialogHeader>
          <DialogTitle className="text-white bg-clip-text bg-linear-to-r from-white to-red-200">Confirm Deletion</DialogTitle>
        </DialogHeader>

        {bulkData?.length > 0 && (
          <p className="text-white/80">
            You are deleting&nbsp;
            <strong>({bulkData.length})</strong> users.
          </p>
        )}

        <ScrollArea className="h-[420px] w-full rounded-lg border border-white/20 bg-white/5 backdrop-blur-md p-4 mt-3">
          <div className="flex flex-col gap-2">
            {bulkData.map((users, idx) => (
              <span key={(users._id as string) + idx} className="text-sm text-white/90">
                {idx + 1}. {String(users['name'] || '')}
              </span>
            ))}
          </div>
        </ScrollArea>

        <DialogFooter className="gap-2 mt-3">
          <Button variant="outlineGlassy" size="sm" onClick={() => toggleBulkDeleteModal(false)}>
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

export default BulkDeleteNextComponents;
