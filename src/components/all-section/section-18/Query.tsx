/*
|-----------------------------------------
| setting up Query for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

'use client';

import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import React, { useState, useEffect, useMemo } from 'react';
import { Maximize2, Minimize2, ExternalLink, MapPin, Phone, Mail, Clock, Globe2, Navigation, ArrowRight, Copy } from 'lucide-react';

import { cn } from '@/lib/utils';

import { defaultDataSection18, mapStyles, OfficeLocation } from './data';

interface LocationListProps {
  locations: OfficeLocation[];
  activeId: string;
  onSelect: (id: string) => void;
}

const LocationList = ({ locations, activeId, onSelect }: LocationListProps) => {
  return (
    <div className="space-y-3">
      {locations.map(loc => {
        const isActive = activeId === loc.id;
        return (
          <motion.button
            key={loc.id}
            onClick={() => onSelect(loc.id)}
            className={cn(
              'w-full text-left relative p-4 rounded-xl border transition-all duration-300 group overflow-hidden',
              isActive ? 'bg-purple-500/10 border-purple-500/50' : 'bg-zinc-900/50 border-white/5 hover:border-white/20',
            )}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            {isActive && <motion.div layoutId="activeGlow" className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-transparent opacity-50" />}

            <div className="relative z-10 flex items-start gap-4">
              <div
                className={cn(
                  'p-3 rounded-lg flex-shrink-0 transition-colors',
                  isActive ? 'bg-purple-500 text-white' : 'bg-zinc-800 text-zinc-400 group-hover:bg-zinc-700 group-hover:text-white',
                )}
              >
                <MapPin className="w-5 h-5" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <h3 className={cn('font-bold text-lg mb-1 truncate', isActive ? 'text-white' : 'text-zinc-300')}>{loc.city}</h3>
                  {isActive && (
                    <motion.span
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-[10px] font-bold uppercase tracking-wider bg-purple-500 text-white px-2 py-0.5 rounded-full"
                    >
                      Active
                    </motion.span>
                  )}
                </div>
                <p className="text-sm text-zinc-500 font-medium mb-2 truncate">{loc.name}</p>
                <div className="flex items-center gap-2 text-xs text-zinc-600">
                  <Globe2 className="w-3 h-3" />
                  <span className="truncate">{loc.country}</span>
                </div>
              </div>
            </div>
          </motion.button>
        );
      })}
    </div>
  );
};

const LocationDetails = ({ activeLocation }: { activeLocation: OfficeLocation }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = (text?: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 mt-6">
      <h4 className="text-sm font-bold text-zinc-400 uppercase tracking-widest mb-6 border-b border-white/5 pb-4">Secure Link</h4>

      <div className="space-y-6">
        <div className="flex items-center gap-4 group cursor-pointer" onClick={() => handleCopy(activeLocation.contact?.phone)}>
          <div className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 group-hover:text-white group-hover:border-purple-500 transition-colors">
            <Phone className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs text-zinc-500 mb-0.5">Secure Line</p>
            <p className="text-white font-mono hover:text-purple-400 transition-colors">{activeLocation.contact?.phone}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 group cursor-pointer" onClick={() => handleCopy(activeLocation.contact?.email)}>
          <div className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 group-hover:text-white group-hover:border-purple-500 transition-colors">
            <Mail className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs text-zinc-500 mb-0.5">Encrypted Mail</p>
            <p className="text-white font-mono hover:text-purple-400 transition-colors">{activeLocation.contact?.email}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs text-zinc-500 mb-0.5">Operations</p>
            <p className="text-zinc-300 text-sm">{activeLocation.schedule}</p>
          </div>
        </div>
      </div>

      <div className="mt-8 flex gap-3">
        <button className="flex-1 bg-white text-black font-bold py-3 rounded-xl hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2 text-sm">
          <Navigation className="w-4 h-4" />
          Get Directions
        </button>
        <button
          onClick={() => handleCopy(activeLocation.address)}
          className="px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-white hover:bg-zinc-800 transition-colors flex items-center gap-2"
        >
          {copied ? <ArrowRight className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
};

interface QuerySection18Props {
  data?: OfficeLocation[] | string;
}

export default function QuerySection18({ data }: QuerySection18Props) {
  const locations: OfficeLocation[] = useMemo(() => {
    if (!data) return defaultDataSection18;
    try {
      return typeof data === 'string' ? JSON.parse(data) : data;
    } catch (e) {
      console.error('Failed to parse section data', e);
      return defaultDataSection18;
    }
  }, [data]);

  const [activeId, setActiveId] = useState<string>(locations[0]?.id || '');
  const [isExpanded, setIsExpanded] = useState(false);
  const [iframeKey, setIframeKey] = useState(0);

  const activeLocation = useMemo(() => locations.find(l => l.id === activeId) || locations[0], [locations, activeId]);

  useEffect(() => {
    setIframeKey(prev => prev + 1);
  }, [activeId]);

  return (
    <div
      className={cn(
        'min-h-screen bg-[#050505] text-zinc-100 font-sans selection:bg-purple-500/30 overflow-hidden flex flex-col',
        isExpanded ? 'h-screen fixed inset-0 z-50' : 'relative',
      )}
    >
      <main className="flex-1 relative flex flex-col lg:flex-row min-h-[calc(100vh-64px)]">
        <motion.aside
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className={cn(
            'lg:w-[450px] bg-[#050505] border-r border-white/5 flex flex-col z-30 relative shadow-2xl transition-all duration-300',
            isExpanded ? 'hidden lg:hidden' : 'block',
          )}
        >
          <div className="p-6 overflow-y-auto custom-scrollbar flex-1 h-full max-h-[calc(100vh-120px)]">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">Our Locations</h1>
              <p className="text-zinc-400 text-sm">Global infrastructure nodes powering the decentralized web. Select a hub to initiate connection.</p>
            </div>

            <LocationList locations={locations} activeId={activeId} onSelect={setActiveId} />

            <LocationDetails activeLocation={activeLocation} />

            <div className="mt-8 relative aspect-video rounded-2xl overflow-hidden border border-white/10 group">
              {activeLocation.image && (
                <Image
                  src={activeLocation.image}
                  alt={activeLocation.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-4">
                <p className="text-sm font-medium text-white">{activeLocation.name} Interior View</p>
              </div>
            </div>
          </div>

          <div className="p-4 border-t border-white/5 bg-zinc-900/20 text-center">
            <p className="text-[10px] text-zinc-600 uppercase tracking-widest">Section 15 Protocol • Secure Connection</p>
          </div>
        </motion.aside>

        <div className="flex-1 relative bg-zinc-900 overflow-hidden min-h-[500px]">
          <div className="absolute top-6 right-6 z-20 flex flex-col gap-2">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-3 bg-black/80 backdrop-blur-md border border-white/10 rounded-xl text-white hover:bg-purple-600 hover:border-purple-500 transition-all shadow-lg"
            >
              {isExpanded ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
            </button>
            <button className="p-3 bg-black/80 backdrop-blur-md border border-white/10 rounded-xl text-white hover:bg-zinc-800 transition-all shadow-lg">
              <ExternalLink className="w-5 h-5" />
            </button>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeLocation.id}
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="absolute top-6 left-6 z-20 hidden md:block"
            >
              <div className="bg-black/80 backdrop-blur-xl border-l-4 border-purple-500 pl-4 py-2 pr-6 rounded-r-xl shadow-2xl">
                <p className="text-xs font-bold text-purple-400 uppercase tracking-wider mb-1">Current Coordinates</p>
                <p className="text-xl font-mono text-white">
                  {activeLocation.coordinates.lat.toFixed(4)}° N, {Math.abs(activeLocation.coordinates.lng).toFixed(4)}° W
                </p>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="absolute inset-0 z-0">
            <iframe
              key={iframeKey}
              width="100%"
              height="100%"
              style={{ filter: mapStyles.darkFilter, opacity: 0.85 }}
              src={`https://maps.google.com/maps?q=${activeLocation.coordinates.lat},${activeLocation.coordinates.lng}&z=14&output=embed`}
              title="Google Map"
              className="w-full h-full grayscale transition-opacity duration-500 ease-in-out border-0"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />

            <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-transparent to-[#050505]/50" />
            <div className="absolute inset-0 pointer-events-none bg-purple-900/5 mix-blend-overlay" />

            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
              <motion.div
                animate={{ scale: [1, 3], opacity: [0.5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-24 h-24 rounded-full border border-purple-500/50 bg-purple-500/10"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <MapPin className="w-8 h-8 text-purple-500 fill-purple-500 drop-shadow-[0_0_10px_rgba(168,85,247,0.8)]" />
              </div>
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black via-black/80 to-transparent z-10 pointer-events-none">
            <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 pointer-events-auto">
              {activeLocation.features.map((feature, i) => (
                <motion.div
                  key={`${activeId}-${feature}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-zinc-900/80 backdrop-blur-md border border-white/5 p-4 rounded-xl flex items-center gap-3 hover:border-purple-500/30 transition-colors"
                >
                  <div className="w-2 h-2 bg-purple-500 rounded-full shadow-[0_0_8px_#a855f7]" />
                  <span className="text-sm font-medium text-zinc-200">{feature}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
