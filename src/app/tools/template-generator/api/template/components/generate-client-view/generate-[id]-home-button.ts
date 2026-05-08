/*
|-----------------------------------------
| setting up GenerateIdHomeButton for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

export const generateIDHomeButton = (inputJsonFile: string): string => {
  const { namingConvention } = JSON.parse(inputJsonFile) || {};
  const folderName = namingConvention.users_2_000___;
  return `import Link from 'next/link'

const HomeButton = () => {
    return (
        <Link
            href="/${folderName}/all"
            className="w-full hover:bg-slate-400 bg-slate-300 p-1 border-1 border-slate-400 "
        >
            Back to Home
        </Link>
    )
}
export default HomeButton


`;
};
