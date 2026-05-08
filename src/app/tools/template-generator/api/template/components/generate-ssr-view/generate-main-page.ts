/*
|-----------------------------------------
| setting up GenerateMainPage for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

export const generateMainPage = (inputJsonFile: string): string => {
  const { schema, namingConvention } = JSON.parse(inputJsonFile) || {};

  const pluralName = namingConvention.users_2_000___;

  const displayKey = Object.keys(schema).find(key => schema[key] === 'STRING') || 'name';

  return `import CustomLInk from './CustomButton'

const Page = async () => {
    const fetchData = async () => {
        const token = process.env.NEXT_PUBLIC_Token
        if (!token) {
            console.error(
                'Authentication token not found. Unable to fetch data.'
            )
            return
        }

        const url =
            'http://localhost:3000/api/${pluralName}/v1?page=1&limit=4'

        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    Authorization: \`Bearer \${token}\`,
                },
            })

            const responseData = await response.json()
            return responseData.data?.${pluralName}
        } catch (error) {
            console.error('Failed to fetch data:', error)
            return []
        }
    }
    const data: { ${displayKey}: string; _id: string }[] = await fetchData()
    return (
        <main className="w-full flex flex-col gap-2 p-1 md:p-4">
            {data &&
                data.length > 0 &&
                data.map((i: { ${displayKey}: string; _id: string }, idx: number) => (
                    <div key={idx + i?.${displayKey}}>
                        <CustomLInk
                            name={i.${displayKey}}
                            url={\`/generate/${pluralName}/ssr-view/details/\${i._id}\`}
                        />
                    </div>
                ))}
        </main>
    )
}
export default Page
`;
};
