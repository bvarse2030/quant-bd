/*
|-----------------------------------------
| setting up Mutation for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

'use client';

import { useState } from 'react';
import { Search, Save } from 'lucide-react';
import { iconMap, iconOptions } from '@/components/all-icons/all-icons-jsx';
import { defaultDataSection30, IDefaultDataSection30, IDefaultDataSection30Props } from './data';

const MutationSection30 = ({ data, onSubmit }: IDefaultDataSection30Props) => {
  const initialData = typeof data === 'string' ? JSON.parse(data) : data || defaultDataSection30;

  const [localData, setLocalData] = useState<IDefaultDataSection30>(initialData);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredIcons = iconOptions.filter(iconName => iconName.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleSelectIcon = (iconName: string) => {
    setLocalData({ iconName });
  };

  const handleSave = () => {
    if (onSubmit) {
      onSubmit(localData);
    }
  };

  const SelectedIcon = localData.iconName ? iconMap[localData.iconName] : null;

  return (
    <div className="w-full max-w-6xl mx-auto p-6 font-sans">
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 flex flex-col md:flex-row h-[80vh] md:h-[600px]">
        <div className="w-full md:w-1/3 bg-slate-50 border-r border-slate-100 flex flex-col p-8 items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:20px_20px] opacity-50" />

          <div className="relative z-10 flex flex-col items-center gap-6">
            <h2 className="text-xl font-bold text-slate-800 tracking-tight">Icon Preview</h2>

            <div className="w-40 h-40 rounded-3xl bg-white shadow-xl shadow-indigo-500/10 flex items-center justify-center border border-indigo-50 transform transition-all duration-500 hover:scale-105 hover:rotate-3">
              {SelectedIcon ? (
                <SelectedIcon className="w-20 h-20 text-indigo-600 transition-all duration-300 drop-shadow-sm" strokeWidth={1.5} />
              ) : (
                <span className="text-slate-300 text-xs font-medium uppercase tracking-widest">No Selection</span>
              )}
            </div>

            <div className="text-center">
              <p className="text-sm font-semibold text-slate-600">{localData.iconName || 'Select an icon'}</p>
              <p className="text-xs text-slate-400 mt-1">This icon will be displayed in the section.</p>
            </div>

            <button
              onClick={handleSave}
              className="mt-6 flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-semibold shadow-lg shadow-indigo-500/30 transition-all active:scale-95"
            >
              <Save className="w-4 h-4" />
              Save Changes
            </button>
          </div>
        </div>

        <div className="w-full md:w-2/3 flex flex-col bg-white">
          <div className="p-6 border-b border-slate-100 bg-white/80 backdrop-blur-sm z-10 sticky top-0">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-indigo-500 transition-colors" />
              <input
                type="text"
                placeholder="Search icons..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all font-medium"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
            {filteredIcons.length > 0 ? (
              <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-4">
                {filteredIcons.map(iconName => {
                  const IconComponent = iconMap[iconName];
                  const isSelected = localData.iconName === iconName;

                  if (!IconComponent) return null;

                  return (
                    <button
                      key={iconName}
                      onClick={() => handleSelectIcon(iconName)}
                      className={`
                        group relative flex flex-col items-center justify-center aspect-square rounded-2xl transition-all duration-300
                        ${
                          isSelected
                            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/40 scale-110 z-10 ring-4 ring-white'
                            : 'bg-slate-50 text-slate-500 hover:bg-white hover:text-indigo-600 hover:shadow-xl hover:shadow-slate-200/50 hover:-translate-y-1'
                        }
                      `}
                      title={iconName}
                    >
                      <IconComponent className={`w-6 h-6 ${isSelected ? 'animate-pulse' : ''}`} />
                      <span
                        className={`text-[9px] mt-2 max-w-[90%] truncate px-1 font-medium ${isSelected ? 'text-indigo-200' : 'text-slate-400 group-hover:text-indigo-400'}`}
                      >
                        {iconName}
                      </span>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-slate-400">
                <Search className="w-12 h-12 mb-4 opacity-20" />
                <p>No icons found matching &quot;{searchTerm}&quot;</p>
              </div>
            )}
          </div>

          <div className="p-4 border-t border-slate-100 bg-slate-50/50 text-center">
            <p className="text-xs text-slate-400">Showing {filteredIcons.length} available icons</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MutationSection30;
