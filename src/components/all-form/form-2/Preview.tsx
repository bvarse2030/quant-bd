/*
|-----------------------------------------
| setting up Preview for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

import { defaultDataForm2, IForm2Data, Form2Props } from './data';

const PreviewForm2 = ({ data }: Form2Props) => {
  let formData = defaultDataForm2;
  if (data && typeof data === 'string') {
    formData = JSON.parse(data) as IForm2Data;
  }

  return (
    <div className="relative overflow-hidden bg-white/5 backdrop-blur-sm border border-white/10 shadow-xl rounded-xl p-6">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-xs font-semibold text-blue-400 uppercase tracking-wider">Sponsorship</h3>
          <h2 className="text-xl font-bold text-white mt-1">Family Information</h2>
        </div>
        <div className="px-4 py-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-lg">
          <p className="text-xs text-green-400">Annual Income</p>
          <p className="text-lg font-bold text-green-300">{formData.annualFamilyIncome}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="p-4 rounded-lg bg-white/5 border border-white/10">
            <h4 className="text-purple-300 text-sm font-semibold mb-2">Parents</h4>
            <div className="space-y-2 text-sm text-gray-300">
              <p>
                <span className="text-gray-500 block text-xs">Father</span> {formData.fatherName}
              </p>
              <p>
                <span className="text-gray-500 block text-xs">Mother</span> {formData.motherName}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="p-4 rounded-lg bg-white/5 border border-white/10">
            <h4 className="text-pink-300 text-sm font-semibold mb-2">Sponsor & Emergency</h4>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-gray-500 text-xs">Sponsored By</p>
                <p className="text-white">
                  {formData.sponsorName} <span className="text-gray-500 text-xs">({formData.sponsorRelation})</span>
                </p>
              </div>
              <div>
                <p className="text-gray-500 text-xs">Emergency Contact</p>
                <p className="text-white font-mono text-xs">{formData.emergencyContact}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewForm2;
