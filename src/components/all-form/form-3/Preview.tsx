/*
|-----------------------------------------
| setting up Preview for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

import { defaultDataForm3, IForm3Data, Form3Props } from './data';

const PreviewForm3 = ({ data }: Form3Props) => {
  let formData = defaultDataForm3;
  if (data && typeof data === 'string') {
    formData = JSON.parse(data) as IForm3Data;
  }

  return (
    <div className="relative overflow-hidden bg-white/5 backdrop-blur-sm border border-white/10 shadow-xl rounded-xl p-0">
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 p-6 border-b border-white/10">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
          {formData.formTitle}
        </h2>
      </div>

      <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-2">
          <p className="text-xs text-purple-400 uppercase tracking-widest">Address Details</p>
          <div className="text-xl text-white font-light leading-relaxed">
            {formData.streetAddress}
            <br />
            {formData.city}, {formData.state}
            <br />
            <span className="font-semibold">{formData.country}</span> - {formData.postalCode}
          </div>
        </div>

        <div className="flex flex-col justify-center items-start md:items-end border-t md:border-t-0 md:border-l border-white/10 pt-4 md:pt-0 md:pl-6">
          <p className="text-xs text-gray-500 mb-1">Visa History</p>
          <div
            className={`px-4 py-2 rounded-lg border ${formData.hasRefusalHistory === 'Yes' ? 'bg-red-500/10 border-red-500/30' : 'bg-green-500/10 border-green-500/30'}`}
          >
            <span className={`text-sm font-bold ${formData.hasRefusalHistory === 'Yes' ? 'text-red-400' : 'text-green-400'}`}>
              Refusals: {formData.hasRefusalHistory}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewForm3;
