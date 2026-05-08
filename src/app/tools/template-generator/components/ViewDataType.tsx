/*
|-----------------------------------------
| setting up ViewDataType for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

'use client';

import { useState } from 'react';
import { toast } from 'react-toastify';

import InputFieldForString from './ui-components/InputFieldForString';
import InputFieldForEmail from './ui-components/InputFieldForEmail';
import InputFieldForPassword from './ui-components/InputFieldForPassword';
import InputFieldForPasscode from './ui-components/InputFieldForPasscode';
import { SelectField } from './ui-components/SelectField';
import DynamicSelectField from './ui-components/DynamicSelectField';
import NumberInputFieldInteger from './ui-components/NumberInputFieldInteger';
import NumberInputFieldFloat from './ui-components/NumberInputFieldFloat';
import { CheckboxField } from './ui-components/CheckboxField';
import { BooleanInputField } from './ui-components/BooleanInputField';
import { DateField } from './ui-components/DateField';
import TimeField from './ui-components/TimeField';
import DateRangePickerField from './ui-components/DateRangePickerField';
import TimeRangePickerField from './ui-components/TimeRangePickerField';
import ColorPickerField from './ui-components/ColorPickerField';
import PhoneInputField from './ui-components/PhoneInputField';
import UrlInputField from './ui-components/UrlInputField';
import TextareaFieldForDescription from './ui-components/TextareaFieldForDescription';
import AutocompleteField from './ui-components/AutocompleteField';
import { RadioButtonGroupField } from './ui-components/RadioButtonGroupField';
import MultiCheckboxGroupField from './ui-components/MultiCheckboxGroupField';
import RichTextEditorField from './ui-components/RichTextEditorField';
import ImageUploadManager from './ui-components/ImageUploadManager';
import MULTIOPTIONSField from './ui-components/MULTIOPTIONSField';
import StringArrayField from './ui-components/StringArrayField';
import JsonValueField from './ui-components/JsonValue';

import { AutocompleteFieldCoreCode } from './core-code/AutocompleteFieldCoreCode';
import { InputFieldForStringCoreCode } from './core-code/InputFieldForStringCoreCode';
import { MultiCheckboxGroupFieldCoreCode } from './core-code/MultiCheckboxGroupFieldCoreCode';
import { CheckboxFieldCoreCode } from './core-code/CheckboxFieldCoreCode';
import { RadioButtonGroupFieldCoreCode } from './core-code/RadioButtonGroupFieldCoreCode';
import { UrlInputFieldCoreCode } from './core-code/UrlInputFieldCoreCode';
import { PhoneInputFieldCoreCode } from './core-code/PhoneInputFieldCoreCode';
import { ColorPickerFieldCoreCode } from './core-code/ColorPickerFieldCoreCode';
import { TimeRangePickerFieldCoreCode } from './core-code/TimeRangePickerFieldCoreCode';
import { DateRangePickerFieldCoreCode } from './core-code/DateRangePickerFieldCoreCode';
import { DateFieldCoreCode } from './core-code/DateFieldCoreCode';
import { BooleanInputFieldCoreCode } from './core-code/BooleanInputFieldCoreCode';
import { NumberInputFieldFloatCoreCode } from './core-code/NumberInputFieldFloatCoreCode';
import { NumberInputFieldIntegerCoreCode } from './core-code/NumberInputFieldIntegerCoreCode';
import { TextareaFieldForDescriptionCoreCode } from './core-code/TextareaFieldForDescriptionCoreCode';
import { DynamicSelectFieldCoreCode } from './core-code/DynamicSelectFieldCoreCode';
import { SelectFieldCoreCode } from './core-code/SelectFieldCoreCode';
import { InputFieldForPasscodeCoreCode } from './core-code/InputFieldForPasscodeCoreCode';
import { InputFieldForPasswordCoreCode } from './core-code/InputFieldForPasswordCoreCode';
import { InputFieldForEmailCoreCode } from './core-code/InputFieldForEmailCoreCode';
import { TimeFieldCoreCode } from './core-code/TimeFieldCoreCode';
import { RichTextEditorFieldCoreCode } from './core-code/RichTextEditorFieldCoreCode';
import { ImageUploadFieldSingleCoreCode } from './core-code/ImageUploadFieldSingleCoreCode';
import ImageUploadFieldSingle from './ui-components/ImageUploadFieldSingle';
import { ImageUploadManagerCoreCode } from './core-code/ImageUploadManagerCoreCode';
import { MULTIOPTIONSFieldCoreCode } from './core-code/MULTIOPTIONSFieldCoreCode';
import { StringArrayFieldcoreCode } from './core-code/StringArrayFieldCoreCode';
import { JsonValueCoreCode } from './core-code/JsonValueCoreCode';
import { Button } from '@/components/ui/button';
import { Copy } from 'lucide-react';
interface DataTypeItem {
  name: string;
  mongooseSchema: string;
  ui: string;
  coreCode?: string;
}

export const allDataType: DataTypeItem[] = [
  {
    name: 'STRING',
    mongooseSchema: `STRING: {
            type: String,
        }`,
    ui: '<InputFieldForString />',
    coreCode: InputFieldForStringCoreCode,
  },
  {
    name: 'EMAIL',
    mongooseSchema: `EMAIL: {
            type: String,
            ,
            lowercase: true,
            match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
        }`,
    ui: '<InputFieldForEmail />',
    coreCode: InputFieldForEmailCoreCode,
  },
  {
    name: 'PASSWORD',
    mongooseSchema: `PASSWORD: {
            type: String,
            select: false
        }`,
    ui: '<InputFieldForPassword />',
    coreCode: InputFieldForPasswordCoreCode,
  },
  {
    name: 'PASSCODE',
    mongooseSchema: `PASSCODE: {
            type: String,
            select: false
        }`,
    ui: '<InputFieldForPasscode />',
    coreCode: InputFieldForPasscodeCoreCode,
  },
  {
    name: 'SELECT',
    mongooseSchema: `SELECT: {
            type: String,
            enum: ['Option 1', 'Option 2', 'Option 3', 'Option 4', 'Option 5']
        }`,
    ui: '<SelectField />',
    coreCode: SelectFieldCoreCode,
  },
  {
    name: 'DYNAMICSELECT',
    mongooseSchema: `DYNAMICSELECT: [{
            type: String
    }]`,
    ui: '<DynamicSelectField />',
    coreCode: DynamicSelectFieldCoreCode,
  },
  {
    name: 'IMAGES',
    mongooseSchema: `IMAGES: [{
            type: String
        }]`,
    ui: '<ImageUploadManager />',
    coreCode: ImageUploadManagerCoreCode,
  },
  {
    name: 'IMAGE ',
    mongooseSchema: `IMAGE: {
            type: String
        }`,
    ui: '<ImageUploadFieldSingle />',
    coreCode: ImageUploadFieldSingleCoreCode,
  },
  {
    name: 'DESCRIPTION',
    mongooseSchema: `DESCRIPTION: {
            type: String,
            
        }`,
    ui: '<TextareaFieldForDescription />',
    coreCode: TextareaFieldForDescriptionCoreCode,
  },
  {
    name: 'INTNUMBER',
    mongooseSchema: `INTNUMBER: {
            type: Number,
            validate: {
                validator: Number.isInteger,
                message: '{VALUE} is not an integer value'
            }
        }`,
    ui: '<NumberInputFieldInteger />',
    coreCode: NumberInputFieldIntegerCoreCode,
  },
  {
    name: 'FLOATNUMBER',
    mongooseSchema: `FLOATNUMBER: {
            type: Number
        }`,
    ui: '<NumberInputFieldFloat />',
    coreCode: NumberInputFieldFloatCoreCode,
  },
  {
    name: 'BOOLEAN',
    mongooseSchema: `BOOLEAN: {
            type: Boolean,
            default: false
        }`,
    ui: '<BooleanInputField />',
    coreCode: BooleanInputFieldCoreCode,
  },
  {
    name: 'DATE ',
    mongooseSchema: `DATE: {
            type: Date,
            default: Date.now
        }`,
    ui: '<DateField />',
    coreCode: DateFieldCoreCode,
  },
  {
    name: 'TIME',
    mongooseSchema: `TIME: {
            type: String
        }`,
    ui: '<TimeField />',
    coreCode: TimeFieldCoreCode,
  },
  {
    name: 'DATERANGE',
    mongooseSchema: `DATERANGE: {
            start: { type: Date },
            end: { type: Date }
        }`,
    ui: '<DateRangePickerField />',
    coreCode: DateRangePickerFieldCoreCode,
  },
  {
    name: 'TIMERANGE',
    mongooseSchema: `TIMERANGE: {
            start: { type: String },
            end: { type: String }
        }`,
    ui: '<TimeRangePickerField />',
    coreCode: TimeRangePickerFieldCoreCode,
  },
  {
    name: 'COLORPICKER',
    mongooseSchema: `COLORPICKER: {
            type: String,
            match: [/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Please fill a valid color hex code']
        }`,
    ui: '<ColorPickerField />',
    coreCode: ColorPickerFieldCoreCode,
  },
  {
    name: 'PHONE',
    mongooseSchema: `PHONE: {
            type: String,
            validate: {
                validator: function(v) {
                return /\\d{3}-\\d{3}-\\d{4}/.test(v);
                },
                message: props => \`\${props.value} is not a valid phone number!\`
            }
        }`,
    ui: '<PhoneInputField />',
    coreCode: PhoneInputFieldCoreCode,
  },
  {
    name: 'URL',
    mongooseSchema: `URL: {
            type: String,
            
        }`,
    ui: '<UrlInputField />',
    coreCode: UrlInputFieldCoreCode,
  },
  {
    name: 'RICHTEXT',
    mongooseSchema: `RICHTEXT: {
            type: String
        }`,
    ui: '<RichTextEditorField />',
    coreCode: RichTextEditorFieldCoreCode,
  },
  {
    name: 'AUTOCOMPLETE',
    mongooseSchema: `AUTOCOMPLETE: {
            type: String
        }`,
    ui: '<AutocompleteField />',
    coreCode: AutocompleteFieldCoreCode,
  },
  {
    name: 'RADIOBUTTON',
    mongooseSchema: `RADIOBUTTON: {
            type: String,
            enum: ['Choice A', 'Choice B', 'Choice C']
        }`,
    ui: '<RadioButtonGroupField />',
    coreCode: RadioButtonGroupFieldCoreCode,
  },
  {
    name: 'CHECKBOX',
    mongooseSchema: `CHECKBOX: {
            type: Boolean,
            default: false
        }`,
    ui: '<CheckboxField />',
    coreCode: CheckboxFieldCoreCode,
  },
  {
    name: 'MULTICHECKBOX',
    mongooseSchema: `MULTICHECKBOX: [{
            type: String
        }]`,
    ui: '<MultiCheckboxGroupField />',
    coreCode: MultiCheckboxGroupFieldCoreCode,
  },
  {
    name: 'MULTIOPTIONS',
    mongooseSchema: `MULTIOPTIONS: [{
            type: String
        }]`,
    ui: '<MULTIOPTIONSField />',
    coreCode: MULTIOPTIONSFieldCoreCode,
  },
  {
    name: 'STRINGARRAY',
    mongooseSchema: `STRINGARRAY: [{
            id:{
                type: String
            },
            title:{
                type: String
            },
            quantity:{
                type: String
            },
        }]`,
    ui: '<StringArrayField />',
    coreCode: StringArrayFieldcoreCode,
  },
  {
    name: 'JsonValueField',
    mongooseSchema: ` {
      "id": "1234",
      "title": " The Name of Country",
      "parent": {
        "id": "111234",
        "title": " The Name of Parent",
        "child": {
          "id": "1234",
          "title": " The Name of Child",
          "child": "",
          "note": "The Note"
        },
        "note": "The Note"
      },
      "note": "The Note"
    }`,
    ui: '<JsonValueField />',
    coreCode: JsonValueCoreCode,
  },
];
const ViewDataType = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showPreviewDialog, setShowPreviewDialog] = useState(false);
  const [currentPreviewItem, setCurrentPreviewItem] = useState<DataTypeItem | null>(null);
  const [activeTab, setActiveTab] = useState('both');

  const copyToClipboard = (data: string, type: 'schema' | 'ui' | 'name' | 'corecode' | ' code') => {
    navigator.clipboard
      .writeText(data)
      .then(() => {
        if (type === 'name') {
          toast.success(`Copied "${data}" to clipboard!`);
        } else if (type === 'corecode') {
          toast.success(`Copied "Core Code" to clipboard!`);
        } else if (type === 'schema') {
          toast.success(`Copied "Mongoose Schema" to clipboard!`);
        } else if (type === 'ui') {
          toast.success(`Copied "UI Component" to clipboard!`);
        } else {
          toast.success(`Copied Code - "${data}" to clipboard!`);
        }
      })
      .catch(err => {
        console.error('Failed to copy: ', err);
        toast.error('Failed to copy to clipboard.');
      });
  };

  const getComponentForPreview = (item: DataTypeItem): React.ReactNode => {
    switch (item.ui) {
      case '<InputFieldForString />':
        return <InputFieldForString />;
      case '<InputFieldForEmail />':
        return <InputFieldForEmail />;
      case '<InputFieldForPassword />':
        return <InputFieldForPassword />;
      case '<InputFieldForPasscode />':
        return <InputFieldForPasscode />;
      case '<SelectField />':
        return <SelectField />;
      case '<DynamicSelectField />':
        return <DynamicSelectField />;
      case '<ImageUploadManager />':
        return <ImageUploadManager />;
      case '<ImageUploadFieldSingle />':
        return <ImageUploadFieldSingle />;
      case '<TextareaFieldForDescription />':
        return <TextareaFieldForDescription />;
      case '<NumberInputFieldInteger />':
        return <NumberInputFieldInteger />;
      case '<NumberInputFieldFloat />':
        return <NumberInputFieldFloat />;
      case '<CheckboxField />':
        return <CheckboxField />;
      case '<BooleanInputField />':
        return <BooleanInputField />;
      case '<DateField />':
        return <DateField />;
      case '<TimeField />':
        return <TimeField />;
      case '<DateRangePickerField />':
        return <DateRangePickerField />;
      case '<TimeRangePickerField />':
        return <TimeRangePickerField />;
      case '<ColorPickerField />':
        return <ColorPickerField />;
      case '<PhoneInputField />':
        return <PhoneInputField />;
      case '<UrlInputField />':
        return <UrlInputField />;
      case '<RichTextEditorField />':
        return <RichTextEditorField />;
      case '<AutocompleteField />':
        return <AutocompleteField />;
      case '<RadioButtonGroupField />':
        return <RadioButtonGroupField />;
      case '<MultiCheckboxGroupField />':
        return <MultiCheckboxGroupField />;
      case '<MULTIOPTIONSField />':
        return <MULTIOPTIONSField />;
      case '<StringArrayField />':
        return <StringArrayField />;
      case '<JsonValueField />':
        return <JsonValueField />;
      default:
        return <p className="text-muted-foreground">No preview available for {item.name}</p>;
    }
  };

  const handleViewDetails = (item: DataTypeItem) => {
    setCurrentPreviewItem(item);
    setShowPreviewDialog(true);
  };

  return (
    <div className="  bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800 rounded-lg">
      <Button onClick={() => setIsDialogOpen(true)} variant="outlineGlassy">
        <span className="relative flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 7v10c0 2.21 1.79 4 4 4h8c2.21 0 4-1.79 4-4V7M4 7c0-2.21 1.79-4 4-4h8c2.21 0 4 1.79 4 4M4 7h16"
            />
          </svg>
          DataType Library
        </span>
      </Button>

      {isDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pt-0">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsDialogOpen(false)} />
          <div className="relative w-full max-w-2xl max-h-[85vh] bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl flex flex-col">
            <div className="flex items-center justify-between p-2 py-6 border-b border-white/10">
              <h2 className="text-2xl font-bold bg-linear-to-r pl-2 from-blue-400 to-purple-400 bg-clip-text text-transparent">Data Types Overview</h2>
              <Button onClick={() => setIsDialogOpen(false)} className="min-w-[6px] bg-transparent">
                <svg className="w-5 h-5 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </Button>
            </div>

            <div className="p-2 max-h-[60vh] overflow-y-auto">
              <div className="space-y-1">
                {allDataType.map((curr, index) => (
                  <div
                    key={curr.name}
                    className="group relative overflow-hidden rounded-xl bg-linear-to-r from-white/5 to-white/10 backdrop-blur-sm border border-white/10 p-1 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:border-white/20"
                  >
                    <div className="absolute inset-0 bg-linear-to-r from-blue-500/10 to-purple-500/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 flex items-center justify-center text-sm font-bold text-white">{index + 1}</div>
                        <Copy className="h-4 w-4 text-white" onClick={() => copyToClipboard(curr.name, 'name')} />
                        <span className="font-semibold text-lg text-white">{curr.name}</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Button onClick={() => handleViewDetails(curr)} variant="outlineWater" size="sm">
                          View Details
                        </Button>
                        {curr.coreCode && (
                          <Button onClick={() => copyToClipboard(curr.coreCode || '', 'corecode')} variant="outlineWater" size="sm">
                            Copy Code
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {showPreviewDialog && currentPreviewItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowPreviewDialog(false)} />
          <div className="relative w-full max-w-6xl max-h-[90vh] bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <h2 className="text-2xl font-bold text-white">
                Details: <span className="bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">{currentPreviewItem.name}</span>
              </h2>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => copyToClipboard(currentPreviewItem.mongooseSchema, 'schema')}
                  className="px-4 py-2 rounded-lg bg-linear-to-r from-blue-500/20 to-blue-600/20 border border-blue-400/20 text-blue-300 text-sm font-medium transition-all duration-300 hover:scale-105"
                >
                  Copy Schema
                </button>
                <button
                  onClick={() => copyToClipboard(currentPreviewItem.ui, 'ui')}
                  className="px-4 py-2 rounded-lg bg-linear-to-r from-emerald-500/20 to-emerald-600/20 border border-emerald-400/20 text-emerald-300 text-sm font-medium transition-all duration-300 hover:scale-105"
                >
                  Copy UI
                </button>
                <button onClick={() => setShowPreviewDialog(false)} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                  <svg className="w-5 h-5 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="px-6 pt-4">
              <div className="flex space-x-1 bg-white/5 backdrop-blur-sm rounded-xl p-1">
                {[
                  { id: 'both', label: 'Both' },
                  { id: 'schema', label: 'Schema Only' },
                  { id: 'ui', label: 'UI Only' },
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-300 ${
                      activeTab === tab.id
                        ? 'bg-linear-to-r from-blue-500/30 to-purple-500/30 text-white shadow-lg'
                        : 'text-white/60 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="p-6 max-h-[60vh] overflow-y-auto">
              {activeTab === 'both' && (
                <div className="space-y-6">
                  <div className="space-y-3">
                    <div className="w-full flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                        <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7v10c0 2.21 1.79 4 4 4h8c2.21 0 4-1.79 4-4V7" />
                          </svg>
                        </div>
                        Mongoose Schema
                      </h3>
                      <button
                        onClick={() => copyToClipboard(currentPreviewItem.mongooseSchema || '', 'schema')}
                        className=" px-3 py-1 bg-white/10 hover:bg-white/20 text-white text-xs rounded-lg transition-all duration-200 flex items-center gap-2 backdrop-blur-sm"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                          />
                        </svg>
                      </button>
                    </div>
                    <div className="relative rounded-xl bg-gradient-to-br from-slate-900/50 to-slate-800/50 backdrop-blur-sm border border-white/10">
                      <pre className="p-4 text-sm text-emerald-300 font-mono overflow-x-auto">
                        <code>{currentPreviewItem.mongooseSchema}</code>
                      </pre>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="w-full flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                        <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                            />
                          </svg>
                        </div>
                        UI Component
                      </h3>
                      <button
                        onClick={() => copyToClipboard(currentPreviewItem.ui || '', 'ui')}
                        className=" px-3 py-1 bg-white/10 hover:bg-white/20 text-white text-xs rounded-lg transition-all duration-200 flex items-center gap-2 backdrop-blur-sm"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                          />
                        </svg>
                      </button>
                    </div>

                    <div className="p-6 rounded-xl bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm border border-white/10 min-h-[120px] flex items-center justify-center">
                      {getComponentForPreview(currentPreviewItem)}
                    </div>

                    {currentPreviewItem.coreCode && (
                      <div className="relative rounded-xl bg-gradient-to-br from-slate-900/80 to-slate-800/80 backdrop-blur-sm border border-white/10">
                        <div className="absolute top-3 right-3">
                          <button
                            onClick={() => copyToClipboard(currentPreviewItem.coreCode || '', 'corecode')}
                            className="px-3 py-1 bg-white/10 hover:bg-white/20 text-white text-xs rounded-lg transition-all duration-200 flex items-center gap-2 backdrop-blur-sm"
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                              />
                            </svg>
                            Copy
                          </button>
                        </div>
                        <pre className="p-4 pt-12 text-sm text-emerald-300 font-mono overflow-x-auto">
                          <code>{currentPreviewItem.coreCode}</code>
                        </pre>
                      </div>
                    )}

                    <div className="relative rounded-xl bg-gradient-to-br from-slate-900/50 to-slate-800/50 backdrop-blur-sm border border-white/10">
                      <div className="absolute top-3 right-3">
                        <button
                          onClick={() => copyToClipboard(currentPreviewItem.ui, 'ui')}
                          className="px-3 py-1 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-400/30 text-purple-300 text-xs rounded-lg transition-all duration-200 flex items-center gap-2 backdrop-blur-sm"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                            />
                          </svg>
                          Copy
                        </button>
                      </div>
                      <pre className="p-4 pr-20 text-sm text-blue-300 font-mono">
                        <code>{currentPreviewItem.ui}</code>
                      </pre>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'schema' && (
                <div className="space-y-3">
                  <div className="w-full flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7v10c0 2.21 1.79 4 4 4h8c2.21 0 4-1.79 4-4V7" />
                        </svg>
                      </div>
                      Mongoose Schema
                    </h3>
                    <button
                      onClick={() => copyToClipboard(currentPreviewItem.mongooseSchema || '', 'schema')}
                      className=" px-3 py-1 bg-white/10 hover:bg-white/20 text-white text-xs rounded-lg transition-all duration-200 flex items-center gap-2 backdrop-blur-sm"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                        />
                      </svg>
                    </button>
                  </div>
                  <div className="relative rounded-xl bg-gradient-to-br from-slate-900/80 to-slate-800/80 backdrop-blur-sm border border-white/10">
                    <pre className="p-6 text-sm text-emerald-300 font-mono overflow-x-auto">
                      <code>{currentPreviewItem.mongooseSchema}</code>
                    </pre>
                  </div>
                </div>
              )}

              {activeTab === 'ui' && (
                <div className="space-y-6">
                  <div className="w-full flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                      UI Component
                    </h3>
                    <button
                      onClick={() => copyToClipboard(currentPreviewItem.ui || '', 'ui')}
                      className=" px-3 py-1 bg-white/10 hover:bg-white/20 text-white text-xs rounded-lg transition-all duration-200 flex items-center gap-2 backdrop-blur-sm"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                        />
                      </svg>
                    </button>
                  </div>

                  <div className="p-8 rounded-xl bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm border border-white/10 min-h-[200px] flex items-center justify-center">
                    {getComponentForPreview(currentPreviewItem)}
                  </div>

                  <div className="relative rounded-xl bg-gradient-to-br from-slate-900/50 to-slate-800/50 backdrop-blur-sm border border-white/10">
                    <pre className="p-4 text-sm text-blue-300 font-mono">
                      <code>{currentPreviewItem.ui}</code>
                    </pre>
                    <div className="absolute top-4 right-4">
                      <button
                        onClick={() => copyToClipboard(currentPreviewItem.ui || '', 'ui')}
                        className=" px-3 py-1 bg-white/10 hover:bg-white/20 text-white text-xs rounded-lg transition-all duration-200 flex items-center gap-2 backdrop-blur-sm"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {currentPreviewItem.coreCode && (
                    <div className="relative rounded-xl bg-gradient-to-br from-slate-900/80 to-slate-800/80 backdrop-blur-sm border border-white/10">
                      <div className="absolute top-3 right-3">
                        <button
                          onClick={() => copyToClipboard(currentPreviewItem.coreCode || '', 'corecode')}
                          className="px-3 py-1 bg-white/10 hover:bg-white/20 text-white text-xs rounded-lg transition-all duration-200 flex items-center gap-2 backdrop-blur-sm"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                            />
                          </svg>
                          Copy
                        </button>
                      </div>
                      <pre className="p-4 pt-12 text-sm text-emerald-300 font-mono overflow-x-auto">
                        <code>{currentPreviewItem.coreCode}</code>
                      </pre>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewDataType;
