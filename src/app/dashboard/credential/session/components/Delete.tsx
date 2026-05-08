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
import { useDeleteSessionsMutation } from '@/redux/features/sessions/sessionsSlice';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

import { useSessionsStore } from '../store/store';
import { handleSuccess, handleError } from './utils';
import { ISessions, defaultSessions } from '../store/data/data';

const DeleteNextComponents: React.FC = () => {
  const { toggleDeleteModal, isDeleteModalOpen, selectedSessions, setSelectedSessions } = useSessionsStore();

  const [deleteSession, { isLoading }] = useDeleteSessionsMutation();

  const handleDelete = async () => {
    if (!selectedSessions) return;

    try {
      await deleteSession({ id: selectedSessions._id }).unwrap();
      handleSuccess('Delete Successful');
      toggleDeleteModal(false);
      setSelectedSessions(defaultSessions as ISessions);
    } catch (error) {
      console.error('Failed to delete Session:', error);
      handleError('Failed to delete item. Please try again.');
    }
  };

  const handleCancel = () => {
    toggleDeleteModal(false);
    setSelectedSessions(defaultSessions as ISessions);
  };

  const displayName = selectedSessions?.['token'] || 'this item';

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
