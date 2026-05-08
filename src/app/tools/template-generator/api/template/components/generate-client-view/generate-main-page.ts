/*
|-----------------------------------------
| setting up GenerateMainPage for the App
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

export const generateClientListPageFile = (inputJsonFile: string): string => {
  const { schema, namingConvention }: InputConfig = JSON.parse(inputJsonFile) || {};

  const pluralLowerCase = namingConvention.users_2_000___;
  const pluralUpperCase = namingConvention.Users_1_000___;

  const schemaKeys = Object.keys(schema);
  const displayKey =
    schemaKeys.find(key => key.toLowerCase() === 'title') ||
    schemaKeys.find(key => key.toLowerCase() === 'name') ||
    schemaKeys.find(key => schema[key] === 'STRING') ||
    'name';
  return `'use client'

import { useEffect, useState } from 'react'
import CustomLink from './CustomButton' // Renamed for clarity (component should be Link)

// A more specific type for the data items, ensuring type safety.
type DataItem = {
    _id: string;
    ${displayKey}: string;
    [key: string]: unknown; // Allow for other properties from the API
};

const Page = () => {
    const [data, setData] = useState<DataItem[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            setError(null)
            
            try {
                // Best practice: Use environment variables for API endpoints.
                const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
                const url = \`\${baseUrl}/api/${pluralLowerCase}/v1?page=1&limit=10\`;

                // Example using a token from environment variables for authorization.
                const token = process.env.NEXT_PUBLIC_Token
                if (!token) {
                    throw new Error("API token is not configured.");
                }

                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        Authorization: \`Bearer \${token}\`,
                        'Content-Type': 'application/json',
                    },
                })

                if (!response.ok) {
                    throw new Error(\`Failed to fetch data: \${response.statusText}\`);
                }

                const responseData = await response.json()
                // Safely access nested data to prevent runtime errors.
                setData(responseData?.data?.data || [])
            } catch (err) {
                setError((err as Error).message || 'An unknown error occurred.')
                setData([]) // Ensure data is an array on error.
            } finally {
                setLoading(false)
            }
        }
        
        fetchData()
    }, [])

    if (loading) {
        return <div className="text-center p-8">Loading ${pluralUpperCase}...</div>
    }

    if (error) {
        return <div className="text-center p-8 text-red-500">Error: {error}</div>
    }

    return (
        <main className="w-full flex flex-col gap-4 p-1 md:p-4">
            <h1 className="text-2xl font-bold">All ${pluralUpperCase}</h1>
            {data.length > 0 ? (
                <div className="flex flex-col gap-2">
                    {data.map((item) => (
                        <div key={item._id}>
                            <CustomLink
                                name={item.${displayKey}}
                                url={\`/dashboard/${pluralLowerCase}/client-view/details/\${item._id}\`}
                            />
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center p-8 bg-slate-100 dark:bg-slate-800 rounded-md">
                    No ${pluralUpperCase} found.
                </div>
            )}
        </main>
    )
}

export default Page
`;
};
