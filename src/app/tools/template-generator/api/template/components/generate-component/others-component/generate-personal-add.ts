/*
|-----------------------------------------
| setting up GeneratePersonalAdd for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

interface Schema {
  [key: string]: string | Schema;
}

interface InputConfig {
  uid: string;
  templateName: string;
  isPersonal?: boolean; // Added flag
  schema: Schema;
  namingConvention: {
    Users_1_000___: string;
    users_2_000___: string;
    User_3_000___: string;
    user_4_000___: string;
    use_generate_folder: boolean;
  };
}

export const generatePersonalAddComponentFile = (inputJsonFile: string): string => {
  const config: InputConfig = JSON.parse(inputJsonFile) || {};
  const { schema, namingConvention, isPersonal } = config;

  const pluralPascalCase = namingConvention.Users_1_000___;  
  const singularPascalCase = namingConvention.User_3_000___; 
  const pluralLowerCase = namingConvention.users_2_000___;

  const componentName = isPersonal ? `PersonalAddNextComponents` : `AddNextComponents`;
  const dialogTitle = isPersonal ? `Add New Personal ${singularPascalCase}` : `Add New ${singularPascalCase}`;

  const reduxMutationHook = isPersonal ? `useAddPersonal${singularPascalCase}Mutation` : `useAdd${pluralPascalCase}Mutation`;

  const reduxPath = isPersonal
    ? `@/redux/features/${pluralLowerCase}/personal${pluralPascalCase}Slice`
    : `@/redux/features/${pluralLowerCase}/${pluralLowerCase}Slice`;

  const interfaceName = `I${pluralPascalCase}`;
  const defaultInstanceName = `default${pluralPascalCase}`;

  const readonlyEmailKey = Object.keys(schema).find(key => schema[key] === 'EMAIL#readonly');
  const hasReadonlyEmail = !!readonlyEmailKey;

  const componentBodyStatements = new Set<string>();

  const toCamelCase = (str: string) => str.replace(/-(\w)/g, (_, c) => c.toUpperCase());

  const generateOptionsVariable = (key: string, optionsString: string | undefined, defaultOptions: { label: string; value: string }[]): string => {
    const varName = `${toCamelCase(key)}Options`;
    const optionsArray = optionsString
      ? optionsString.split(',').map(opt => ({
          label: opt.trim(),
          value: opt.trim(),
        }))
      : defaultOptions;

    const optionsJsArrayString = `[
${optionsArray.map(opt => `        { label: '${opt.label}', value: '${opt.value}' }`).join(',\n')}
    ]`;

    componentBodyStatements.add(`    const ${varName} = ${optionsJsArrayString};`);
    return varName;
  };

  const generateFormFieldJsx = (key: string, type: string): string => {
    const label = key.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    let [typeName, optionsString] = ['', ''];
    [typeName, optionsString] = type.split('#');

    if (type === 'EMAIL#readonly') {
      typeName = 'EMAIL#readonly';
    }

    const formFieldWrapper = (label: string, componentJsx: string, alignTop: boolean = false): string => `
            <div className="grid grid-cols-1 md:grid-cols-4 ${alignTop ? 'items-start' : 'items-center'} gap-4 pr-1">
              <Label htmlFor="${key}" className="text-right ${alignTop ? 'pt-3' : ''}">
                ${label}
              </Label>
              <div className="col-span-3">
                ${componentJsx}
              </div>
            </div>`;

    let componentJsx = '';
    let isTallComponent = false;

    switch (typeName.toUpperCase()) {
      case 'STRING':
        componentJsx = `<InputFieldForString className="text-white" id="${key}" placeholder="${label}" value={new${singularPascalCase}['${key}']} onChange={(value) => handleFieldChange('${key}', value as string)} />`;
        break;
      case 'EMAIL':
        componentJsx = `<InputFieldForEmail className="text-white" id="${key}" value={new${singularPascalCase}['${key}']} onChange={(value) => handleFieldChange('${key}', value as string)} />`;
        break;
      case 'EMAIL#READONLY':
        componentJsx = `<InputFieldForEmail readonly className="text-white" id="${key}" value={author_email} onChange={(value) => handleFieldChange('${key}', value as string)} />`;
        break;
      case 'PASSWORD':
        componentJsx = `<InputFieldForPassword id="${key}" value={new${singularPascalCase}['${key}']} onChange={(value) => handleFieldChange('${key}', value as string)} />`;
        break;
      case 'PASSCODE':
        componentJsx = `<InputFieldForPasscode id="${key}" value={new${singularPascalCase}['${key}']} onChange={(value) => handleFieldChange('${key}', value as string)} />`;
        break;
      case 'URL':
        componentJsx = `<UrlInputField id="${key}" value={new${singularPascalCase}['${key}']} onChange={(value) => handleFieldChange('${key}', value as string)} />`;
        break;
      case 'PHONE':
        componentJsx = `<PhoneInputField id="${key}" value={new${singularPascalCase}['${key}']} onChange={(value) => handleFieldChange('${key}', value)} />`;
        break;
      case 'DESCRIPTION':
        isTallComponent = true;
        componentJsx = `<TextareaFieldForDescription className="text-white" id="${key}" value={new${singularPascalCase}['${key}']} onChange={(e) => handleFieldChange('${key}', e.target.value)} />`;
        break;
      case 'RICHTEXT':
        isTallComponent = true;
        componentJsx = `<RichTextEditorField id="${key}" value={new${singularPascalCase}['${key}']} onChange={(value) => handleFieldChange('${key}', value)} />`;
        break;
      case 'INTNUMBER':
        componentJsx = `<NumberInputFieldInteger id="${key}" value={new${singularPascalCase}['${key}']} onChange={(value) => handleFieldChange('${key}', value as number)} />`;
        break;
      case 'FLOATNUMBER':
        componentJsx = `<NumberInputFieldFloat id="${key}" value={new${singularPascalCase}['${key}']} onChange={(value) => handleFieldChange('${key}', value as number)} />`;
        break;
      case 'BOOLEAN':
        componentJsx = `<BooleanInputField id="${key}" checked={new${singularPascalCase}['${key}']} onCheckedChange={(checked) => handleFieldChange('${key}', checked)} />`;
        break;
      case 'CHECKBOX':
        componentJsx = `<CheckboxField id="${key}" checked={new${singularPascalCase}['${key}']} onCheckedChange={(checked) => handleFieldChange('${key}', checked)} />`;
        break;
      case 'DATE':
        componentJsx = `<DateField id="${key}" value={new${singularPascalCase}['${key}']} onChange={(date) => handleFieldChange('${key}', date)} />`;
        break;
      case 'TIME':
        componentJsx = `<TimeField id="${key}" value={new${singularPascalCase}['${key}']} onChange={(time) => handleFieldChange('${key}', time)} />`;
        break;
      case 'DATERANGE':
        componentJsx = `<DateRangePickerField id="${key}" value={new${singularPascalCase}['${key}']} onChange={(range) => handleFieldChange('${key}', range)} />`;
        break;
      case 'TIMERANGE':
        componentJsx = `<TimeRangePickerField id="${key}" value={new${singularPascalCase}['${key}']} onChange={(range) => handleFieldChange('${key}', range)} />`;
        break;
      case 'COLORPICKER':
        componentJsx = `<ColorPickerField id="${key}" value={new${singularPascalCase}['${key}']} onChange={(value) => handleFieldChange('${key}', value as string)} />`;
        break;
      case 'SELECT': {
        const selectVarName = generateOptionsVariable(key, optionsString, [{ label: 'Option 1', value: 'Option 1' }]);
        componentJsx = `<SelectField options={${selectVarName}} value={new${singularPascalCase}['${key}']} onValueChange={(value) => handleFieldChange('${key}', value)} />`;
        break;
      }
      case 'RADIOBUTTON': {
        const radioVarName = generateOptionsVariable(key, optionsString, [{ label: 'Choice A', value: 'Choice A' }]);
        componentJsx = `<RadioButtonGroupField options={${radioVarName}} value={new${singularPascalCase}['${key}']} onChange={(value) => handleFieldChange('${key}', value)} />`;
        break;
      }
      case 'MULTIOPTIONS': {
        const multiOptionsVarName = generateOptionsVariable(key, optionsString, [{ label: 'Default A', value: 'Default A' }]);
        componentJsx = `<MultiOptionsField options={${multiOptionsVarName}} value={new${singularPascalCase}['${key}']} onChange={(values) => handleFieldChange('${key}', values)} />`;
        break;
      }
      case 'DYNAMICSELECT':
        isTallComponent = true;
        componentJsx = `<DynamicSelectField value={new${singularPascalCase}['${key}']} apiUrl='https://jsonplaceholder.typicode.com/users' onChange={(values) => handleFieldChange('${key}', values)} />`;
        break;
      case 'IMAGE':
        componentJsx = `<ImageUploadManagerSingle value={new${singularPascalCase}['${key}']} onChange={(url) => handleFieldChange('${key}', url)} />`;
        break;
      case 'IMAGES':
        componentJsx = `<ImageUploadManager value={new${singularPascalCase}['${key}']} onChange={(urls) => handleFieldChange('${key}', urls)} />`;
        break;
      case 'MULTICHECKBOX':
        isTallComponent = true;
        componentJsx = `<MultiCheckboxGroupField value={new${singularPascalCase}['${key}']} onChange={(values) => handleFieldChange('${key}', values)} />`;
        break;
      case 'STRINGARRAY':
        isTallComponent = true;
        componentJsx = `<StringArrayField value={new${singularPascalCase}['${key}']} onChange={(value) => handleFieldChange('${key}', value)} />`;
        break;
      case 'AUTOCOMPLETE':
        componentJsx = `<AutocompleteField id="${key}" value={new${singularPascalCase}['${key}']} />`;
        break;
      default:
        componentJsx = `<Input id="${key}" value={String(new${singularPascalCase}['${key}'] || '')} disabled placeholder="Unsupported type: ${typeName}" />`;
        break;
    }

    return formFieldWrapper(label, componentJsx, isTallComponent);
  };

  const formFieldsJsx = Object.entries(schema)
    .map(([key, value]) => {
      if (typeof value === 'object' && !Array.isArray(value)) {
        const label = key.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        const componentJsx = `<JsonTextareaField id="${key}" value={JSON.stringify(new${singularPascalCase}['${key}'], null, 2) || ''} onChange={(value) => {
          handleFieldChange('${key}', value); 
                               
                            }} />`;
        return `
            <div className="grid grid-cols-4 items-start gap-4 pr-1">
              <Label htmlFor="${key}" className="text-right pt-3">
                ${label}
              </Label>
              <div className="col-span-3">
                ${componentJsx}
              </div>
            </div>`;
      }
      return generateFormFieldJsx(key, value as string);
    })
    .join('');

  const dynamicVariablesContent = componentBodyStatements.size > 0 ? `${[...componentBodyStatements].sort().join('\n\n')}` : '';

  const authImport = hasReadonlyEmail ? `import { useSession } from '@/lib/auth-client';` : '';

  const staticImports = `import AutocompleteField from '@/components/dashboard-ui/AutocompleteField'
import ColorPickerField from '@/components/dashboard-ui/ColorPickerField'
import DateRangePickerField from '@/components/dashboard-ui/DateRangePickerField'
import DynamicSelectField from '@/components/dashboard-ui/DynamicSelectField'
import ImageUploadManagerSingle from '@/components/dashboard-ui/imageBB/ImageUploadManagerSingle'
import ImageUploadManager from '@/components/dashboard-ui/imageBB/ImageUploadManager'
import InputFieldForEmail from '@/components/dashboard-ui/InputFieldForEmail'
import InputFieldForPasscode from '@/components/dashboard-ui/InputFieldForPasscode'
import InputFieldForPassword from '@/components/dashboard-ui/InputFieldForPassword'
import InputFieldForString from '@/components/dashboard-ui/InputFieldForString'
import JsonTextareaField from '@/components/dashboard-ui/JsonTextareaField'
import MultiCheckboxGroupField from '@/components/dashboard-ui/MultiCheckboxGroupField'
import MultiOptionsField from '@/components/dashboard-ui/MultiOptionsField'
import NumberInputFieldFloat from '@/components/dashboard-ui/NumberInputFieldFloat'
import NumberInputFieldInteger from '@/components/dashboard-ui/NumberInputFieldInteger'
import PhoneInputField from '@/components/dashboard-ui/PhoneInputField'
import RichTextEditorField from '@/components/dashboard-ui/RichTextEditorField'
import TextareaFieldForDescription from '@/components/dashboard-ui/TextareaFieldForDescription'
import TimeField from '@/components/dashboard-ui/TimeField'
import TimeRangePickerField from '@/components/dashboard-ui/TimeRangePickerField'
import UrlInputField from '@/components/dashboard-ui/UrlInputField'
import { BooleanInputField } from '@/components/dashboard-ui/BooleanInputField'
import { CheckboxField } from '@/components/dashboard-ui/CheckboxField'
import { DateField } from '@/components/dashboard-ui/DateField'
import { RadioButtonGroupField } from '@/components/dashboard-ui/RadioButtonGroupField'
import { SelectField } from '@/components/dashboard-ui/SelectField'

import StringArrayField from './others-field-type/StringArrayField'
import { StringArrayData } from './others-field-type/types';
${authImport}
`;

  return `import {useEffect, useState } from 'react'

import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'

// Static import for all possible form components
${staticImports}

import { use${pluralPascalCase}Store } from '../store/store'
import { ${reduxMutationHook} } from '${reduxPath}'
import { ${interfaceName}, ${defaultInstanceName} } from '../store/data/data'
import { formatDuplicateKeyError, handleError, handleSuccess, isApiErrorResponse } from './utils'

const ${componentName}: React.FC = () => {
    const { toggleAddModal, isAddModalOpen, set${pluralPascalCase} } = use${pluralPascalCase}Store()
    const [add${pluralPascalCase}, { isLoading }] = ${reduxMutationHook}()
    const [new${singularPascalCase}, setNew${singularPascalCase}] = useState<${interfaceName}>(${defaultInstanceName})

    ${
      hasReadonlyEmail
        ? `
    const session = useSession();
    const author_email = session?.data?.user?.email || "---";
    `
        : ''
    }

    const handleFieldChange = (name: string, value: unknown) => {
        setNew${singularPascalCase}(prev => ({ ...prev, [name]: value }))
    }

    const handleAdd${singularPascalCase} = async () => {
        try {
            const updateData = { ...new${singularPascalCase} }
            delete updateData._id
            if (updateData.students) {
                updateData.students = updateData.students.map((i: StringArrayData) => {
                    const r = { ...i }
                    delete r._id
                    return r
                })
            }
            ${hasReadonlyEmail ? `updateData['${readonlyEmailKey}'] = author_email` : ''}
            const added${singularPascalCase} = await add${pluralPascalCase}(updateData).unwrap()
            set${pluralPascalCase}([added${singularPascalCase}])
            toggleAddModal(false)
            setNew${singularPascalCase}(${defaultInstanceName})
            handleSuccess('Added Successfully')
        } catch (error: unknown) {
            console.error('Failed to add record:', error)
            let errMessage: string = 'An unknown error occurred.'
            if (isApiErrorResponse(error)) {
                errMessage = formatDuplicateKeyError(error.data.message) || 'An API error occurred.'
            } else if (error instanceof Error) {
                errMessage = error.message
            }
            handleError(errMessage)
        }
    }

${dynamicVariablesContent}
  useEffect(() => {
    const updateDefaultData = { ...default${pluralPascalCase} };
    // updateDefaultData.area = areaOptions[0].value;
    setNew${singularPascalCase}(updateDefaultData);
  }, []);

    return (
        <Dialog open={isAddModalOpen} onOpenChange={toggleAddModal}>
            <DialogContent
                className="sm:max-w-[825px] rounded-xl border mt-[35px] border-white/20 bg-white/10
                           backdrop-blur-2xl shadow-2xl overflow-hidden transition-all duration-300 p-0"
            >
                <ScrollArea
                    className="h-[75vh] max-h-[calc(100vh-2rem)] rounded-xl"
                >
                    <DialogHeader className="p-6 pb-3">
                        <DialogTitle
                            className="text-xl font-semibold bg-clip-text text-transparent
                                       bg-linear-to-r from-white to-blue-200 drop-shadow-md"
                        >
                            ${dialogTitle}
                        </DialogTitle>
                    </DialogHeader>

                    <div className="grid gap-4 py-4 px-6 text-white">
                        ${formFieldsJsx}
                    </div>
                </ScrollArea>

                <DialogFooter className="p-6 pt-4 gap-3">
                    <Button
                        variant="outlineWater"
                        onClick={() => toggleAddModal(false)}
                        size="sm"
                    >
                        Cancel
                    </Button>
                    <Button
                        disabled={isLoading}
                        onClick={handleAdd${singularPascalCase}}
                        variant="outlineGarden"
                        size="sm"
                    >
                        {isLoading ? 'Adding...' : 'Add ${singularPascalCase}'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default ${componentName}
`;
};
