/*
|-----------------------------------------
| setting up Preview for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

import { defaultDataForm1, IForm1Data, Form1Props } from './data';

const PreviewForm1 = ({ data }: Form1Props) => {
  let formData = defaultDataForm1;
  if (data && typeof data === 'string') {
    formData = JSON.parse(data) as IForm1Data;
  }

  return (
    <div className="relative overflow-hidden bg-white/5 backdrop-blur-sm border border-white/10 shadow-xl rounded-xl p-6">
      <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-bl-full -mr-8 -mt-8 blur-2xl pointer-events-none" />

      <div className="space-y-6 relative z-10">
        <div className="border-b border-white/10 pb-4">
          <h3 className="text-xs font-semibold text-purple-400 uppercase tracking-wider">{formData.formTitle}</h3>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
            {formData.firstName} {formData.lastName}
          </h1>
          <p className="text-gray-400 text-sm mt-1">{formData.email}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          <div className="space-y-1">
            <p className="text-gray-500 text-xs">Phone Number</p>
            <p className="text-white font-medium">{formData.phoneNumber}</p>
          </div>
          <div className="space-y-1">
            <p className="text-gray-500 text-xs">Date of Birth</p>
            <p className="text-white font-medium">{formData.dateOfBirth}</p>
          </div>
          <div className="space-y-1">
            <p className="text-gray-500 text-xs">Passport Number</p>
            <div className="inline-block px-3 py-1 rounded-full bg-white/5 border border-white/10 text-purple-300 font-mono">{formData.passportNumber}</div>
          </div>
          <div className="space-y-1">
            <p className="text-gray-500 text-xs">Gender</p>
            <p className="text-white font-medium">{formData.gender}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewForm1;
