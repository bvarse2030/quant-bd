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
import { DateField } from '@/components/dashboard-ui/DateField';
import InputFieldForString from '@/components/dashboard-ui/InputFieldForString';
import { useUpdateAccountsMutation } from '@/redux/features/accounts/accountsSlice';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

import { useAccountsStore } from '../store/store';
import { IAccounts, defaultAccounts } from '../store/data/data';
import { formatDuplicateKeyError, handleError, handleSuccess, isApiErrorResponse } from './utils';

const EditNextComponents: React.FC = () => {
  const { toggleEditModal, isEditModalOpen, selectedAccounts, setSelectedAccounts } = useAccountsStore();

  const [updateAccounts, { isLoading }] = useUpdateAccountsMutation();
  const [editedAccount, setAccount] = useState<IAccounts>(defaultAccounts);

  useEffect(() => {
    if (selectedAccounts) {
      setAccount(selectedAccounts);
    }
  }, [selectedAccounts]);

  const handleFieldChange = (name: string, value: unknown) => {
    setAccount(prev => ({ ...prev, [name]: value }));
  };

  const handleEditAccount = async () => {
    if (!selectedAccounts) return;

    try {
      const updateData = { ...editedAccount };
      delete updateData._id;
      delete updateData.createdAt;
      delete updateData.updatedAt;

      await updateAccounts({
        id: selectedAccounts._id,
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
              Edit Account
            </DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4 px-6 text-white">
            <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4 pr-1">
              <Label htmlFor="accountId" className="text-right ">
                AccountId
              </Label>
              <div className="col-span-3">
                <InputFieldForString
                  className="text-white"
                  id="accountId"
                  placeholder="AccountId"
                  value={editedAccount['accountId']}
                  onChange={value => handleFieldChange('accountId', value as string)}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4 pr-1">
              <Label htmlFor="providerId" className="text-right ">
                ProviderId
              </Label>
              <div className="col-span-3">
                <InputFieldForString
                  className="text-white"
                  id="providerId"
                  placeholder="ProviderId"
                  value={editedAccount['providerId']}
                  onChange={value => handleFieldChange('providerId', value as string)}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4 pr-1">
              <Label htmlFor="userId" className="text-right ">
                UserId
              </Label>
              <div className="col-span-3">
                <InputFieldForString
                  className="text-white"
                  id="userId"
                  placeholder="UserId"
                  value={editedAccount['userId']}
                  onChange={value => handleFieldChange('userId', value as string)}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4 pr-1">
              <Label htmlFor="accessToken" className="text-right ">
                AccessToken
              </Label>
              <div className="col-span-3">
                <InputFieldForString
                  className="text-white"
                  id="accessToken"
                  placeholder="AccessToken"
                  value={editedAccount['accessToken']}
                  onChange={value => handleFieldChange('accessToken', value as string)}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4 pr-1">
              <Label htmlFor="idToken" className="text-right ">
                IdToken
              </Label>
              <div className="col-span-3">
                <InputFieldForString
                  className="text-white"
                  id="idToken"
                  placeholder="IdToken"
                  value={editedAccount['idToken']}
                  onChange={value => handleFieldChange('idToken', value as string)}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4 pr-1">
              <Label htmlFor="accessTokenExpiresAt" className="text-right ">
                AccessTokenExpiresAt
              </Label>
              <div className="col-span-3">
                <DateField
                  id="accessTokenExpiresAt"
                  value={editedAccount['accessTokenExpiresAt']}
                  onChange={date => handleFieldChange('accessTokenExpiresAt', date)}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4 pr-1">
              <Label htmlFor="scope" className="text-right ">
                Scope
              </Label>
              <div className="col-span-3">
                <InputFieldForString
                  className="text-white"
                  id="scope"
                  placeholder="Scope"
                  value={editedAccount['scope']}
                  onChange={value => handleFieldChange('scope', value as string)}
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
              setSelectedAccounts(null);
            }}
            size="sm"
          >
            Cancel
          </Button>
          <Button disabled={isLoading} onClick={handleEditAccount} variant="outlineGarden" size="sm">
            {isLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditNextComponents;
