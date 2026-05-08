/*
|-----------------------------------------
| setting up Add for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

import { useState } from 'react';

import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAddUsersMutation } from '@/redux/features/user/userSlice';
import InputFieldForEmail from '@/components/dashboard-ui/InputFieldForEmail';
import InputFieldForString from '@/components/dashboard-ui/InputFieldForString';
import { BooleanInputField } from '@/components/dashboard-ui/BooleanInputField';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

import { useUsersStore } from '../store/store';
import { IUsers, defaultUsers } from '../store/data/data';
import { formatDuplicateKeyError, handleError, handleSuccess, isApiErrorResponse } from './utils';

const AddNextComponents: React.FC = () => {
  const { toggleAddModal, isAddModalOpen, setUsers } = useUsersStore();
  const [addUsers, { isLoading }] = useAddUsersMutation();
  const [newUser, setNewUser] = useState<IUsers>(defaultUsers);

  const handleFieldChange = (name: string, value: unknown) => {
    setNewUser(prev => ({ ...prev, [name]: value }));
  };

  const handleAddUser = async () => {
    try {
      const updateData = { ...newUser };
      delete updateData._id;
      const addedUser = await addUsers(updateData).unwrap();
      setUsers([addedUser]);
      toggleAddModal(false);
      setNewUser(defaultUsers);
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

  return (
    <Dialog open={isAddModalOpen} onOpenChange={toggleAddModal}>
      <DialogContent className="mt-[30px] sm:max-w-[825px] bg-white/10 backdrop-blur-xl border border-white/20 shadow-xl rounded-2xl text-white transition-all duration-300">
        <DialogHeader className="border-b border-white/10 pb-3">
          <DialogTitle className="text-lg font-semibold tracking-wide text-white/90">Add New User</DialogTitle>
        </DialogHeader>

        <ScrollArea className="h-[500px] w-full rounded-md border border-white/10 p-4 bg-white/5 backdrop-blur-md shadow-inner">
          <div className="grid gap-6 py-4">
            <div>
              <Label htmlFor="name" className="text-white/70 pb-1 block">
                Name
              </Label>
              <InputFieldForString id="name" placeholder="Name" value={newUser['name']} onChange={value => handleFieldChange('name', value as string)} />
            </div>
            <div>
              <Label htmlFor="email" className="text-white/70 pb-1 block">
                Email
              </Label>
              <InputFieldForEmail id="email" value={newUser['email']} onChange={value => handleFieldChange('email', value as string)} />
            </div>
            <div>
              <Label htmlFor="emailVerified" className="text-white/70 pb-1 block">
                EmailVerified
              </Label>
              <BooleanInputField
                id="emailVerified"
                checked={newUser['emailVerified']}
                onCheckedChange={checked => handleFieldChange('emailVerified', checked)}
              />
            </div>
          </div>
        </ScrollArea>

        <DialogFooter className="border-t border-white/10 pt-3">
          <Button variant="outlineDefault" onClick={() => toggleAddModal(false)}>
            Cancel
          </Button>
          <Button disabled={isLoading} onClick={handleAddUser} variant="outlineWater">
            {isLoading ? 'Adding...' : 'Add User'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddNextComponents;
