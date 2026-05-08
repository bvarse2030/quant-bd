/*
|-----------------------------------------
| setting up GeneratePersonalBulkDelete for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

interface Schema {
  [key: string]: string | Schema;
}

interface NamingConvention {
  Users_1_000___: string;
  users_2_000___: string;
  User_3_000___: string;
  user_4_000___: string;
  use_generate_folder: boolean;
}

interface InputConfig {
  uid: string;
  templateName: string;
  isPersonal?: boolean;
  schema: Schema;
  namingConvention: NamingConvention;
}

export const generatePersonalBulkDeleteComponentFile = (inputJsonFile: string): string => {
  const config: InputConfig = JSON.parse(inputJsonFile) || {};
  const { schema, namingConvention, isPersonal } = config;

  const pluralPascalCase = namingConvention.Users_1_000___;
  const pluralLowerCase = namingConvention.users_2_000___;
  const isUsedGenerateFolder = namingConvention.use_generate_folder;

  const componentName = isPersonal ? `PersonalBulkDeleteNextComponents` : `BulkDeleteNextComponents`;
  const dialogTitleText = isPersonal ? 'Confirm Personal Bulk Deletion' : 'Confirm Deletion';

  const mutationHookName = isPersonal ? `useBulkDeletePersonal${pluralPascalCase}Mutation` : `useBulkDelete${pluralPascalCase}Mutation`;

  const reduxPath = isPersonal
    ? `@/redux/features/${pluralLowerCase}/personal${pluralPascalCase}Slice`
    : isUsedGenerateFolder
      ? `../redux/rtk-api`
      : `@/redux/features/${pluralLowerCase}/${pluralLowerCase}Slice`;

  const authImport = isPersonal ? `import { useSession } from '@/lib/auth-client';` : '';

  const sessionLogic = isPersonal
    ? `
  const session = useSession();
  const author_email = session?.data?.user?.email;`
    : '';

  const validationLogic = isPersonal
    ? `if (!author_email) {
        handleError('User email not found');
        return;
    }
    `
    : '';

  const mutationPayload = isPersonal ? `{ ids, 'author-email': author_email }` : `{ ids }`;

  const schemaKeys = Object.keys(schema || {});
  const displayKey =
    schemaKeys.find(k => k.toLowerCase() === 'name') ||
    schemaKeys.find(k => k.toLowerCase() === 'title') ||
    schemaKeys.find(k => schema[k] === 'STRING') ||
    '_id';

  return `'use client';

import React from 'react';

import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

import { use${pluralPascalCase}Store } from '../store/store';
import { ${mutationHookName} } from '${reduxPath}';
import { handleSuccess, handleError } from './utils';
${authImport}

const ${componentName}: React.FC = () => {
  const {
    isBulkDeleteModalOpen,
    toggleBulkDeleteModal,
    bulkData,
    setBulkData,
  } = use${pluralPascalCase}Store();

  const [bulkDelete${pluralPascalCase}, { isLoading }] =
    ${mutationHookName}();
    ${sessionLogic}

  const handleBulkDelete = async () => {
    if (!bulkData?.length) return;
    ${validationLogic}
    try {
      const ids = bulkData.map((item) => item._id);
      await bulkDelete${pluralPascalCase}(${mutationPayload}).unwrap();

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
            ${dialogTitleText}
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

export default ${componentName};`;
};
