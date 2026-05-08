/*
|-----------------------------------------
| setting up GenerateView for the App
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
  schema: Schema;
  namingConvention: NamingConvention;
}

export const generateViewComponentFile = (inputJsonFile: string): string => {
  const { schema, namingConvention }: InputConfig = JSON.parse(inputJsonFile) || {};

  const pluralPascalCase = namingConvention.Users_1_000___;
  const pluralLowerCase = namingConvention.users_2_000___ || pluralPascalCase.toLowerCase();
  const singularLowerCase = namingConvention.user_4_000___;
  const interfaceName = `I${pluralPascalCase}`;
  const defaultInstanceName = `default${pluralPascalCase}`;
  const isUsedGenerateFolder = namingConvention.use_generate_folder;

  const reduxPath = isUsedGenerateFolder ? `../redux/rtk-api` : `@/redux/features/${pluralLowerCase}/${pluralLowerCase}Slice`;

  const generateDetailRowsJsx = (s: Schema): string =>
    Object.entries(s)
      .map(([key, type]) => {
        const label = key.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

        if (typeof type === 'object' && !Array.isArray(type)) {
          return `<DetailRowJson label="${label}" value={selected${pluralPascalCase}['${key}']} />`;
        }

        const [typeName] = (type as string).toUpperCase().split('#');

        if (typeName === 'IMAGE' || typeName === 'IMAGES') return '';

        if (['MULTICHECKBOX', 'MULTIOPTIONS', 'DYNAMICSELECT'].includes(typeName)) {
          return `<DetailRowArray label="${label}" values={selected${pluralPascalCase}['${key}']} />`;
        }

        if (typeName === 'STRINGARRAY') {
          return `<DetailRowJson label="${label}" value={selected${pluralPascalCase}['${key}']} />`;
        }

        if (typeName === 'BOOLEAN' || typeName === 'CHECKBOX') {
          return `<DetailRow label="${label}" value={formatBoolean(selected${pluralPascalCase}['${key}'])} />`;
        }

        if (typeName === 'DATE') {
          return `<DetailRow label="${label}" value={formatDate(selected${pluralPascalCase}['${key}'])} />`;
        }

        if (typeName === 'DATERANGE') {
          return `<DetailRow label="${label}" value={\`\${formatDate(selected${pluralPascalCase}['${key}']?.from)} - \${formatDate(selected${pluralPascalCase}['${key}']?.to)}\`} />`;
        }

        if (typeName === 'TIMERANGE') {
          return `<DetailRow label="${label}" value={\`\${selected${pluralPascalCase}['${key}']?.start || 'N/A'} - \${selected${pluralPascalCase}['${key}']?.end || 'N/A'}\`} />`;
        }

        if (typeName === 'COLORPICKER') {
          return `<DetailRow
              label="${label}"
              value={
                <div className="flex items-center gap-2">
                  <span>{selected${pluralPascalCase}['${key}']}</span>
                  <div className="w-5 h-5 rounded-full border border-white/20" style={{ backgroundColor: selected${pluralPascalCase}['${key}'] }} />
                </div>
              }
            />`;
        }

        return `<DetailRow label="${label}" value={selected${pluralPascalCase}['${key}']} />`;
      })
      .join('\n              ');

  const generateImageViewerJsx = (s: Schema): string =>
    Object.entries(s)
      .map(([key, type]) => {
        if (typeof type !== 'string') return '';
        const [typeName] = type.toUpperCase().split('#');
        const label = key.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

        if (typeName === 'IMAGE') {
          return `
          <div className="mt-6">
            <h3 className="text-white font-medium mb-2">${label}</h3>
            {selected${pluralPascalCase}['${key}'] ? (
              <div className="relative w-full h-48 rounded-lg overflow-hidden border border-white/20 bg-white/10 backdrop-blur-lg">
                <Image src={selected${pluralPascalCase}['${key}'].url} fill className="object-cover" alt="${label}" />
              </div>
            ) : (
              <p className="text-white/70 text-sm">No image.</p>
            )}
          </div>`;
        }

        if (typeName === 'IMAGES') {
          return `
          <div className="mt-6">
            <h3 className="text-white font-medium mb-2">${label}</h3>
            {Array.isArray(selected${pluralPascalCase}['${key}']) && selected${pluralPascalCase}['${key}'].length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {selected${pluralPascalCase}['${key}'].map((val: { url: string; name: string }, i: number) => (
                  <div key={i} className="relative h-32 rounded-lg overflow-hidden border border-white/20 bg-white/10 backdrop-blur-lg">
                    <Image src={val.url} fill className="object-cover" alt={val.name || \`${label} \${i + 1}\`} />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-white/70 text-sm">No images.</p>
            )}
          </div>`;
        }

        return '';
      })
      .join('\n');

  return `'use client';

import Image from 'next/image';
import React, { useEffect } from 'react';
import { format } from 'date-fns';

import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { StringArrayData } from './others-field-type/types';

import { formatDuplicateKeyError, isApiErrorResponse } from '@/components/common/utils';

import { ${interfaceName}, ${defaultInstanceName} } from '../store/data/data';
import { use${pluralPascalCase}Store } from '../store/store';
import { useGet${pluralPascalCase}ByIdQuery } from '${reduxPath}';

type Primitive = string | number | boolean | null | undefined;
type Arrayish = Array<string | number | boolean>;
type JSONLike =
  | string
  | number
  | boolean
  | null
  | undefined
  | Record<string, unknown>
  | StringArrayData[];

const ViewNextComponents: React.FC = () => {
  const { selected${pluralPascalCase}, isViewModalOpen, toggleViewModal, setSelected${pluralPascalCase} } = use${pluralPascalCase}Store();

  const { data: ${singularLowerCase}Data, refetch } = useGet${pluralPascalCase}ByIdQuery(
    selected${pluralPascalCase}?._id,
    { skip: !selected${pluralPascalCase}?._id }
  );

  useEffect(() => {
    if (selected${pluralPascalCase}?._id) refetch();
  }, [selected${pluralPascalCase}?._id, refetch]);

  useEffect(() => {
    if (${singularLowerCase}Data?.data) setSelected${pluralPascalCase}(${singularLowerCase}Data.data as ${interfaceName});
  }, [${singularLowerCase}Data, setSelected${pluralPascalCase}]);

  const formatDate = (d?: string | Date): string => {
    if (!d) return 'N/A';
    try {
      return format(new Date(d), 'MMM dd, yyyy');
    } catch (error: unknown) {
     // eslint-disable-next-line @typescript-eslint/no-unused-vars
      let errMessage: string = 'Invalid Date';
      if (isApiErrorResponse(error)) {
        errMessage = formatDuplicateKeyError(error.data.message) || 'API error';
      } else if (error instanceof Error) {
        errMessage = error.message;
      }
      
      return 'Invalid';
    }
  };

  const formatBoolean = (v?: boolean): string => (v ? 'Yes' : 'No');

  const DetailRow: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
    <div className="grid grid-cols-3 gap-2 py-2 border-b border-white/10">
      <span className="text-sm text-white/80">{label}</span>
      <span className="col-span-2 text-sm text-white">{(value ?? 'N/A') as Primitive}</span>
    </div>
  );

  const DetailRowArray: React.FC<{ label: string; values?: Arrayish | null }> = ({ label, values }) => (
    <DetailRow label={label} value={values?.join(', ') || 'N/A'} />
  );

  const DetailRowJson: React.FC<{ label: string; value?: JSONLike }> = ({ label, value }) => (
    <div className="py-2 border-b border-white/10">
      <div className="text-sm text-white/80">{label}</div>
      <pre className="text-[11px] text-white/90 bg-white/5 rounded-md p-2 mt-1 overflow-auto">{value ? JSON.stringify(value, null, 2) : 'N/A'}</pre>
    </div>
  );

  return (
    <Dialog open={isViewModalOpen} onOpenChange={toggleViewModal}>
      <DialogContent className="sm:max-w-2xl mt-8 rounded-xl bg-white/10 backdrop-blur-2xl border border-white/20 text-white">
        <DialogHeader>
          <DialogTitle className="bg-clip-text text-transparent bg-linear-to-r from-white to-blue-200">
            ${pluralPascalCase} Details
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[520px] rounded-lg border border-white/10 bg-white/5 backdrop-blur-xl p-4 mt-3">
          {selected${pluralPascalCase} && (
            <>
              ${generateDetailRowsJsx(schema)}
              <DetailRow label="Created At" value={formatDate(selected${pluralPascalCase}.createdAt)} />
              <DetailRow label="Updated At" value={formatDate(selected${pluralPascalCase}.updatedAt)} />
              ${generateImageViewerJsx(schema)}
            </>
          )}
        </ScrollArea>

        <DialogFooter className="gap-2">
          <Button
            variant="outlineWater"
            onClick={() => {
              toggleViewModal(false);
              setSelected${pluralPascalCase}(${defaultInstanceName} as ${interfaceName});
            }}
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ViewNextComponents;
`;
};
