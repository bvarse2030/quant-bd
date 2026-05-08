/*
|-----------------------------------------
| setting up GeneratePersonalBulkUpdate for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

export const generatePersonalBulkUpdateComponentFile = (inputJsonFile: string): string => {
  const config = JSON.parse(inputJsonFile) || {};
  const { schema, namingConvention, isPersonal } = config;

  const pluralPascalCase = namingConvention.Users_1_000___;
  const pluralLowerCase = namingConvention.users_2_000___;
  const singularPascalCase = namingConvention.User_3_000___;
  const interfaceName = `I${pluralPascalCase}`;
  const isUsedGenerateFolder = namingConvention.use_generate_folder;

  const componentName = isPersonal ? `PersonalBulkUpdate${pluralPascalCase}` : `BulkUpdate${pluralPascalCase}`;
  const dialogTitle = isPersonal ? `Confirm Personal Bulk Update` : `Confirm Bulk Update`;

  const mutationHookName = isPersonal ? `useBulkUpdatePersonal${pluralPascalCase}Mutation` : `useBulkUpdate${pluralPascalCase}Mutation`;

  const reduxPath = isPersonal
    ? `@/redux/features/${pluralLowerCase}/personal${pluralPascalCase}Slice`
    : isUsedGenerateFolder
      ? `../redux/rtk-api`
      : `@/redux/features/${pluralLowerCase}/${pluralLowerCase}Slice`;

  const payloadLogic = isPersonal
    ? `const newBulkData = bulkData.map(({ _id, ...rest }) => ({
        id: _id,
        'author-email': rest['author-email'],
        updateData: rest,
      }))`
    : `const newBulkData = bulkData.map(({ _id, ...rest }) => ({
        id: _id,
        updateData: rest,
      }))`;

  const schemaKeys = Object.keys(schema || {});
  const displayKey =
    schemaKeys.find(key => key.toLowerCase() === 'name') ||
    schemaKeys.find(key => key.toLowerCase() === 'title') ||
    schemaKeys.find(key => schema[key] === 'STRING') ||
    '_id';

  const editableField = Object.entries(schema || {}).find(
    ([, value]) => typeof value === 'string' && ['SELECT', 'RADIOBUTTON'].includes(value.split('#')[0].toUpperCase()),
  );
  const editableFieldKey = editableField ? editableField[0] : 'role';
  const editableFieldLabel = editableFieldKey.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

  return `'use client'

import React from 'react'

import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'

import { ${interfaceName} } from '../store/data/data'
import { use${pluralPascalCase}Store } from '../store/store'
import { ${pluralLowerCase}SelectorArr } from '../store/store-constant'
import { ${mutationHookName} } from '${reduxPath}'
import { handleSuccess, handleError } from './utils'

const ${componentName}: React.FC = () => {
  const {
    toggleBulkUpdateModal,
    isBulkUpdateModalOpen,
    bulkData,
    setBulkData,
  } = use${pluralPascalCase}Store()

  const [bulkUpdate${pluralPascalCase}, { isLoading }] =
    ${mutationHookName}()

  const handleBulkUpdate = async () => {
    if (!bulkData.length) return
    try {
      ${payloadLogic}
      await bulkUpdate${pluralPascalCase}(newBulkData).unwrap()
      toggleBulkUpdateModal(false)
      setBulkData([])
      handleSuccess('Update Successful')
    } catch (error) {
      console.error('Failed to edit ${pluralLowerCase}:', error)
      handleError('Failed to update items. Please try again.')
    }
  }

  const handleFieldChangeForAll = (value: string) => {
    setBulkData(
      bulkData.map(${singularPascalCase.toLowerCase()} => ({
        ...${singularPascalCase.toLowerCase()},
        ['${editableFieldKey}']: value,
      })) as ${interfaceName}[]
    )
  }

  return (
    <Dialog open={isBulkUpdateModalOpen} onOpenChange={toggleBulkUpdateModal}>
      <DialogContent className="sm:max-w-lg rounded-xl border border-white/20 bg-white/10 backdrop-blur-2xl shadow-xl transition-all text-white">
        <DialogHeader>
          <DialogTitle className="bg-clip-text bg-linear-to-r from-white to-blue-200 text-white">
            ${dialogTitle}
          </DialogTitle>
        </DialogHeader>

        {bulkData.length > 0 && (
          <div className="space-y-3">
            <p className="pt-2 text-white/80">
              You are about to update{' '}
              <span className="font-semibold text-white">
                ({bulkData.length})
              </span>{' '}
              ${pluralLowerCase}.
            </p>

            <div className="flex items-center justify-between rounded-lg p-3 bg-white/5 border border-white/10 backdrop-blur-md">
              <p className="text-white/90">
                Set all <span className="font-semibold text-blue-300">${editableFieldLabel}</span> to
              </p>

              <Select
                onValueChange={value => handleFieldChangeForAll(value)}
                defaultValue={(${pluralLowerCase}SelectorArr[0] as string) || ''}
              >
                <SelectTrigger className="w-[180px] border-white/20 bg-white/10 text-white backdrop-blur-md">
                  <SelectValue placeholder="Select value" />
                </SelectTrigger>
                <SelectContent className="border-white/20 bg-white/10 backdrop-blur-xl text-white">
                  {${pluralLowerCase}SelectorArr?.map((option, index) => (
                    <SelectItem
                      key={option + index}
                      value={option}
                      className="cursor-pointer hover:bg-white/20 text-white"
                    >
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {/* List Preview */}
        <ScrollArea className="h-[300px] w-full rounded-xl border border-white/10 bg-white/5 backdrop-blur-md p-4 mt-3">
          <div className="flex flex-col gap-2">
            {bulkData.map((item, idx) => (
              <div
                key={(item._id as string) || idx}
                className="flex justify-between items-center text-white/90 rounded-md p-2 bg-white/5 border border-white/10"
              >
                <span>{idx + 1}. {item['${displayKey}'] as string || ''}</span>
                <span className="text-blue-300">{item['${displayKey}'] as string}</span>
              </div>
            ))}
          </div>
        </ScrollArea>

        <DialogFooter className="gap-2 mt-4">
          <Button
            variant="outlineWater"
            className="text-white hover:text-white"
            onClick={() => toggleBulkUpdateModal(false)}
          >
            Cancel
          </Button>
          <Button
            disabled={isLoading}
            onClick={handleBulkUpdate}
            className="px-6 py-2 bg-green-600/80 hover:bg-green-600 border border-green-400 text-white hover:shadow-md backdrop-blur-xl"
          >
            {isLoading ? 'Updating...' : 'Update Selected'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default ${componentName}
`;
};
