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
import { useDeleteRolesMutation } from '@/redux/features/roles/rolesSlice';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

import { useRolesStore } from '../store/store';
import { handleSuccess, handleError } from './utils';
import { IRoles, defaultRoles } from '../store/data/data';

const DeleteNextComponents: React.FC = () => {
  const { toggleDeleteModal, isDeleteModalOpen, selectedRoles, setSelectedRoles } = useRolesStore();

  const [deleteRole, { isLoading }] = useDeleteRolesMutation();

  const handleDelete = async () => {
    if (selectedRoles) {
      try {
        await deleteRole({
          id: selectedRoles._id,
        }).unwrap();
        toggleDeleteModal(false);
        handleSuccess('Delete Successful');
      } catch (error) {
        console.error('Failed to delete Role:', error);
        handleError('Failed to delete item. Please try again.');
      }
    }
  };

  const handleCancel = () => {
    toggleDeleteModal(false);
    setSelectedRoles({ ...defaultRoles } as IRoles);
  };

  const displayName = selectedRoles?.['name'] || '';

  return (
    <Dialog open={isDeleteModalOpen} onOpenChange={toggleDeleteModal}>
      <DialogContent className="sm:max-w-md rounded-sm border border-white/50 bg-white/10 backdrop-blur-2xl shadow-xl text-white">
        <DialogHeader>
          <DialogTitle className="bg-clip-text text-transparent bg-linear-to-r from-white to-red-200 font-bold">Confirm Deletion</DialogTitle>
        </DialogHeader>

        {selectedRoles && (
          <p className="text-white/80 py-3 text-sm leading-relaxed">
            Are you sure you want to delete this role:&nbsp;
            <strong className="text-white font-semibold">{displayName}</strong>? This action cannot be undone.
          </p>
        )}

        <DialogFooter className="gap-2 pt-2">
          <Button variant="outlineWater" size="sm" onClick={handleCancel} className="rounded-sm border-white/30 text-white/80 hover:bg-white/20">
            Cancel
          </Button>
          <Button variant="outlineFire" size="sm" disabled={isLoading} onClick={handleDelete} className="rounded-sm">
            {isLoading ? 'Deleting…' : 'Delete'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteNextComponents;
