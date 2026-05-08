/*
|-----------------------------------------
| setting up ExportDialog for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

'use client';

import * as XLSX from 'xlsx';

import React, { useState, useEffect } from 'react';

import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';

import { IVerifications, defaultVerifications } from '../store/data/data';

type HeaderItem = { key: string; label: string };

interface ExportDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  headers: HeaderItem[];
  data: IVerifications[];
  fileName: string;
}

const downloadFile = (data: IVerifications[], fileName: string) => {
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet(data);
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');
  XLSX.writeFile(workbook, fileName);
};

const ExportDialog: React.FC<ExportDialogProps> = ({ isOpen, onOpenChange, headers, data, fileName }) => {
  const [selectedColumns, setSelectedColumns] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (isOpen) {
      const allSelected = headers.reduce(
        (acc, header) => {
          acc[header.key] = true;
          return acc;
        },
        {} as Record<string, boolean>,
      );
      setSelectedColumns(allSelected);
    }
  }, [isOpen, headers]);

  const handleCheckedChange = (key: string, isChecked: boolean) => {
    const currentlyCheckedCount = Object.values(selectedColumns).filter(Boolean).length;
    if (currentlyCheckedCount === 1 && !isChecked) return;

    setSelectedColumns(prev => ({
      ...prev,
      [key]: isChecked,
    }));
  };

  const handleExport = () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const processedData = data.map(row => {
      const newRow: IVerifications = { ...defaultVerifications };
      return newRow;
    });

    downloadFile(processedData, fileName);
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] rounded-xl border border-white/20 bg-white/10 text-white backdrop-blur-2xl shadow-xl transition-all">
        <DialogHeader>
          <DialogTitle className="bg-clip-text bg-linear-to-r from-white to-blue-200 text-white">Customize Your Export</DialogTitle>
          <DialogDescription className="text-white/70">Select the columns you want to include in your XLSX file.</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4 max-h-60 overflow-y-auto pr-2 backdrop-blur-md p-2">
          {headers.map(header => (
            <div key={header.key} className="flex items-center space-x-2">
              <Checkbox
                id={`col-${header.key}`}
                checked={!!selectedColumns[header.key]}
                onCheckedChange={checked => handleCheckedChange(header.key, !!checked)}
                className="border-white/30 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-400"
              />
              <Label htmlFor={`col-${header.key}`} className="font-normal text-white/90">
                {header.label}
              </Label>
            </div>
          ))}
        </div>

        <DialogFooter className="gap-2">
          <Button onClick={() => onOpenChange(false)} variant="outlineWater" size="sm">
            Cancel
          </Button>
          <Button onClick={handleExport} variant="outlineWater" size="sm">
            Export Data
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ExportDialog;
