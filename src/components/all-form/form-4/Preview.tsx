/*
|-----------------------------------------
| setting up Preview for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

import { defaultDataForm4, IForm4Data, Form4Props } from './data';

const PreviewForm4 = ({ data }: Form4Props) => {
  let formData = defaultDataForm4;
  if (data && typeof data === 'string') {
    formData = JSON.parse(data) as IForm4Data;
  }

  return (
    <div className="relative overflow-hidden bg-white/5 backdrop-blur-sm border border-white/10 shadow-xl rounded-xl p-6 group hover:border-purple-500/30 transition-colors">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6">
        <div>
          <h3 className="text-xs font-semibold text-pink-400 uppercase mb-1">Latest Qualification</h3>
          <h1 className="text-2xl font-bold text-white">{formData.institutionName}</h1>
          <p className="text-gray-400">{formData.qualification}</p>
        </div>
        <div className="text-right">
          <span className="text-xs text-gray-500 bg-white/10 px-2 py-1 rounded">Class of {formData.passingYear}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-gradient-to-br from-purple-900/20 to-blue-900/20 border border-white/10">
          <p className="text-xs text-gray-400 uppercase">CGPA / Result</p>
          <p className="text-xl font-bold text-white mt-1">{formData.resultCGPA}</p>
        </div>

        <div className="p-4 rounded-xl bg-gradient-to-br from-pink-900/20 to-purple-900/20 border border-white/10">
          <p className="text-xs text-gray-400 uppercase">Proficiency Test</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-lg font-bold text-white">{formData.englishTestType}</span>
            <span className="text-sm text-pink-300">{formData.englishTestScore}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewForm4;
