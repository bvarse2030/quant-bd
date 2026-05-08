/*
|-----------------------------------------
| setting up Delete for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

import React from 'react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useDeleteAccessManagementsMutation } from '@/redux/features/accessManagements/accessManagementsSlice';

import { handleSuccess, handleError } from './utils';
import { useAccessManagementsStore } from '../store/store';
import { IAccessManagements, defaultAccessManagements } from '../store/data/data';

const DeleteNextComponents: React.FC = () => {
  const { toggleDeleteModal, isDeleteModalOpen, selectedAccessManagements, setSelectedAccessManagements } = useAccessManagementsStore();

  const [deleteAccessManagement, { isLoading }] = useDeleteAccessManagementsMutation();

  const handleDelete = async () => {
    if (selectedAccessManagements) {
      try {
        await deleteAccessManagement({
          id: selectedAccessManagements._id,
        }).unwrap();
        toggleDeleteModal(false);
        handleSuccess('Delete Successful');
      } catch (error) {
        console.error('Failed to delete AccessManagement:', error);
        handleError('Failed to delete item. Please try again.');
      }
    }
  };

  const handleCancel = () => {
    toggleDeleteModal(false);
    setSelectedAccessManagements({ ...defaultAccessManagements } as IAccessManagements);
  };

  const displayName = selectedAccessManagements?.['user_name'] || '';

  return (
    <Dialog open={isDeleteModalOpen} onOpenChange={toggleDeleteModal}>
      <DialogContent className="sm:max-w-md rounded-sm border border-white/50 bg-white/10 backdrop-blur-2xl shadow-xl text-white">
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
