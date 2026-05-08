/*
|-----------------------------------------
| setting up Preview for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

import { FileText, Download, Phone, Image as ImageIcon, FileCheck } from 'lucide-react';

import { defaultDataForm7, IForm7Data } from './data';

export interface PreviewProps {
  data?: IForm7Data | string;
}

const PreviewForm7 = ({ data }: PreviewProps) => {
  let formData = defaultDataForm7;
  if (data && typeof data === 'string') {
    formData = JSON.parse(data) as IForm7Data;
  } else if (data) {
    formData = data as IForm7Data;
  }

  const getIcon = (url: string) => {
    if (url.endsWith('.jpg') || url.endsWith('.png') || url.endsWith('.webp') || url.endsWith('.jpeg') || url.endsWith('.ico')) {
      return <ImageIcon className="h-4 w-4" />;
    }
    return <FileText className="h-4 w-4" />;
  };

  const FileCard = ({ title, url, colorClass }: { title: string; url: string; colorClass: string }) => {
    if (!url) return null;

    const ext = url.split('.').pop()?.toUpperCase().substring(0, 4) || 'FILE';

    return (
      <div className="flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors group">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className={`p-2.5 rounded-lg bg-opacity-20 ${colorClass.replace('text-', 'bg-')} ${colorClass}`}>{getIcon(url)}</div>
          <div className="flex flex-col overflow-hidden">
            <span className="text-sm text-gray-200 font-medium truncate">{title}</span>
            <span className="text-[10px] text-gray-500 font-mono">{ext}</span>
          </div>
        </div>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-md bg-white/5 hover:bg-white/20 text-gray-400 hover:text-white transition-all"
          title="Download"
        >
          <Download className="h-4 w-4" />
        </a>
      </div>
    );
  };

  return (
    <div className="relative overflow-hidden bg-slate-900/80 backdrop-blur-md border border-white/10 shadow-2xl rounded-xl p-6">
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between mb-8 border-b border-white/10 pb-6 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <FileCheck className="h-4 w-4 text-blue-400" />
            <h3 className="text-xs font-bold text-blue-400 uppercase tracking-widest">Submitted Documents</h3>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
              {formData.student_name.charAt(0) || 'U'}
            </div>
            <div>
              <h1 className="text-lg font-bold text-white leading-none">{formData.student_name || 'Unknown Student'}</h1>
              <p className="text-xs text-gray-400 mt-1">ID: {formData.formUid.split('-').pop()}</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-300 bg-white/5 px-4 py-2 rounded-lg border border-white/5">
          <Phone className="h-4 w-4 text-emerald-400" />
          <span className="font-mono">{formData.mobile_number || 'N/A'}</span>
        </div>
      </div>

      <div className="relative z-10 mb-8">
        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 pl-1">Identification</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <FileCard title="NID / Smart Card" url={formData.documents.nid} colorClass="text-blue-400" />
          <FileCard title="Passport" url={formData.documents.passport} colorClass="text-blue-400" />
          <FileCard title="Student Photo" url={formData.documents.images} colorClass="text-pink-400" />
          <FileCard title="Birth Certificate" url={formData.documents.birth_certificate} colorClass="text-pink-400" />
        </div>
      </div>

      <div className="relative z-10 mb-8">
        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 pl-1">Academic Records</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <FileCard title="SSC / O-Level" url={formData.documents.ssc_certificate} colorClass="text-purple-400" />
          <FileCard title="HSC / A-Level" url={formData.documents.hsc_certificate} colorClass="text-purple-400" />
        </div>
      </div>

      {formData.documents.others.length > 0 && (
        <div className="relative z-10">
          <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 pl-1">Additional Uploads</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {formData.documents.others.map(doc => (
              <FileCard key={doc.id} title={doc.name} url={doc.path} colorClass="text-emerald-400" />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PreviewForm7;
