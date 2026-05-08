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
import { DateField } from '@/components/dashboard-ui/DateField';
import InputFieldForString from '@/components/dashboard-ui/InputFieldForString';
import { useAddAccountsMutation } from '@/redux/features/accounts/accountsSlice';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

import { useAccountsStore } from '../store/store';
import { IAccounts, defaultAccounts } from '../store/data/data';
import { formatDuplicateKeyError, handleError, handleSuccess, isApiErrorResponse } from './utils';

const AddNextComponents: React.FC = () => {
  const { toggleAddModal, isAddModalOpen, setAccounts } = useAccountsStore();
  const [addAccounts, { isLoading }] = useAddAccountsMutation();
  const [newAccount, setNewAccount] = useState<IAccounts>(defaultAccounts);

  const handleFieldChange = (name: string, value: unknown) => {
    setNewAccount(prev => ({ ...prev, [name]: value }));
  };

  const handleAddAccount = async () => {
    try {
      const updateData = { ...newAccount };
      delete updateData._id;

      const addedAccount = await addAccounts(updateData).unwrap();
      setAccounts([addedAccount]);
      toggleAddModal(false);
      setNewAccount(defaultAccounts);
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
              Add New Account
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
                  value={newAccount['accountId']}
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
                  value={newAccount['providerId']}
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
                  value={newAccount['userId']}
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
                  value={newAccount['accessToken']}
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
                  value={newAccount['idToken']}
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
                  value={newAccount['accessTokenExpiresAt']}
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
                  value={newAccount['scope']}
                  onChange={value => handleFieldChange('scope', value as string)}
                />
              </div>
            </div>
          </div>
        </ScrollArea>

        <DialogFooter className="p-6 pt-4 gap-3">
          <Button variant="outlineWater" onClick={() => toggleAddModal(false)} size="sm">
            Cancel
          </Button>
          <Button disabled={isLoading} onClick={handleAddAccount} variant="outlineGarden" size="sm">
            {isLoading ? 'Adding...' : 'Add Account'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddNextComponents;
