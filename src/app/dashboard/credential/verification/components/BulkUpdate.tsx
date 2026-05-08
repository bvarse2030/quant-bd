/*
|-----------------------------------------
| setting up BulkUpdate for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

'use client';

import React from 'react';

import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useBulkUpdateVerificationsMutation } from '@/redux/features/verifications/verificationsSlice';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

import { IVerifications } from '../store/data/data';
import { handleSuccess, handleError } from './utils';
import { useVerificationsStore } from '../store/store';
import { verificationsSelectorArr } from '../store/store-constant';

const BulkUpdateVerifications: React.FC = () => {
  const { toggleBulkUpdateModal, isBulkUpdateModalOpen, bulkData, setBulkData } = useVerificationsStore();

  const [bulkUpdateVerifications, { isLoading }] = useBulkUpdateVerificationsMutation();

  const handleBulkUpdate = async () => {
    if (!bulkData.length) return;
    try {
      const newBulkData = bulkData.map(({ _id, ...rest }) => ({
        id: _id,
        updateData: rest,
      }));
      await bulkUpdateVerifications(newBulkData).unwrap();
      toggleBulkUpdateModal(false);
      setBulkData([]);
      handleSuccess('Update Successful');
    } catch (error) {
      console.error('Failed to edit verifications:', error);
      handleError('Failed to update items. Please try again.');
    }
  };

  const handleFieldChangeForAll = (value: string) => {
    setBulkData(
      bulkData.map(verification => ({
        ...verification,
        ['role']: value,
      })) as IVerifications[],
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
              You are about to update <span className="font-semibold text-white">({bulkData.length})</span> verifications.
            </p>

            <div className="flex items-center justify-between rounded-lg p-3 bg-white/5 border border-white/10 backdrop-blur-md">
              <p className="text-white/90">
                Set all <span className="font-semibold text-blue-300">Role</span> to
              </p>

              <Select onValueChange={value => handleFieldChangeForAll(value)} defaultValue={(verificationsSelectorArr[0] as string) || ''}>
                <SelectTrigger className="w-[180px] border-white/20 bg-white/10 text-white backdrop-blur-md">
                  <SelectValue placeholder="Select value" />
                </SelectTrigger>
                <SelectContent className="border-white/20 bg-white/10 backdrop-blur-xl text-white">
                  {verificationsSelectorArr?.map((option, index) => (
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
                  {idx + 1}. {(item['identifier'] as string) || ''}
                </span>
                <span className="text-blue-300">{item['identifier'] as string}</span>
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

export default BulkUpdateVerifications;
