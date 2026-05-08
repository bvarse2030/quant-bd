/*
|-----------------------------------------
| setting up Delete for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

'use client';

import React from 'react';

import { Button } from '@/components/ui/button';
import { useDeleteAccountsMutation } from '@/redux/features/accounts/accountsSlice';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

import { useAccountsStore } from '../store/store';
import { handleSuccess, handleError } from './utils';
import { IAccounts, defaultAccounts } from '../store/data/data';

const DeleteNextComponents: React.FC = () => {
  const { toggleDeleteModal, isDeleteModalOpen, selectedAccounts, setSelectedAccounts } = useAccountsStore();

  const [deleteAccount, { isLoading }] = useDeleteAccountsMutation();

  const handleDelete = async () => {
    if (!selectedAccounts) return;

    try {
      await deleteAccount({ id: selectedAccounts._id }).unwrap();
      handleSuccess('Delete Successful');
      toggleDeleteModal(false);
      setSelectedAccounts(defaultAccounts as IAccounts);
    } catch (error) {
      console.error('Failed to delete Account:', error);
      handleError('Failed to delete item. Please try again.');
    }
  };

  const handleCancel = () => {
    toggleDeleteModal(false);
    setSelectedAccounts(defaultAccounts as IAccounts);
  };

  const displayName = selectedAccounts?.['accountId'] || 'this item';

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

export default DeleteNextComponents;
