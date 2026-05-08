/*
|-----------------------------------------
| setting up FormField for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

'use client';

import Image from 'next/image';
import { toast } from 'react-toastify';
import { useState, useEffect, ChangeEvent } from 'react';
import { Trash2, FileText, CheckCircle, Files, Plus, UploadCloud } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import type { IForm7Data, IOtherDoc } from './data';
import { defaultDataForm7 } from './data';

export interface Form7Props {
  data?: IForm7Data;
  onSubmit: (values: IForm7Data) => void;
}

const FormFieldForm7 = ({ data, onSubmit }: Form7Props) => {
  const [formData, setFormData] = useState<IForm7Data>({ ...defaultDataForm7 });

  useEffect(() => {
    if (data) {
      setFormData({ ...data });
    }
  }, [data]);

  const updateField = (field: keyof IForm7Data, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const updateDocument = (key: keyof IForm7Data['documents'], value: string) => {
    setFormData(prev => ({
      ...prev,
      documents: {
        ...prev.documents,
        [key]: value,
      },
    }));
  };

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>, callback: (url: string, name: string) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    console.log('📂 File Selected:', file.name);
    console.log('🔗 Local Path:', url);

    callback(url, file.name);
    toast.success('File Attached');
  };

  const addNewSlot = () => {
    const newDoc: IOtherDoc = {
      id: Math.random().toString(36).substr(2, 9),
      name: '',
      path: '',
    };

    setFormData(prev => ({
      ...prev,
      documents: {
        ...prev.documents,
        others: [...prev.documents.others, newDoc],
      },
    }));
  };

  const updateOtherDoc = (id: string, field: 'name' | 'path', value: string) => {
    setFormData(prev => ({
      ...prev,
      documents: {
        ...prev.documents,
        others: prev.documents.others.map(doc => (doc.id === id ? { ...doc, [field]: value } : doc)),
      },
    }));
  };

  const removeOtherDocument = (id: string) => {
    setFormData(prev => ({
      ...prev,
      documents: {
        ...prev.documents,
        others: prev.documents.others.filter(doc => doc.id !== id),
      },
    }));
    toast.info('Removed');
  };

  const FileThumbnail = ({ url, name }: { url: string; name: string }) => {
    const isImage = url.match(/\.(jpeg|jpg|gif|png|webp|ico)$/i) || url.startsWith('blob:');

    return (
      <div className="flex items-center gap-3 w-full bg-slate-800/50 p-2 rounded-md border border-slate-700">
        <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-md border border-slate-600 bg-slate-900 flex items-center justify-center group">
          {isImage ? (
            <Image src={url} width={200} height={200} alt={name} className="h-full w-full object-cover" />
          ) : (
            <FileText className="h-5 w-5 text-blue-400" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-slate-200 truncate">{name || 'Untitled Document'}</p>
          <a href={url} target="_blank" rel="noreferrer" className="text-[10px] text-blue-400 hover:underline truncate block">
            {url}
          </a>
        </div>
      </div>
    );
  };

  const RenderUploadBlock = ({ label, docKey }: { label: string; docKey: keyof Omit<IForm7Data['documents'], 'others'> }) => {
    const currentUrl = formData.documents[docKey];

    return (
      <div className="p-4 border border-dashed border-slate-700 rounded-lg bg-slate-900/50 hover:bg-slate-900/80 transition-colors relative flex flex-col justify-center min-h-[110px]">
        <div className="flex justify-between items-center mb-3">
          <Label className="text-slate-300 font-medium">{label}</Label>
          {currentUrl && <CheckCircle className="h-4 w-4 text-emerald-500 animate-in zoom-in" />}
        </div>

        {currentUrl ? (
          <div className="flex items-center justify-between">
            <FileThumbnail url={currentUrl} name={label} />
            <Button
              variant="ghost"
              size="icon"
              className="h-4 w-4 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 min-w-1 ml-4"
              onClick={() => updateDocument(docKey, '')}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="relative">
            <input
              type="file"
              id={docKey}
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.webp"
              className="hidden"
              onChange={e => handleFileUpload(e, url => updateDocument(docKey, url))}
            />
            <label
              htmlFor={docKey}
              className="flex items-center justify-center gap-2 w-full h-10 px-4 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm cursor-pointer transition-all border border-slate-600 hover:border-slate-500"
            >
              <UploadCloud className="h-4 w-4" />
              <span>Select File</span>
            </label>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-8 p-2 text-white">
      <div className="space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-700 pb-2">
          <div className="h-1 w-1 rounded-full bg-blue-500" />
          <h3 className="font-semibold text-blue-400">Student Information</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label>Student Name</Label>
            <Input
              placeholder="Enter full name"
              value={formData.student_name}
              onChange={e => updateField('student_name', e.target.value)}
              className="bg-slate-800/50 border-slate-700 focus:border-blue-500 focus:ring-blue-500/20 transition-all"
            />
          </div>
          <div className="space-y-2">
            <Label>Mobile Number</Label>
            <Input
              placeholder="+880..."
              value={formData.mobile_number}
              onChange={e => updateField('mobile_number', e.target.value)}
              className="bg-slate-800/50 border-slate-700 focus:border-blue-500 focus:ring-blue-500/20 transition-all"
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-700 pb-2">
          <div className="h-1 w-1 rounded-full bg-purple-500" />
          <h3 className="font-semibold text-purple-400">Required Documents</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <RenderUploadBlock label="NID / Smart Card" docKey="nid" />
          <RenderUploadBlock label="Passport Copy" docKey="passport" />
          <RenderUploadBlock label="Passport Size Photo" docKey="images" />
          <RenderUploadBlock label="Birth Certificate" docKey="birth_certificate" />
          <RenderUploadBlock label="SSC / O-Level Certificate" docKey="ssc_certificate" />
          <RenderUploadBlock label="HSC / A-Level Certificate" docKey="hsc_certificate" />
        </div>
      </div>

      <div className="space-y-4">
        <div className="w-full flex items-center justify-between  border-b border-slate-700">
          <div className="flex items-center gap-2 pb-2">
            <div className="h-1 w-1 rounded-full bg-emerald-500" />
            <h3 className="font-semibold text-emerald-400">Additional Documents</h3>
            <div className="flex items-start gap-2 text-slate-500 justify-center">
              <Files className="h-3 w-3 mt-0.5" />
              <p className="text-[10px]">Upload multiple files. Supported: .pdf, .doc, .docx, .jpg, .png</p>
            </div>
          </div>
          <div className="pt-2">
            <Button onClick={addNewSlot} variant="outlineGlassy" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add File
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {formData.documents.others.map((doc, index) => (
            <div
              key={doc.id}
              className="flex flex-col gap-2 p-3 bg-slate-900/40 rounded-lg border border-slate-700 animate-in fade-in slide-in-from-left-2 h-full"
            >
              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-500 font-mono w-6">#{index + 1}</span>
                <Input
                  placeholder="Document Name (e.g. Awards)"
                  value={doc.name}
                  onChange={e => updateOtherDoc(doc.id, 'name', e.target.value)}
                  className="h-8 text-xs bg-slate-800 border-slate-600"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeOtherDocument(doc.id)}
                  className="h-6 w-6 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 min-w-[24px]"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex-1 flex flex-col justify-center">
                {doc.path ? (
                  <FileThumbnail url={doc.path} name={doc.name || 'Untitled'} />
                ) : (
                  <div className="relative w-full h-full">
                    <input
                      type="file"
                      id={`other-${doc.id}`}
                      className="hidden"
                      onChange={e => handleFileUpload(e, url => updateOtherDoc(doc.id, 'path', url))}
                    />
                    <label
                      htmlFor={`other-${doc.id}`}
                      className="flex items-center justify-center gap-2 w-full h-12 border-2 border-dashed border-slate-700 hover:border-emerald-500/50 hover:bg-emerald-500/5 rounded-md cursor-pointer transition-all text-slate-400 hover:text-emerald-400"
                    >
                      <Plus className="h-5 w-5" />
                      <span className="text-sm">Click to Upload Document</span>
                    </label>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <Button
        onClick={() => {
          onSubmit(formData);
          toast.success('Form Data Saved!');
        }}
        variant="outlineGlassy"
        className="w-full"
        size="sm"
      >
        {formData.submitButtonText}
      </Button>
    </div>
  );
};

export default FormFieldForm7;
