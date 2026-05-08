/*
|-----------------------------------------
| setting up ViewRichText for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

export const ViewRichText = ({ data }: { data: string }) => {
  return (
    <main
      className="rich-text-content 
    [&_s]:line-through [&_del]:line-through 
    [&_u]:underline 
    [&_ul]:list-disc [&_ul]:ml-6 [&_ul]:pl-2 
    [&_ol]:list-decimal [&_ol]:ml-6 [&_ol]:pl-2 
    [&_li]:mb-2 
    [&_mark]:bg-yellow-200 [&_mark]:px-0.5 [&_mark]:rounded-sm
    [&_.text-left]:text-left 
    [&_.text-center]:text-center 
    [&_.text-right]:text-right 
    [&_.text-justify]:text-justify"
      dangerouslySetInnerHTML={{ __html: data }}
    />
  );
};
