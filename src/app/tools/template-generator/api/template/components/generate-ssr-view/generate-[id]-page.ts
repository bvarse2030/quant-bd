/*
|-----------------------------------------
| setting up GenerateIdPage for the App
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
  schema: Schema;
  namingConvention: {
    Users_1_000___: string;
    users_2_000___: string;
    User_3_000___: string;
    user_4_000___: string;
    use_generate_folder: boolean;
  };
}

export const generateDetailPageFile = (inputJsonFile: string): string => {
  const { schema, namingConvention }: InputConfig = JSON.parse(inputJsonFile) || {};

  const modelName = namingConvention.User_3_000___;
  const interfaceName = `I${modelName}`;
  const mapSchemaTypeToTsType = (type: string): string => {
    const [typeName, options] = type.split('#');

    switch (typeName.toUpperCase()) {
      case 'INTNUMBER':
      case 'FLOATNUMBER':
        return 'number';
      case 'BOOLEAN':
      case 'CHECKBOX':
        return 'boolean';
      case 'IMAGES':
      case 'MULTICHECKBOX':
      case 'MULTIOPTIONS':
      case 'DYNAMICSELECT':
        return 'string[]';
      case 'DATE':
        return 'Date | string';
      case 'DATERANGE':
        return '{ start: Date | string; end: Date | string }';
      case 'TIMERANGE':
        return '{ start: string; end: string }';
      case 'STRINGARRAY':
        if (options) {
          const fields = options
            .split(',')
            .map(field => `${field.trim()}: string`)
            .join('; ');
          return `Array<{ ${fields} }>`;
        }
        return 'Array<{ [key: string]: string }>';
      default:
        return 'string';
    }
  };

  const generateTsInterfaceProperties = (currentSchema: Schema, depth: number): string => {
    const indent = '    '.repeat(depth);
    return Object.entries(currentSchema)
      .map(([key, value]) => {
        const quotedKey = `"${key}"`;
        if (typeof value === 'object' && !Array.isArray(value)) {
          return `${indent}${quotedKey}: {\n${generateTsInterfaceProperties(value, depth + 1)}\n${indent}}`;
        }
        return `${indent}${quotedKey}: ${mapSchemaTypeToTsType(value as string)}`;
      })
      .join(';\n');
  };

  const generateDetailsJsx = (currentSchema: Schema): string => {
    return Object.entries(currentSchema)
      .map(([key, value]) => {
        const isNestedObject = typeof value === 'object' && !Array.isArray(value);

        const [baseType = ''] = typeof value === 'string' ? (value as string).toUpperCase().split('#') : [];

        const isSimpleArray = ['IMAGES', 'MULTICHECKBOX', 'MULTIOPTIONS', 'DYNAMICSELECT'].includes(baseType);
        const isObjectArray = baseType === 'STRINGARRAY';

        let displayValue;

        if (isNestedObject || isObjectArray) {
          displayValue = `<pre className="text-sm">{JSON.stringify(data?.["${key}"], null, 2)}</pre>`;
        } else if (isSimpleArray) {
          displayValue = `{data?.["${key}"]?.join(', ')}`;
        } else {
          displayValue = `{data?.["${key}"]?.toString()}`;
        }

        return `
            <div className="w-full hover:bg-slate-200 bg-slate-100 block p-2 border-b border-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 dark:border-slate-500">
                <strong className="capitalize">${key.replace(/-/g, ' ')}:</strong> ${displayValue}
            </div>`;
      })
      .join('');
  };

  const displayKey = Object.keys(schema).find(k => k.toLowerCase() === 'title' || k.toLowerCase() === 'name') || Object.keys(schema)[0];

  const interfaceProperties = generateTsInterfaceProperties(schema, 1);
  const detailsJsx = generateDetailsJsx(schema);
  const pluralName = namingConvention.users_2_000___;

  return `import { notFound } from 'next/navigation'
import HomeButton from './HomeButton'

// Dynamically generated interface based on the schema
interface ${interfaceName} {
${interfaceProperties};
    _id: string;
}

interface ApiResponse {
    data: ${interfaceName};
    message: string;
    status: number;
}

const DataDetails = ({ data }: { data: ${interfaceName} }) => {
    return (
        <div className="w-full flex flex-col md:p-4 p-1 gap-4">
            <h1 className="text-2xl font-bold">${modelName} Details</h1>
            <div className="border border-slate-300 rounded-md overflow-hidden dark:border-slate-600">
                ${detailsJsx.trim()}
            </div>
            <HomeButton />
        </div>
    )
}

const getDataById = async (id: string): Promise<ApiResponse> => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    const backendUrl = \`\${baseUrl}/api/${pluralName}/v1?id=\${id}\`

    try {
        const res = await fetch(backendUrl, { next: { revalidate: 3600 } })
        if (!res.ok) {
            console.error('API fetch failed with status:', res.status);
            if (res.status === 404) {
                notFound();
            }
            throw new Error('Failed to fetch data');
        }
        const responseData: ApiResponse = await res.json()
        if (!responseData || !responseData.data) {
             notFound()
        }
        return responseData
    } catch (error) {
        console.error('Failed to fetch ${modelName}:', error)
        notFound();
    }
}

async function getData(id: string) {
    const data = await getDataById(id)
    if (!data) notFound()
    return data
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const data = await getData(id)

    return {
        title: data?.data?.["${displayKey}"]?.toString() || '${modelName}',
    }
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const data = await getData(id)
    return (
        <div className="py-12 flex flex-col w-full">
            <DataDetails data={data.data} />
        </div>
    )
}
`;
};
