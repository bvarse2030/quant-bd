/*
|-----------------------------------------
| setting up GenerateDelete for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

export const generateDeleteComponentFile = (inputJsonFile: string): string => {
  const { schema, namingConvention } = JSON.parse(inputJsonFile);

  const pluralPascalCase = namingConvention.Users_1_000___;
  const pluralLowerCase = pluralPascalCase.toLowerCase();
  const singularPascalCase = namingConvention.User_3_000___;
  const interfaceName = `I${pluralPascalCase}`;

  const isUsedGenerateFolder = namingConvention.use_generate_folder;
  const reduxPath = isUsedGenerateFolder ? `../redux/rtk-api` : `@/redux/features/${pluralLowerCase}/${pluralLowerCase}Slice`;

  const schemaKeys = Object.keys(schema || {});
  const displayKey =
    schemaKeys.find(k => k.toLowerCase() === 'name') ||
    schemaKeys.find(k => k.toLowerCase() === 'title') ||
    schemaKeys.find(k => schema[k] === 'STRING') ||
    '_id';

  return `'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

import { ${interfaceName}, default${pluralPascalCase} } from '../store/data/data';
import { use${pluralPascalCase}Store } from '../store/store';
import { useDelete${pluralPascalCase}Mutation } from '${reduxPath}';
import { handleSuccess, handleError } from './utils';

const DeleteNextComponents: React.FC = () => {
  const {
    toggleDeleteModal,
    isDeleteModalOpen,
    selected${pluralPascalCase},
    setSelected${pluralPascalCase},
  } = use${pluralPascalCase}Store();

  const [delete${singularPascalCase}, { isLoading }] =
    useDelete${pluralPascalCase}Mutation();

  const handleDelete = async () => {
    if (!selected${pluralPascalCase}) return;

    try {
      await delete${singularPascalCase}({ id: selected${pluralPascalCase}._id }).unwrap();
      handleSuccess('Delete Successful');
      toggleDeleteModal(false);
      setSelected${pluralPascalCase}(default${pluralPascalCase} as ${interfaceName});
    } catch (error) {
      console.error('Failed to delete ${singularPascalCase}:', error);
      handleError('Failed to delete item. Please try again.');
    }
  };

  const handleCancel = () => {
    toggleDeleteModal(false);
    setSelected${pluralPascalCase}(default${pluralPascalCase} as ${interfaceName});
  };

  const displayName = selected${pluralPascalCase}?.['${displayKey}'] || 'this item';

  return (
    <Dialog open={isDeleteModalOpen} onOpenChange={toggleDeleteModal}>
      <DialogContent className="sm:max-w-md rounded-xl border border-white/20 bg-white/10 backdrop-blur-2xl shadow-xl text-white">
        <DialogHeader>
          <DialogTitle className="bg-clip-text text-transparent bg-linear-to-r from-white to-red-200">
            Confirm Deletion
          </DialogTitle>
        </DialogHeader>

        <p className="text-white/80 py-3">
          Are you sure you want to delete:&nbsp;
          <strong className="text-white">{displayName}</strong> ?
        </p>

        <DialogFooter className="gap-2">
          <Button variant="outlineWater" size="sm" onClick={handleCancel}>
            Cancel
          </Button>
          <Button
            variant="outlineFire"
            size="sm"
            disabled={isLoading}
            onClick={handleDelete}
          >
            {isLoading ? 'Deleting…' : 'Delete'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteNextComponents;`;
};
