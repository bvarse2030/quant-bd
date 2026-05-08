/*
|-----------------------------------------
| setting up Mutation for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

'use client';

import { motion } from 'framer-motion';
import React, { useState, useEffect } from 'react';
import { MapPin, Plus, Trash2, Save, Edit3, Eye, Phone, Mail, User, Clock, Layers, X, Crosshair, Sparkles } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ImageUploadManagerSingle from '@/components/dashboard-ui/ImageUploadManagerSingle';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import QuerySection18 from './Query';
import { OfficeLocation, defaultDataSection18 } from './data';

export interface Section18FormProps {
  data?: OfficeLocation[];
  onSubmit: (values: OfficeLocation[]) => void;
}

const MutationSection18 = ({ data, onSubmit }: Section18FormProps) => {
  const [locations, setLocations] = useState<OfficeLocation[]>(defaultDataSection18);
  const [activeId, setActiveId] = useState<string>('');
  const [newFeature, setNewFeature] = useState('');

  useEffect(() => {
    if (data && Array.isArray(data) && data.length > 0) {
      setLocations(data);
      if (!data.find(l => l.id === activeId)) {
        setActiveId(data[0].id);
      }
    } else {
      setLocations(defaultDataSection18);
      setActiveId(defaultDataSection18[0].id);
    }
  }, [data, activeId]);

  const activeLocation = locations.find(l => l.id === activeId) || locations[0];
  const activeIndex = locations.findIndex(l => l.id === activeId);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateField = (field: keyof OfficeLocation, value: any) => {
    const updated = [...locations];
    updated[activeIndex] = { ...updated[activeIndex], [field]: value };
    setLocations(updated);
  };

  const updateContact = (field: keyof OfficeLocation['contact'], value: string) => {
    const updated = [...locations];
    updated[activeIndex] = {
      ...updated[activeIndex],
      contact: { ...updated[activeIndex].contact, [field]: value },
    };
    setLocations(updated);
  };

  const updateCoords = (field: 'lat' | 'lng', value: string) => {
    const numValue = parseFloat(value);
    const updated = [...locations];
    updated[activeIndex] = {
      ...updated[activeIndex],
      coordinates: { ...updated[activeIndex].coordinates, [field]: isNaN(numValue) ? 0 : numValue },
    };
    setLocations(updated);
  };

  const addFeature = () => {
    if (!newFeature.trim()) return;
    const updated = [...locations];
    updated[activeIndex] = {
      ...updated[activeIndex],
      features: [...updated[activeIndex].features, newFeature.trim()],
    };
    setLocations(updated);
    setNewFeature('');
  };

  const removeFeature = (featureIndex: number) => {
    const updated = [...locations];
    const newFeatures = updated[activeIndex].features.filter((_, i) => i !== featureIndex);
    updated[activeIndex] = { ...updated[activeIndex], features: newFeatures };
    setLocations(updated);
  };

  const handleAddLocation = () => {
    const newLoc: OfficeLocation = {
      id: `loc-${Date.now()}`,
      name: 'New Location',
      type: 'Headquarters',
      address: 'Address Line',
      city: 'City',
      country: 'Country',
      coordinates: { lat: 0, lng: 0 },
      contact: { email: '', phone: '', manager: '' },
      image: '',
      description: 'Location description...',
      features: [],
      schedule: 'Mon-Fri, 9am - 5pm',
    };
    setLocations([...locations, newLoc]);
    setActiveId(newLoc.id);
  };

  const handleDeleteLocation = (id: string) => {
    if (locations.length <= 1) return;
    const filtered = locations.filter(l => l.id !== id);
    setLocations(filtered);
    if (activeId === id) setActiveId(filtered[0].id);
  };

  if (!activeLocation) return <div className="p-8 text-white">Loading editor...</div>;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans p-4 md:p-8 pb-32 relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-5%] w-[40vw] h-[40vw] bg-blue-900/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[40vw] h-[40vw] bg-indigo-900/10 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto space-y-8 relative z-10">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          <div className="xl:col-span-3 space-y-4">
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-4 flex flex-col gap-3 h-[calc(100vh-200px)] backdrop-blur-sm shadow-xl">
              <Button onClick={handleAddLocation} className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-900/20">
                <Plus size={16} className="mr-2" /> Add Location
              </Button>

              <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                {locations.map(loc => (
                  <div
                    key={loc.id}
                    onClick={() => setActiveId(loc.id)}
                    className={`group relative p-3 rounded-xl border cursor-pointer transition-all ${
                      activeId === loc.id ? 'bg-blue-500/10 border-blue-500/50 shadow-md' : 'bg-zinc-900/50 border-zinc-800 hover:border-zinc-700'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className={`text-sm font-bold ${activeId === loc.id ? 'text-white' : 'text-zinc-300'}`}>{loc.city}</h4>
                        <p className="text-xs text-zinc-500">{loc.name}</p>
                      </div>
                      <Badge variant="outline" className="text-[10px] bg-black/20 text-zinc-400 border-zinc-700">
                        {loc.type}
                      </Badge>
                    </div>
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        handleDeleteLocation(loc.id);
                      }}
                      className="absolute bottom-2 right-2 p-1.5 rounded-full text-zinc-500 hover:text-red-400 hover:bg-red-500/10 opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="xl:col-span-9">
            <Tabs defaultValue="edit" className="w-full">
              <div className="flex justify-center md:justify-start mb-6">
                <TabsList className="bg-zinc-900/50 border border-zinc-800 p-1 rounded-2xl backdrop-blur-md h-auto inline-flex">
                  <TabsTrigger
                    value="edit"
                    className="gap-2 px-6 py-2.5 rounded-xl data-[state=active]:bg-blue-600 data-[state=active]:text-white text-zinc-400 transition-all"
                  >
                    <Edit3 size={14} /> Edit Details
                  </TabsTrigger>
                  <TabsTrigger
                    value="preview"
                    className="gap-2 px-6 py-2.5 rounded-xl data-[state=active]:bg-blue-600 data-[state=active]:text-white text-zinc-400 transition-all"
                  >
                    <Eye size={14} /> Live Preview
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="edit" className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-6 space-y-4 backdrop-blur-sm shadow-xl">
                    <Label className="text-zinc-500 text-xs uppercase font-bold tracking-wider">Location Image</Label>
                    <div className="aspect-video w-full rounded-xl border border-zinc-800 bg-zinc-950/50 overflow-hidden relative group">
                      <ImageUploadManagerSingle value={activeLocation.image} onChange={url => updateField('image', url)} />
                    </div>
                  </div>

                  <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-6 space-y-5 backdrop-blur-sm shadow-xl">
                    <div className="space-y-2">
                      <Label className="text-zinc-500 text-xs uppercase font-bold tracking-wider">Internal Name</Label>
                      <Input
                        value={activeLocation.name}
                        onChange={e => updateField('name', e.target.value)}
                        className="bg-zinc-950/50 border-zinc-800 focus:border-blue-500/50 h-10"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-zinc-500 text-xs uppercase font-bold tracking-wider">City</Label>
                        <Input
                          value={activeLocation.city}
                          onChange={e => updateField('city', e.target.value)}
                          className="bg-zinc-950/50 border-zinc-800 focus:border-blue-500/50 h-10"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-zinc-500 text-xs uppercase font-bold tracking-wider">Country</Label>
                        <Input
                          value={activeLocation.country}
                          onChange={e => updateField('country', e.target.value)}
                          className="bg-zinc-950/50 border-zinc-800 focus:border-blue-500/50 h-10"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-zinc-500 text-xs uppercase font-bold tracking-wider">Facility Type</Label>
                      <Select value={activeLocation.type} onValueChange={val => updateField('type', val)}>
                        <SelectTrigger className="bg-zinc-950/50 border-zinc-800 h-10 focus:border-blue-500/50">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-zinc-900 border-zinc-800">
                          <SelectItem value="Headquarters">Headquarters</SelectItem>
                          <SelectItem value="Research Lab">Research Lab</SelectItem>
                          <SelectItem value="Data Center">Data Center</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-1 bg-zinc-900/50 border border-zinc-800 rounded-3xl p-6 space-y-4 backdrop-blur-sm shadow-xl">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-zinc-800/50 pb-3">
                      <MapPin size={14} className="text-blue-500" /> Location Data
                    </h3>
                    <div className="space-y-2">
                      <Label className="text-zinc-500 text-xs tracking-wider font-bold">Full Address</Label>
                      <Textarea
                        value={activeLocation.address}
                        onChange={e => updateField('address', e.target.value)}
                        className="bg-zinc-950/50 border-zinc-800 min-h-[80px] text-xs focus:border-blue-500/50"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-2">
                        <Label className="text-zinc-500 text-xs flex gap-1 font-mono">
                          <Crosshair size={10} /> LAT
                        </Label>
                        <Input
                          type="number"
                          value={activeLocation.coordinates.lat}
                          onChange={e => updateCoords('lat', e.target.value)}
                          className="bg-zinc-950/50 border-zinc-800 text-xs h-8 font-mono focus:border-blue-500/50"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-zinc-500 text-xs flex gap-1 font-mono">
                          <Crosshair size={10} /> LNG
                        </Label>
                        <Input
                          type="number"
                          value={activeLocation.coordinates.lng}
                          onChange={e => updateCoords('lng', e.target.value)}
                          className="bg-zinc-950/50 border-zinc-800 text-xs h-8 font-mono focus:border-blue-500/50"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-1 bg-zinc-900/50 border border-zinc-800 rounded-3xl p-6 space-y-4 backdrop-blur-sm shadow-xl">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-zinc-800/50 pb-3">
                      <User size={14} className="text-blue-500" /> Contact Person
                    </h3>
                    <div className="space-y-2">
                      <Label className="text-zinc-500 text-xs tracking-wider font-bold">Manager Name</Label>
                      <Input
                        value={activeLocation.contact.manager}
                        onChange={e => updateContact('manager', e.target.value)}
                        className="bg-zinc-950/50 border-zinc-800 h-9 focus:border-blue-500/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-zinc-500 text-xs flex gap-1 tracking-wider font-bold">
                        <Mail size={12} /> Email
                      </Label>
                      <Input
                        value={activeLocation.contact.email}
                        onChange={e => updateContact('email', e.target.value)}
                        className="bg-zinc-950/50 border-zinc-800 h-9 focus:border-blue-500/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-zinc-500 text-xs flex gap-1 tracking-wider font-bold">
                        <Phone size={12} /> Phone
                      </Label>
                      <Input
                        value={activeLocation.contact.phone}
                        onChange={e => updateContact('phone', e.target.value)}
                        className="bg-zinc-950/50 border-zinc-800 h-9 focus:border-blue-500/50"
                      />
                    </div>
                  </div>

                  <div className="lg:col-span-1 bg-zinc-900/50 border border-zinc-800 rounded-3xl p-6 space-y-4 backdrop-blur-sm shadow-xl">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-zinc-800/50 pb-3">
                      <Layers size={14} className="text-blue-500" /> Additional Info
                    </h3>
                    <div className="space-y-2">
                      <Label className="text-zinc-500 text-xs flex gap-1 tracking-wider font-bold">
                        <Clock size={12} /> Hours / Schedule
                      </Label>
                      <Input
                        value={activeLocation.schedule}
                        onChange={e => updateField('schedule', e.target.value)}
                        className="bg-zinc-950/50 border-zinc-800 h-9 focus:border-blue-500/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-zinc-500 text-xs tracking-wider font-bold">Description</Label>
                      <Textarea
                        value={activeLocation.description}
                        onChange={e => updateField('description', e.target.value)}
                        className="bg-zinc-950/50 border-zinc-800 min-h-[100px] text-sm focus:border-blue-500/50 resize-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-6 backdrop-blur-sm shadow-xl">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-4 border-b border-zinc-800/50 pb-3">
                    <Layers size={14} className="text-blue-500" /> Key Features
                  </h3>
                  <div className="flex gap-2 mb-4">
                    <Input
                      value={newFeature}
                      onChange={e => setNewFeature(e.target.value)}
                      placeholder="Add a facility feature (e.g. 'Rooftop Helipad')"
                      className="bg-zinc-950/50 border-zinc-800 max-w-sm h-10 focus:border-blue-500/50"
                      onKeyDown={e => e.key === 'Enter' && addFeature()}
                    />
                    <Button onClick={addFeature} size="icon" className="bg-zinc-800 hover:bg-zinc-700 text-white h-10 w-10">
                      <Plus size={16} />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {activeLocation.features.map((feature, i) => (
                      <Badge
                        key={i}
                        className="bg-blue-500/10 text-blue-300 border-blue-500/20 px-3 py-1.5 flex items-center gap-2 hover:bg-blue-500/20 transition-colors"
                      >
                        {feature}
                        <button onClick={() => removeFeature(i)} className="hover:text-white transition-colors">
                          <X size={12} />
                        </button>
                      </Badge>
                    ))}
                    {activeLocation.features.length === 0 && <span className="text-zinc-500 text-xs italic py-2">No features added yet.</span>}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="preview" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="border border-zinc-800 rounded-3xl overflow-hidden bg-black relative shadow-2xl">
                  <QuerySection18 data={JSON.stringify(locations)} />
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      <div className="fixed bottom-6 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, type: 'spring' }}
          className="bg-zinc-900/80 backdrop-blur-xl border border-white/10 p-2 rounded-2xl shadow-2xl shadow-black/50 pointer-events-auto flex items-center gap-4"
        >
          <div className="hidden md:flex flex-col px-4 border-r border-white/10 pr-6 mr-2">
            <span className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles size={14} className="text-blue-400" />
              Editing Mode
            </span>
            <span className="text-xs text-zinc-400">Section 18: Locations</span>
          </div>
          <Button
            onClick={() => onSubmit(locations)}
            className="bg-white text-zinc-950 hover:bg-blue-50 hover:text-blue-900 px-8 py-6 rounded-xl font-bold transition-all hover:scale-105 active:scale-95 shadow-lg"
          >
            <Save className="w-5 h-5 mr-2" />
            Save Changes
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default MutationSection18;
