/*
|-----------------------------------------
| setting up BulkDelete for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Trash2, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useBulkDeleteAccessManagementsMutation } from '@/redux/features/accessManagements/accessManagementsSlice';

import { handleSuccess, handleError } from './utils';
import { useAccessManagementsStore } from '../store/store';

const BulkDeleteNextComponents: React.FC = () => {
  const { isBulkDeleteModalOpen, toggleBulkDeleteModal, bulkData, setBulkData } = useAccessManagementsStore();

  const [bulkDeleteAccessManagements, { isLoading }] = useBulkDeleteAccessManagementsMutation();

  const handleBulkDelete = async () => {
    if (!bulkData?.length) return;
    try {
      const ids = bulkData.map(item => item._id);
      await bulkDeleteAccessManagements({ ids }).unwrap();
      toggleBulkDeleteModal(false);
      setBulkData([]);
      handleSuccess('Delete Successful');
    } catch (error) {
      console.error('Failed to delete AccessManagements:', error);
      handleError('Failed to delete items. Please try again.');
    }
  };

  return (
    <Dialog open={isBulkDeleteModalOpen} onOpenChange={toggleBulkDeleteModal}>
      <DialogContent className="sm:max-w-2xl rounded-sm border border-white/20 bg-white/2 backdrop-blur-2xl shadow-2xl text-white overflow-hidden p-0 mt-8">
        <div className="absolute inset-0 pointer-events-none" />

        <DialogHeader className="p-6 pb-2">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-red-500/20 border border-red-500/30">
              <AlertTriangle className="w-5 h-5 text-red-400" />
            </div>
            <DialogTitle className="text-2xl font-bold text-white bg-clip-text bg-gradient-to-r from-white via-white to-red-200">Confirm Deletion</DialogTitle>
          </div>
        </DialogHeader>

        <div className="px-6 space-y-4 relative z-10">
          {bulkData?.length > 0 && (
            <motion.p initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="text-white/70 text-sm leading-relaxed">
              You are about to permanently delete&nbsp;
              <span className="font-bold text-red-400 underline underline-offset-4 decoration-red-400/30">({bulkData.length})</span>
              &nbsp;access management records. This action cannot be undone.
            </motion.p>
          )}

          <ScrollArea className="h-[380px] w-full rounded-sm border border-white/50 bg-white/5 backdrop-blur-md shadow-inner">
            <div className="flex flex-col gap-1">
              <AnimatePresence mode="popLayout">
                {bulkData.map((item, idx) => (
                  <motion.div
                    key={(item._id as string) + idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.03 }}
                    className="group flex items-center gap-3 p-2 rounded-sm hover:bg-white/5 transition-colors border border-transparent hover:border-white/10 border-b border-b-white/50"
                  >
                    <span className="flex-shrink-0 w-8 h-8 rounded-sm bg-white/10 flex items-center justify-center text-sm font-mono text-white/40 group-hover:text-white/80 transition-colors">
                      {idx + 1}
                    </span>
                    <div className="w-full flex flex-col">
                      <span className="text-lg font-medium text-white/90 truncate">{String(item['user_name'] || 'Unnamed User')}</span>
                      <span className="text-sm font-medium text-white/70 truncate">{String(item['user_email'] || 'Unnamed Email')}</span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </ScrollArea>
        </div>

        <DialogFooter className="p-4 gap-2 bg-white/5 border-t border-white/10 sm:justify-end">
          <Button variant="outlineWater" size="sm" onClick={() => toggleBulkDeleteModal(false)}>
            <X className="w-4 h-4 opacity-70" />
            Cancel
          </Button>
          <Button variant="outlineFire" size="sm" disabled={isLoading} onClick={handleBulkDelete}>
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Deleting...</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Trash2 className="w-4 h-4" />
                <span>Delete Selected</span>
              </div>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BulkDeleteNextComponents;
