/*
|-----------------------------------------
| setting up BulkDynamicUpdate for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

'use client';

import React, { useState } from 'react';

import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useBulkUpdateUsersMutation } from '@/redux/features/user/userSlice';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

import { useUsersStore } from '../store/store';
import DynamicDataSelect from './DynamicDataSelect';
import { handleSuccess, handleError } from './utils';

const BulkDynamicUpdateNextComponents: React.FC = () => {
  const [newItemTags, setNewItemTags] = useState<string[]>([]);
  const { toggleBulkDynamicUpdateModal, isBulkDynamicUpdateModal, bulkData, setBulkData } = useUsersStore();

  const [bulkUpdateUsers, { isLoading }] = useBulkUpdateUsersMutation();

  const handleBulkEditUsers = async () => {
    if (!bulkData.length) return;
    try {
      const newBulkData = bulkData.map(({ _id, ...rest }) => ({
        id: _id,
        updateData: { ...rest, dataArr: newItemTags },
      }));

      await bulkUpdateUsers(newBulkData).unwrap();
      toggleBulkDynamicUpdateModal(false);
      setBulkData([]);
      setNewItemTags([]);
      handleSuccess('Update Successful');
    } catch (error) {
      console.error('Failed to edit users:', error);
      handleError('Failed to update items. Please try again.');
    }
  };

  return (
    <Dialog open={isBulkDynamicUpdateModal} onOpenChange={toggleBulkDynamicUpdateModal}>
      <DialogContent className="sm:max-w-md rounded-xl border border-white/20 bg-white/10 backdrop-blur-2xl shadow-xl text-white">
        <DialogHeader>
          <DialogTitle className="text-white bg-clip-text bg-linear-to-r from-white to-green-200">Confirm Dynamic Update</DialogTitle>
        </DialogHeader>

        {bulkData.length > 0 && (
          <div>
            <p className="text-white/80 mt-2">
              You are updating&nbsp;
              <strong>({bulkData.length})</strong> users.
            </p>
            <div className="w-full flex items-center justify-between mt-3">
              <DynamicDataSelect label="Update all data as" newItemTags={newItemTags} setNewItemTags={setNewItemTags} />
            </div>
          </div>
        )}

        <ScrollArea className="h-[420px] w-full rounded-lg border border-white/20 bg-white/5 backdrop-blur-md p-4 mt-3">
          <div className="flex flex-col gap-2">
            {bulkData.map((user, idx) => (
              <div key={(user._id as string) || idx} className="flex flex-col gap-1 mb-2">
                <span className="text-sm text-white/90">
                  {idx + 1}. {String(user['name'] || '')}
                </span>
                <span className="text-xs text-green-300/80">Will be updated to: {newItemTags.join(', ') || 'N/A'}</span>
              </div>
            ))}
          </div>
        </ScrollArea>

        <DialogFooter className="gap-2 mt-3">
          <Button variant="outlineWater" size="sm" onClick={() => toggleBulkDynamicUpdateModal(false)}>
            Cancel
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={isLoading}
            onClick={handleBulkEditUsers}
            className="text-green-300 hover:text-green-200 bg-green-500/20 hover:bg-green-500/30 border-green-400/50 hover:border-green-400/70"
          >
            {isLoading ? 'Updating…' : 'Update Selected'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BulkDynamicUpdateNextComponents;
