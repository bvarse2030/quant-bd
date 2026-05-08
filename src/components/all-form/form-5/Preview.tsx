/*
|-----------------------------------------
| setting up Preview for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

import { defaultDataForm5, IForm5Data, Form5Props } from './data';

const PreviewForm5 = ({ data }: Form5Props) => {
  let formData = defaultDataForm5;
  if (data && typeof data === 'string') {
    formData = JSON.parse(data) as IForm5Data;
  }

  return (
    <div className="relative overflow-hidden bg-white/5 backdrop-blur-sm border border-white/10 shadow-xl rounded-xl">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10" />

      <div className="relative p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-white">Study Goals</h2>
          <span className="px-3 py-1 rounded-full bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-500/20">{formData.preferredIntake}</span>
        </div>

        <div className="flex flex-col space-y-4">
          <div>
            <p className="text-xs text-gray-400 uppercase">Destination & Major</p>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              {formData.degreeLevel} in {formData.desiredMajor}
            </h3>
            <p className="text-blue-400 font-medium mt-1 flex items-center gap-2">
              <span className="text-lg">📍</span> {formData.targetCountry}
            </p>
          </div>

          <div className="pt-4 border-t border-white/10 flex justify-between items-center">
            <div>
              <p className="text-xs text-gray-500">Budget Range</p>
              <p className="text-sm text-white font-mono">{formData.budgetRange}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500">Scholarship</p>
              <p className="text-sm font-semibold text-yellow-400">{formData.scholarshipNeeded === 'Yes' ? 'Requested' : 'Not Required'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewForm5;
