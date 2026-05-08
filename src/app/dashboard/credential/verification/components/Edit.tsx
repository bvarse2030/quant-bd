/*
|-----------------------------------------
| setting up Edit for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

import React, { useEffect, useState } from 'react';

import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import InputFieldForString from '@/components/dashboard-ui/InputFieldForString';
import { useUpdateVerificationsMutation } from '@/redux/features/verifications/verificationsSlice';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';


import { useVerificationsStore } from '../store/store';
import { IVerifications, defaultVerifications } from '../store/data/data';
import { formatDuplicateKeyError, handleError, handleSuccess, isApiErrorResponse } from './utils';

const EditNextComponents: React.FC = () => {
  const { toggleEditModal, isEditModalOpen, selectedVerifications, setSelectedVerifications } = useVerificationsStore();

  const [updateVerifications, { isLoading }] = useUpdateVerificationsMutation();
  const [editedVerification, setVerification] = useState<IVerifications>(defaultVerifications);

  useEffect(() => {
    if (selectedVerifications) {
      setVerification(selectedVerifications);
    }
  }, [selectedVerifications]);

  const handleFieldChange = (name: string, value: unknown) => {
    setVerification(prev => ({ ...prev, [name]: value }));
  };

  const handleEditVerification = async () => {
    if (!selectedVerifications) return;

    try {
      const updateData = { ...editedVerification };
      // Strip server-only fields
      delete updateData._id;
      delete updateData.createdAt;
      delete updateData.updatedAt;

      await updateVerifications({
        id: selectedVerifications._id,
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

  return (
    <Dialog open={isEditModalOpen} onOpenChange={toggleEditModal}>
      <DialogContent
        className="sm:max-w-[825px] rounded-xl border mt-[35px] border-white/20 bg-white/10
                           backdrop-blur-2xl shadow-2xl overflow-hidden transition-all duration-300 p-0"
      >
        <ScrollArea className="h-[75vh] max-h-[calc(100vh-2rem)] rounded-xl">
          <DialogHeader className="p-6 pb-3">
            <DialogTitle
              className="text-xl font-semibold bg-clip-text text-transparent
                                       bg-linear-to-r from-white to-blue-200 drop-shadow-md"
            >
              Edit Verification
            </DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4 px-6 text-white">
            <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4 pr-1">
              <Label htmlFor="identifier " className="text-right ">
                Identifier
              </Label>
              <div className="col-span-3">
                <InputFieldForString
                  className="text-white"
                  id="identifier "
                  placeholder="Identifier "
                  value={editedVerification['identifier']}
                  onChange={value => handleFieldChange('identifier', value as string)}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4 pr-1">
              <Label htmlFor="value " className="text-right ">
                Value
              </Label>
              <div className="col-span-3">
                <InputFieldForString
                  className="text-white"
                  id="value "
                  placeholder="Value "
                  value={editedVerification['value']}
                  onChange={value => handleFieldChange('value', value as string)}
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
              setSelectedVerifications(null);
            }}
            size="sm"
          >
            Cancel
          </Button>
          <Button disabled={isLoading} onClick={handleEditVerification} variant="outlineGarden" size="sm">
            {isLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditNextComponents;
