/*
|-----------------------------------------
| setting up JsonEditorSingleItem for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

'use client';

import { useState } from 'react';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';

import { JsonTemplateItem } from '../store/jsonStore';

const JsonEditorSingleItem = ({
  item,
  removeItem,
  setJsonInput,
}: {
  item: JsonTemplateItem;
  setJsonInput: React.Dispatch<React.SetStateAction<string>>;
  removeItem: (id: string) => void;
}) => {
  const [collapsed, setCollapsed] = useState(true);
  const [isRemoving, setIsRemoving] = useState(false);

  const handleSetJson = (data: string) => {
    setJsonInput(data);
  };

  const handleRemove = () => {
    setIsRemoving(true);
    setTimeout(() => removeItem(item.id), 200);
  };

  const templateName =
    typeof item.data === 'object' && item.data !== null && 'templateName' in item.data
      ? (item.data as unknown as { templateName: string }).templateName
      : 'Untitled Template';

  return (
    <div
      className={`
      relative rounded-xl p-5 border border-white/20 bg-white/10 backdrop-blur-xl 
      shadow-lg hover:shadow-xl transition-all duration-300 
      ${isRemoving ? 'animate-out slide-out-to-right-2 fade-out duration-200' : 'animate-in slide-in-from-left-2 duration-300'}
      `}
    >
      <div className="flex justify-between items-start gap-4">
        <div className="flex flex-col flex-1 space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
            <span className="font-semibold text-white text-lg">{templateName}</span>
          </div>

          <span className="text-xs text-blue-100">Saved: {item.timestamp.toLocaleString()}</span>

          <div className="flex flex-wrap gap-2 pt-1">
            <span
              className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
            bg-blue-500/20 text-blue-100 border border-blue-300/20 backdrop-blur-xl"
            >
              Field Count: {Object.keys((item.data as unknown as { schema: Record<string, unknown> })?.schema || {}).length}
            </span>

            <span
              className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
            bg-green-500/20 text-green-100 border border-green-300/20 backdrop-blur-xl"
            >
              Size: {JSON.stringify(item.data).length} chars
            </span>

            {(item.data as unknown as { uid: string })?.uid && (
              <span
                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
              bg-purple-500/20 text-purple-100 border border-purple-300/20 backdrop-blur-xl"
              >
                ID: {(item.data as unknown as { uid: string }).uid}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <AlertDialog>
            <AlertDialogTrigger className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive cursor-pointer min-w-[80px] border-1 border-rose-400 shadow-xl bg-rose-300/40 hover:bg-rose-400 transition-all duration-300 hover:text-rose-50 h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5 text-rose-50">
              Remove
            </AlertDialogTrigger>
            <AlertDialogContent className="rounded-xl border border-white/20 bg-white/10 backdrop-blur-xl">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-white">Delete?</AlertDialogTitle>
                <AlertDialogDescription className="text-blue-100">
                  This action cannot be undone. It will permanently delete **{templateName}**.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="text-black border-none">Cancel</AlertDialogCancel>
                <AlertDialogAction className="px-4 py-2 text-xs rounded-lg text-white bg-red-600/70 hover:bg-red-700/80 transition-all" onClick={handleRemove}>
                  Confirm
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <Button onClick={() => setCollapsed(!collapsed)} variant="outlineWater">
            {collapsed ? 'View' : 'Hide'}
          </Button>

          <Button onClick={() => handleSetJson(JSON.stringify(item.data))} variant="outlineWater">
            Edit
          </Button>
        </div>
      </div>

      <div className={`transition-all duration-300 overflow-hidden ${collapsed ? 'max-h-0 opacity-0' : 'max-h-96 opacity-100 mt-4'}`}>
        <pre
          className="p-4 rounded-lg bg-black/40 border border-white/20 text-green-300 text-xs font-mono 
          overflow-x-auto backdrop-blur-lg shadow-inner"
        >
          {JSON.stringify(item.data, null, 2)}
        </pre>
      </div>
    </div>
  );
};

export default JsonEditorSingleItem;
