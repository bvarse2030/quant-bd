/*
|-----------------------------------------
| setting up JsonEditor for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

'use client';

import Link from 'next/link';
import { v4 as uuidv4 } from 'uuid';
import React, { useState } from 'react';

import {
  AlertDialog,
  AlertDialogTitle,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogTrigger,
  AlertDialogDescription,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';

import JsonEditorSingleItem from './JsonEditorSingleItem';
import ViewDataType, { allDataType } from './ViewDataType';
import { useJsonStore, JsonTemplateItem } from '../store/jsonStore';

export type JsonSchema = {
  [key: string]: string | JsonSchema;
};

export interface NamingConvention {
  [key: string]: string | boolean | string[];
  use_generate_folder: boolean;
  bulk_action: string[];
}

export interface JsonTemplate {
  uid: string;
  templateName: string;
  schema: JsonSchema;
  namingConvention: NamingConvention;
}

const SuccessPopup = ({ isVisible, message }: { isVisible: boolean; message: string }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed top-[65px] right-4 z-50 animate-in slide-in-from-top-2 duration-300">
      <div className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg border border-green-400 flex items-center gap-2">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
        </svg>
        <span className="font-medium">{message}</span>
      </div>
    </div>
  );
};

const initialJsonTemplate: JsonTemplate = {
  uid: '000',
  templateName: 'Basic Template',
  schema: {
    title: 'STRING',
    email: 'EMAIL',
    'author-email': 'EMAIL#readonly',
    password: 'PASSWORD',
    passcode: 'PASSCODE',
    area: 'SELECT#Bangladesh, India, Pakistan, Canada',
    'sub-area': 'DYNAMICSELECT',
    'products-images': 'IMAGES',
    'personal-image': 'IMAGE',
    description: 'DESCRIPTION',
    age: 'INTNUMBER',
    amount: 'FLOATNUMBER',
    isActive: 'BOOLEAN',
    'start-date': 'DATE',
    'start-time': 'TIME',
    'schedule-date': 'DATERANGE',
    'schedule-time': 'TIMERANGE',
    'favorite-color': 'COLORPICKER',
    number: 'PHONE',
    profile: 'URL',
    test: 'RICHTEXT',
    info: 'AUTOCOMPLETE',
    shift: 'RADIOBUTTON#OP 1, OP 2, OP 3, OP 4',
    policy: 'CHECKBOX',
    hobbies: 'MULTICHECKBOX',
    ideas: 'MULTIOPTIONS#O 1, O 2, O 3, O 4',
    students: 'STRINGARRAY#Name, Class, Roll',
    complexValue: {
      id: 'STRING',
      title: 'STRING',
      parent: {
        id: 'STRING',
        title: 'STRING',
        child: {
          id: 'STRING',
          title: 'STRING',
          child: 'STRING',
          note: 'STRING',
        },
        note: 'STRING',
      },
      note: 'STRING',
    },
  },
  namingConvention: {
    Users_1_000___: 'Posts',
    users_2_000___: 'posts',
    User_3_000___: 'Post',
    user_4_000___: 'post',

    use_generate_folder: false,
    bulk_action: ['title', 'area'],
  },
};

const JsonEditor: React.FC = () => {
  const [pathButton, setPathButton] = useState<string>('');
  const [jsonInput, setJsonInput] = useState<string>(JSON.stringify(initialJsonTemplate, null, 2));
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  const { items, addItem, removeItem, clearItems, updateItem } = useJsonStore();

  const showSuccess = (message: string) => {
    setSuccessMessage(message);
    setShowSuccessPopup(true);
    setTimeout(() => setShowSuccessPopup(false), 1000);
  };

  const handleSave = async () => {
    setError('');
    setIsLoading(true);

    try {
      const parsedJson: JsonTemplate = JSON.parse(jsonInput);

      const schema = parsedJson.schema;
      if (!schema || typeof schema !== 'object') {
        setError('Validation Error: The JSON must include a "schema" object.');
        setIsLoading(false);
        return;
      }

      const validDataTypes = new Set(allDataType.map(item => item.name.trim()));

      const validateSchemaTypes = (currentSchema: JsonSchema, path: string = ''): { isValid: boolean; error?: string } => {
        for (const key in currentSchema) {
          if (Object.prototype.hasOwnProperty.call(currentSchema, key)) {
            const value = currentSchema[key];
            const currentPath = path ? `${path}.${key}` : key;

            if (typeof value === 'object' && value !== null) {
              const result = validateSchemaTypes(value as JsonSchema, currentPath);
              if (!result.isValid) {
                return result;
              }
            } else if (typeof value === 'string') {
              const baseType = value.split('#')[0];
              if (!validDataTypes.has(baseType)) {
                return {
                  isValid: false,
                  error: `Validation Error: The type "${baseType}" for field "${currentPath}" is invalid. Please ensure the base type is a valid, case-sensitive name from the DataType Library.`,
                };
              }
            }
          }
        }
        return { isValid: true };
      };

      const schemaValidationResult = validateSchemaTypes(schema);

      if (!schemaValidationResult.isValid) {
        setError(schemaValidationResult.error!);
        setIsLoading(false);
        return;
      }

      if (parsedJson.uid === '000' || !parsedJson.uid) {
        parsedJson.uid = uuidv4();
      }

      const existingItem = items.find(
        (i): i is JsonTemplateItem => typeof i.data === 'object' && i.data !== null && 'uid' in i.data && (i.data as JsonTemplate).uid === parsedJson.uid,
      );

      if (existingItem) {
        updateItem(existingItem.id, parsedJson);
        setJsonInput(JSON.stringify(parsedJson, null, 2));
        showSuccess('JSON updated successfully!');
      } else {
        addItem(parsedJson);
        setJsonInput('');
        showSuccess('JSON saved successfully!');
      }
    } catch (err: unknown) {
      setError(`Invalid JSON format. Please check your syntax. ${(err as Error).message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setJsonInput(e.target.value);
    if (error) setError('');
  };

  const handleFormat = (): string | null => {
    try {
      const parsedJson: JsonTemplate = JSON.parse(jsonInput);
      const formattedJson = JSON.stringify(parsedJson, null, 2);
      setJsonInput(formattedJson);
      showSuccess('JSON formatted successfully!');
      return formattedJson;
    } catch (error) {
      setError('Invalid JSON input: ' + (error as Error).message);
      return null;
    }
  };

  const handleGenerate = async () => {
    setError('');
    setIsGenerating(true);

    const formattedJson = handleFormat();

    if (formattedJson === null) {
      setIsGenerating(false);
      return;
    }

    try {
      const response = await fetch('/tools/template-generator/api/template', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data: formattedJson }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      showSuccess('Template generated successfully!');

      const parsedJson: JsonTemplate = JSON.parse(formattedJson);
      if (parsedJson.namingConvention.use_generate_folder) {
        setPathButton(`/generate/${parsedJson.namingConvention.users_2_000___ as string}`);
      } else {
        setPathButton(`/dashboard/${parsedJson.namingConvention.users_2_000___ as string}`);
      }
    } catch (error) {
      setError('Failed to fetch: ' + (error as Error).message);
    } finally {
      setIsGenerating(false);
    }
  };

  const customBtn =
    "inline-flex items-center justify-center whitespace-nowrap text-sm font-medium disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive cursor-pointer min-w-[80px] border-1 border-green-400 shadow-xl bg-green-300/40 hover:bg-green-400 transition-all duration-300 text-green-50 hover:text-white h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5";
  return (
    <>
      <SuccessPopup isVisible={showSuccessPopup} message={successMessage} />

      <div className="w-full mx-auto p-4 md:p-6">
        {pathButton && (
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link href={`${pathButton}/personal`} target="_blank" className={customBtn}>
              Personal
            </Link>
            <Link href={`${pathButton}/admin`} target="_blank" className={customBtn}>
              Admin
            </Link>

            <Link href={`${pathButton}/ssr-view`} target="_blank" className={customBtn}>
              SSR
            </Link>

            <Link href={`${pathButton}/client-view`} target="_blank" className={customBtn}>
              CSR
            </Link>
          </div>
        )}

        <div
          className="mt-6 rounded-xl p-6 border border-white/20 bg-white/10
                backdrop-blur-xl shadow-lg transition-all duration-300"
        >
          <div className="flex justify-between items-center mb-4">
            <h2
              className="text-2xl font-bold bg-clip-text text-transparent 
                        bg-linear-to-r from-white to-blue-100 drop-shadow-md"
            >
              JSON Editor
            </h2>
            <ViewDataType />
          </div>

          <label className="text-gray-200 text-sm font-medium mb-2 block">JSON Input</label>

          <div className="relative">
            <textarea
              value={jsonInput}
              onChange={handleInputChange}
              className="w-full h-[500px] p-4 rounded-lg resize-vertical font-mono text-sm
                        bg-white/5 text-blue-50 backdrop-blur-xl
                        border border-white/10 focus:ring-2 ring-blue-400"
              placeholder="Enter your JSON..."
            />
          </div>

          {error && (
            <div
              className="mt-4 p-3 rounded-lg text-red-300
                        border border-red-400/30 bg-red-500/20 backdrop-blur-xl"
            >
              {error}
            </div>
          )}

          <div className="flex flex-wrap gap-3 mt-6">
            <Button onClick={handleSave} disabled={isLoading} variant="outlineGlassy" size="sm" className="border-1 border-slate-50/50 shadow-xl">
              {isLoading ? 'Saving...' : 'Save'}
            </Button>

            <Button onClick={handleFormat} variant="outlineGlassy" size="sm" className="border-1 border-slate-50/50 shadow-xl">
              Format
            </Button>

            <Button onClick={handleGenerate} disabled={isGenerating} variant="outlineGlassy" size="sm" className="border-1 border-slate-50/50 shadow-xl">
              {isGenerating ? 'Generating...' : 'Generate'}
            </Button>
          </div>
        </div>

        <div
          className="mt-8 rounded-xl p-6 border border-white/20 bg-white/10
                backdrop-blur-xl shadow-lg transition-all duration-300"
        >
          <div className="flex justify-between items-center mb-6">
            <h3
              className="text-lg font-semibold bg-clip-text text-transparent
                        bg-linear-to-r from-white to-blue-200 drop-shadow-md"
            >
              Saved Items ({items.length})
            </h3>

            {items.length > 0 && (
              <AlertDialog>
                <AlertDialogTrigger className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive cursor-pointer min-w-[80px] border-1 border-rose-400 shadow-xl bg-rose-300/40 hover:bg-rose-400 transition-all duration-300 hover:text-rose-50 h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5 text-rose-50">
                  Clear All
                </AlertDialogTrigger>
                <AlertDialogContent
                  className="p-5 rounded-xl border border-white/20 bg-white/10
                                backdrop-blur-xl"
                >
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-white">Confirm Delete?</AlertDialogTitle>
                    <AlertDialogDescription className="text-gray-200">This will delete all saved templates.</AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="text-black">Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={clearItems}
                      className="px-4 py-2 text-sm rounded-lg text-white bg-red-600/60 hover:bg-red-700/80 transition-all"
                    >
                      Confirm
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>

          {items.length === 0 ? (
            <p className="text-center text-gray-200 py-10">No items saved yet</p>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto pr-2 z-30">
              {items.map(item => (
                <JsonEditorSingleItem key={item.id} item={item} removeItem={removeItem} setJsonInput={setJsonInput} />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default JsonEditor;
