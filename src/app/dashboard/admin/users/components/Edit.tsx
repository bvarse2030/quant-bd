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
import { useUpdateUsersMutation } from '@/redux/features/user/userSlice';
import InputFieldForEmail from '@/components/dashboard-ui/InputFieldForEmail';
import InputFieldForString from '@/components/dashboard-ui/InputFieldForString';
import { BooleanInputField } from '@/components/dashboard-ui/BooleanInputField';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

import { useUsersStore } from '../store/store';
import { IUsers, defaultUsers } from '../store/data/data';
import { formatDuplicateKeyError, handleError, handleSuccess, isApiErrorResponse } from './utils';

const EditNextComponents: React.FC = () => {
  const { toggleEditModal, isEditModalOpen, selectedUsers, setSelectedUsers } = useUsersStore();

  const [updateUsers, { isLoading }] = useUpdateUsersMutation();
  const [editedUser, setUser] = useState<IUsers>(defaultUsers);

  useEffect(() => {
    if (selectedUsers) {
      setUser(selectedUsers);
    }
  }, [selectedUsers]);

  const handleFieldChange = (name: string, value: unknown) => {
    setUser(prev => ({ ...prev, [name]: value }));
  };

  const handleEditUser = async () => {
    if (!selectedUsers) return;

    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { _id, createdAt, updatedAt, ...updateData } = editedUser;

      await updateUsers({
        id: selectedUsers._id,
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
      <DialogContent className="sm:max-w-[625px] mt-[30px] bg-white/10 backdrop-blur-xl border border-white/20 text-white shadow-lg rounded-2xl">
        <DialogHeader className="border-b border-white/10 pb-3">
          <DialogTitle className="text-lg font-semibold tracking-wide text-white/90">Edit User</DialogTitle>
        </DialogHeader>

        <ScrollArea className="h-[450px] w-full rounded-md border border-white/10 p-4 bg-white/5 backdrop-blur-md shadow-inner">
          <div className="grid gap-6 py-4">
            <div>
              <Label htmlFor="name" className="text-white/70 pb-1 block">
                Name
              </Label>
              <InputFieldForString id="name" placeholder="Name" value={editedUser['name']} onChange={value => handleFieldChange('name', value as string)} />
            </div>
            <div>
              <Label htmlFor="email" className="text-white/70 pb-1 block">
                Email
              </Label>
              <InputFieldForEmail id="email" value={editedUser['email']} onChange={value => handleFieldChange('email', value as string)} />
            </div>
            <div>
              <Label htmlFor="emailVerified" className="text-white/70 pb-1 block">
                EmailVerified
              </Label>
              <BooleanInputField
                id="emailVerified"
                checked={editedUser['emailVerified']}
                onCheckedChange={checked => handleFieldChange('emailVerified', checked)}
              />
            </div>
          </div>
        </ScrollArea>

        <DialogFooter className="border-t border-white/10 pt-3">
          <Button
            variant="outlineDefault"
            onClick={() => {
              toggleEditModal(false);
              setSelectedUsers(null);
            }}
            size="sm"
          >
            Cancel
          </Button>
          <Button disabled={isLoading} onClick={handleEditUser} variant="outlineWater">
            {isLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditNextComponents;
