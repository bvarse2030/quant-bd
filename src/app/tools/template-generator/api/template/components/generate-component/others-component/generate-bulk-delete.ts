/*
|-----------------------------------------
| setting up GenerateBulkDelete for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

export const generateBulkDeleteComponentFile = (inputJsonFile: string): string => {
  const { schema, namingConvention } = JSON.parse(inputJsonFile) || {};

  const pluralPascalCase = namingConvention.Users_1_000___;
  const pluralLowerCase = namingConvention.users_2_000___;
  const isUsedGenerateFolder = namingConvention.use_generate_folder;

  const schemaKeys = Object.keys(schema || {});
  const displayKey =
    schemaKeys.find(k => k.toLowerCase() === 'name') ||
    schemaKeys.find(k => k.toLowerCase() === 'title') ||
    schemaKeys.find(k => schema[k] === 'STRING') ||
    '_id';

  const reduxPath = isUsedGenerateFolder ? `../redux/rtk-api` : `@/redux/features/${pluralLowerCase}/${pluralLowerCase}Slice`;

  return `'use client';

import React from 'react';

import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

import { use${pluralPascalCase}Store } from '../store/store';
import { useBulkDelete${pluralPascalCase}Mutation } from '${reduxPath}';
import { handleSuccess, handleError } from './utils';

const BulkDeleteNextComponents: React.FC = () => {
  const {
    isBulkDeleteModalOpen,
    toggleBulkDeleteModal,
    bulkData,
    setBulkData,
  } = use${pluralPascalCase}Store();

  const [bulkDelete${pluralPascalCase}, { isLoading }] =
    useBulkDelete${pluralPascalCase}Mutation();

  const handleBulkDelete = async () => {
    if (!bulkData?.length) return;
    try {
      const ids = bulkData.map((item) => item._id);
      await bulkDelete${pluralPascalCase}({ ids }).unwrap();

      toggleBulkDeleteModal(false);
      setBulkData([]);
      handleSuccess('Delete Successful');
    } catch (error) {
      console.error('Failed to delete ${pluralLowerCase}:', error);
      handleError('Failed to delete items. Please try again.');
    }
  };

  return (
    <Dialog open={isBulkDeleteModalOpen} onOpenChange={toggleBulkDeleteModal}>
      <DialogContent
        className="sm:max-w-md rounded-xl border border-white/20 bg-white/10 backdrop-blur-2xl shadow-xl text-white"
      >
        <DialogHeader>
          <DialogTitle className="text-white bg-clip-text bg-linear-to-r from-white to-red-200">
            Confirm Deletion
          </DialogTitle>
        </DialogHeader>

        {bulkData?.length > 0 && (
          <p className="text-white/80 mt-2">
            You are deleting&nbsp;
            <strong>({bulkData.length})</strong> ${pluralLowerCase}.
          </p>
        )}

        <ScrollArea className="h-[420px] w-full rounded-lg border border-white/20 bg-white/5 backdrop-blur-md p-4 mt-3">
          <div className="flex flex-col gap-2">
            {bulkData.map((item, idx) => (
              <span
                key={(item._id as string) + idx}
                className="text-sm text-white/90"
              >
                {idx + 1}. {String(item['${displayKey}'] || '')}
              </span>
            ))}
          </div>
        </ScrollArea>

        <DialogFooter className="gap-2 mt-3">
          <Button
            variant="outlineWater"
            size="sm"
            onClick={() => toggleBulkDeleteModal(false)}
          >
            Cancel
          </Button>
          <Button
            variant="outlineFire"
            size="sm"
            disabled={isLoading}
            onClick={handleBulkDelete}
          >
            {isLoading ? 'Deleting…' : 'Delete Selected'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BulkDeleteNextComponents;`;
};
