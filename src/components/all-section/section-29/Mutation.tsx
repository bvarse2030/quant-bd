/*
|-----------------------------------------
| setting up Mutation for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

'use client';

import React, { useState } from 'react';

import { defaultDataSection29, IDefaultDataSection29, IDefaultDataSection29Props } from './data';

const ChevronDownIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-4 w-4 text-gray-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
);

const MutationSection28 = ({ data, onSubmit }: IDefaultDataSection29Props) => {
  const parsedData = typeof data === 'string' ? JSON.parse(data) : data;
  const [localData, setLocalData] = useState<IDefaultDataSection29>(parsedData || defaultDataSection29);
  const [isHovered, setIsHovered] = useState(false);

  const handleChange = (key: keyof IDefaultDataSection29, value: string) => {
    setLocalData(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    if (onSubmit) {
      onSubmit(localData);
    }
  };

  const isBackdrop = localData.background.includes('backdrop');

  return (
    <div className="w-full max-w-5xl mx-auto p-4 md:p-8 font-sans">
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 transition-all duration-500 hover:shadow-indigo-500/10">
        <div className="bg-slate-50 border-b border-slate-100 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
              Component <span className="text-indigo-600">Configurator</span>
            </h2>
            <p className="text-slate-500 text-sm mt-1">Customize the dimensions and appearance of your spacer block.</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-xs font-bold uppercase tracking-wider">Preview Mode</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 min-h-[500px]">
          <div className="lg:col-span-4 bg-white p-6 md:p-8 flex flex-col gap-6 border-r border-slate-100 z-10 relative">
            <div className="group">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 group-focus-within:text-indigo-500 transition-colors">
                Height
              </label>
              <div className="relative">
                <select
                  value={localData.height}
                  onChange={e => handleChange('height', e.target.value)}
                  className="w-full appearance-none bg-slate-50 border border-slate-200 text-slate-700 py-3 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all cursor-pointer font-medium"
                >
                  <option value="h-4">h-4 (1rem)</option>
                  <option value="h-8">h-8 (2rem)</option>
                  <option value="h-12">h-12 (3rem)</option>
                  <option value="h-16">h-16 (4rem)</option>
                  <option value="h-24">h-24 (6rem)</option>
                  <option value="h-32">h-32 (8rem)</option>
                  <option value="h-48">h-48 (12rem)</option>
                  <option value="h-64">h-64 (16rem)</option>
                  <option value="h-96">h-96 (24rem)</option>
                  <option value="h-128">h-128 (32rem)</option>
                  <option value="h-256">h-256 (64rem)</option>
                </select>
                <ChevronDownIcon />
              </div>
            </div>

            <div className="group">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 group-focus-within:text-indigo-500 transition-colors">
                Width
              </label>
              <div className="relative">
                <select
                  value={localData.width}
                  onChange={e => handleChange('width', e.target.value)}
                  className="w-full appearance-none bg-slate-50 border border-slate-200 text-slate-700 py-3 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all cursor-pointer font-medium"
                >
                  <option value="w-full">Full Width</option>
                  <option value="w-1/2">1/2 Width</option>
                  <option value="w-1/3">1/3 Width</option>
                  <option value="w-2/3">2/3 Width</option>
                  <option value="w-1/4">1/4 Width</option>
                  <option value="w-2/4">2/4 Width</option>
                  <option value="w-3/4">3/4 Width</option>
                </select>
                <ChevronDownIcon />
              </div>
            </div>

            <div className="group">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 group-focus-within:text-indigo-500 transition-colors">
                Appearance
              </label>
              <div className="relative">
                <select
                  value={localData.background}
                  onChange={e => handleChange('background', e.target.value)}
                  className="w-full appearance-none bg-slate-50 border border-slate-200 text-slate-700 py-3 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all cursor-pointer font-medium"
                >
                  <optgroup label="Solid Colors">
                    <option value="transparent">Transparent</option>
                    <option value="bg-white">White</option>
                    <option value="bg-gray-100">Gray 100</option>
                    <option value="bg-black">Black</option>
                  </optgroup>
                  <optgroup label="Glassmorphism / Backdrop">
                    <option value="backdrop-blur-md">Backdrop Blur MD</option>
                    <option value="backdrop-blur-xl">Backdrop Blur XL</option>
                    <option value="backdrop-blur-2xl">Backdrop Blur 2XL</option>
                    <option value="backdrop-blur-3xl">Backdrop Blur 3XL</option>
                    <option value="backdrop-blur-4xl">Backdrop Blur 4XL</option>
                  </optgroup>
                </select>
                <ChevronDownIcon />
              </div>
            </div>

            <div className="group">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 group-focus-within:text-indigo-500 transition-colors">
                Layout Mode
              </label>
              <div className="relative">
                <select
                  value={localData.display}
                  onChange={e => handleChange('display', e.target.value)}
                  className="w-full appearance-none bg-slate-50 border border-slate-200 text-slate-700 py-3 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all cursor-pointer font-medium"
                >
                  <option value="block">Block</option>
                  <option value="flex">Flex</option>
                  <option value="grid">Grid</option>
                  <option value="hidden">Hidden</option>
                </select>
                <ChevronDownIcon />
              </div>
            </div>

            <div className="flex-grow"></div>

            <button
              onClick={handleSave}
              className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold text-sm tracking-wide shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Save Changes
            </button>
          </div>

          <div className="lg:col-span-8 bg-slate-50 relative overflow-hidden flex flex-col items-center justify-center p-8 md:p-12">
            <div
              className="absolute inset-0 z-0 opacity-40"
              style={{ backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '24px 24px' }}
            ></div>

            {isBackdrop && (
              <div className="absolute inset-0 z-0 flex items-center justify-center overflow-hidden">
                <div className="w-64 h-64 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse absolute top-1/4 left-1/4"></div>
                <div
                  className="w-64 h-64 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse absolute bottom-1/4 right-1/4"
                  style={{ animationDelay: '1s' }}
                ></div>
              </div>
            )}

            <div className="w-full h-full border-2 border-dashed border-slate-300 rounded-2xl flex items-start justify-start relative z-10 transition-colors duration-300 bg-white/30">
              <div className="absolute -top-3 left-4 px-2 bg-slate-200 text-slate-500 text-[10px] font-bold uppercase rounded tracking-wider">
                Container Context
              </div>

              <div
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className={`
                  ${localData.height} 
                  ${localData.width} 
                  ${localData.background} 
                  ${localData.display}
                  relative transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)]
                  border border-transparent hover:border-indigo-400/50
                  shadow-sm hover:shadow-xl hover:shadow-indigo-500/20
                  rounded-lg
                `}
              >
                <div
                  className={`
                  w-full h-full flex items-center justify-center 
                  transition-opacity duration-300
                  ${localData.background === 'transparent' || isBackdrop ? 'opacity-100' : 'opacity-0 hover:opacity-100'}
                `}
                >
                  <div className="flex flex-col items-center gap-1 text-slate-400/80">
                    <span className="text-xs font-mono bg-slate-900/5 px-2 py-0.5 rounded border border-slate-900/5">
                      {localData.width} × {localData.height}
                    </span>
                    {isHovered && <span className="text-[10px] uppercase tracking-widest text-indigo-500 font-bold animate-pulse">Active Area</span>}
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute bottom-4 right-4 text-xs text-slate-400">Live Render Preview</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MutationSection28;
