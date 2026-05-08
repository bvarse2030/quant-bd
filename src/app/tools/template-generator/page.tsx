/*
|-----------------------------------------
| setting up Page for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

import JsonEditor from './components/JsonEditor';

const Page = () => {
  return (
    <main className="md:min-w-7xl mx-auto max-w-7xl pt-[65px]">
      <div className="fixed inset-0 bg-linear-to-br from-indigo-500 via-purple-500 to-blue-500 -z-10" />
      <JsonEditor />
    </main>
  );
};
export default Page;
