/*
|-----------------------------------------
| setting up Preview for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

import { defaultDataForm6, IForm6Data, Form6Props } from './data';

const PreviewForm6 = ({ data }: Form6Props) => {
  let formData = defaultDataForm6;
  if (data && typeof data === 'string') {
    formData = JSON.parse(data) as IForm6Data;
  }

  const renderTags = (text: string, colorClass: string) => {
    return text.split(',').map((tag, i) => (
      <span key={i} className={`px-2 py-1 rounded text-xs border ${colorClass} mr-2 mb-2 inline-block`}>
        {tag.trim()}
      </span>
    ));
  };

  return (
    <div className="relative overflow-hidden bg-white/5 backdrop-blur-sm border border-white/10 shadow-xl rounded-xl p-6">
      <div className="space-y-6">
        <div>
          <h3 className="text-xs font-semibold text-purple-400 uppercase mb-3">Technical Skills</h3>
          <div className="flex flex-wrap">{renderTags(formData.technicalSkills, 'bg-purple-500/10 border-purple-500/30 text-purple-300')}</div>
        </div>

        <div>
          <h3 className="text-xs font-semibold text-blue-400 uppercase mb-3">Languages</h3>
          <div className="flex flex-wrap">{renderTags(formData.languages, 'bg-blue-500/10 border-blue-500/30 text-blue-300')}</div>
        </div>

        <div className="grid grid-cols-1 gap-4 pt-4 border-t border-white/10">
          <div>
            <p className="text-xs text-gray-500 font-bold">🏆 Achievements & Awards</p>
            <p className="text-sm text-gray-300 mt-1">{formData.awards}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 font-bold">⚽ Extra Curricular</p>
            <p className="text-sm text-gray-300 mt-1">{formData.extraCurricular}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewForm6;
