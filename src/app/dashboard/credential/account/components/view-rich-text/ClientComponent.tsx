/*
|-----------------------------------------
| setting up ClientComponent for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

import { ViewRichText } from './ViewRichText';

const ClientComponent = ({ data }: { data: string }) => {
  return (
    <main className="w-full min-h-[200px] border-1 border-slate-200">
      <h2 className="text-xl text-center w-full border-b-2 p-2 border-slate-200">Client Component</h2>
      <ViewRichText data={data} />
    </main>
  );
};
export default ClientComponent;
