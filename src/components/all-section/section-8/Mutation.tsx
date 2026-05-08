/*
|-----------------------------------------
| setting up Mutation for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

'use client';

import {
  X,
  Save,
  Plus,
  Globe,
  Clock,
  Award,
  MapPin,
  Trash2,
  BookOpen,
  Settings2,
  Briefcase,
  Building2,
  DollarSign,
  ChevronDown,
  GraduationCap,
} from 'lucide-react';
import Image from 'next/image';
import { useState, useEffect } from 'react';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import ImageUploadManagerSingle from '@/components/dashboard-ui/ImageUploadManagerSingle';

import type { ISection8Data } from './data';
import { defaultDataSection8 } from './data';

export interface Section8FormProps {
  data?: ISection8Data;
  onSubmit: (values: ISection8Data) => void;
}

const MutationSection8 = ({ data, onSubmit }: Section8FormProps) => {
  const [formData, setFormData] = useState<ISection8Data>({ ...defaultDataSection8 });
  const [cityInput, setCityInput] = useState('');
  const [expandedUni, setExpandedUni] = useState<string | null>(defaultDataSection8.universitys[0]?.id || null);

  useEffect(() => {
    if (data && typeof data !== 'string') {
      setFormData(data);
    }
  }, [data]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateRootField = (field: keyof ISection8Data, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addCity = () => {
    if (cityInput.trim()) {
      updateRootField('city', [...formData.city, cityInput.trim()]);
      setCityInput('');
    }
  };

  const removeCity = (index: number) => {
    updateRootField(
      'city',
      formData.city.filter((_, i) => i !== index),
    );
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleUniversityChange = (index: number, field: keyof ISection8Data['universitys'][0], value: any) => {
    const updatedUnis = [...formData.universitys];
    updatedUnis[index] = { ...updatedUnis[index], [field]: value };
    updateRootField('universitys', updatedUnis);
  };

  const addUniversity = () => {
    const newUni = {
      id: `UNI-${Date.now()}`,
      name: 'New University',
      image: '',
      location: formData.city[0] || '',
      description: '',
      courses: [],
    };
    updateRootField('universitys', [newUni, ...formData.universitys]);
    setExpandedUni(newUni.id);
  };

  const removeUniversity = (index: number) => {
    const updatedUnis = formData.universitys.filter((_, i) => i !== index);
    updateRootField('universitys', updatedUnis);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleCourseChange = (uniIndex: number, courseIndex: number, field: string, value: any) => {
    const updatedUnis = [...formData.universitys];
    const targetUni = { ...updatedUnis[uniIndex] };
    const updatedCourses = [...targetUni.courses];

    updatedCourses[courseIndex] = { ...updatedCourses[courseIndex], [field]: value };
    targetUni.courses = updatedCourses;
    updatedUnis[uniIndex] = targetUni;

    updateRootField('universitys', updatedUnis);
  };

  const handleApplyParamChange = (uniIndex: number, courseIndex: number, paramIndex: number, value: string) => {
    const updatedUnis = [...formData.universitys];
    const targetUni = { ...updatedUnis[uniIndex] };
    const updatedCourses = [...targetUni.courses];

    const newParams = [...updatedCourses[courseIndex].applyBtnParms];
    newParams[paramIndex] = value;

    updatedCourses[courseIndex] = { ...updatedCourses[courseIndex], applyBtnParms: newParams };
    targetUni.courses = updatedCourses;
    updatedUnis[uniIndex] = targetUni;

    updateRootField('universitys', updatedUnis);
  };

  const handleApplyParamDegreeLevelChange = (uniIndex: number, courseIndex: number, paramIndex: number, value: string) => {
    const updatedUnis = [...formData.universitys];
    const targetUni = { ...updatedUnis[uniIndex] };
    const updatedCourses = [...targetUni.courses];

    const currentParams = updatedCourses[courseIndex].applyBtnParmsDegreeLevel || [];
    const newParams = [...currentParams];

    while (newParams.length <= paramIndex) {
      newParams.push('');
    }

    newParams[paramIndex] = value;

    updatedCourses[courseIndex] = { ...updatedCourses[courseIndex], applyBtnParmsDegreeLevel: newParams };
    targetUni.courses = updatedCourses;
    updatedUnis[uniIndex] = targetUni;

    updateRootField('universitys', updatedUnis);
  };

  const addApplyParamDegreeLevel = (uniIndex: number, courseIndex: number) => {
    const updatedUnis = [...formData.universitys];
    const targetUni = { ...updatedUnis[uniIndex] };
    const updatedCourses = [...targetUni.courses];

    const currentParams = updatedCourses[courseIndex].applyBtnParmsDegreeLevel || [];
    updatedCourses[courseIndex] = {
      ...updatedCourses[courseIndex],
      applyBtnParmsDegreeLevel: [...currentParams, 'New Param'],
    };

    targetUni.courses = updatedCourses;
    updatedUnis[uniIndex] = targetUni;
    updateRootField('universitys', updatedUnis);
  };

  const removeApplyParamDegreeLevel = (uniIndex: number, courseIndex: number, paramIndex: number) => {
    const updatedUnis = [...formData.universitys];
    const targetUni = { ...updatedUnis[uniIndex] };
    const updatedCourses = [...targetUni.courses];

    const currentParams = updatedCourses[courseIndex].applyBtnParmsDegreeLevel || [];
    updatedCourses[courseIndex] = {
      ...updatedCourses[courseIndex],
      applyBtnParmsDegreeLevel: currentParams.filter((_, i) => i !== paramIndex),
    };

    targetUni.courses = updatedCourses;
    updatedUnis[uniIndex] = targetUni;
    updateRootField('universitys', updatedUnis);
  };

  const addCourse = (uniIndex: number) => {
    const updatedUnis = [...formData.universitys];
    const targetUni = { ...updatedUnis[uniIndex] };

    const newCourse = {
      id: `CRS-${Date.now()}`,
      name: 'New Course',
      tutionFees: '',
      duration: '',
      description: '',
      degreeLevelInfo: [],
      applyBtnParms: [formData.country, targetUni.location, targetUni.name, 'New Course'],
      applyBtnParmsDegreeLevel: ['Degree', 'Level', 'Param'],
    };

    targetUni.courses = [...targetUni.courses, newCourse];
    updatedUnis[uniIndex] = targetUni;

    updateRootField('universitys', updatedUnis);
  };

  const removeCourse = (uniIndex: number, courseIndex: number) => {
    const updatedUnis = [...formData.universitys];
    const targetUni = { ...updatedUnis[uniIndex] };

    targetUni.courses = targetUni.courses.filter((_, i) => i !== courseIndex);
    updatedUnis[uniIndex] = targetUni;

    updateRootField('universitys', updatedUnis);
  };

  const addDegreeLevelInfo = (uniIndex: number, courseIndex: number) => {
    const updatedUnis = [...formData.universitys];
    const targetUni = { ...updatedUnis[uniIndex] };
    const updatedCourses = [...targetUni.courses];
    const targetCourse = { ...updatedCourses[courseIndex] };

    const newDegreeInfo = {
      id: `DL-${Date.now()}`,
      degreeLevel: 'Bachelor',
      tutionFees: '',
      duration: '',
    };

    targetCourse.degreeLevelInfo = [...(targetCourse.degreeLevelInfo || []), newDegreeInfo];
    updatedCourses[courseIndex] = targetCourse;
    targetUni.courses = updatedCourses;
    updatedUnis[uniIndex] = targetUni;

    updateRootField('universitys', updatedUnis);
  };

  const removeDegreeLevelInfo = (uniIndex: number, courseIndex: number, degreeIndex: number) => {
    const updatedUnis = [...formData.universitys];
    const targetUni = { ...updatedUnis[uniIndex] };
    const updatedCourses = [...targetUni.courses];
    const targetCourse = { ...updatedCourses[courseIndex] };

    targetCourse.degreeLevelInfo = (targetCourse.degreeLevelInfo || []).filter((_, i) => i !== degreeIndex);
    updatedCourses[courseIndex] = targetCourse;
    targetUni.courses = updatedCourses;
    updatedUnis[uniIndex] = targetUni;

    updateRootField('universitys', updatedUnis);
  };

  const updateDegreeLevelInfo = (uniIndex: number, courseIndex: number, degreeIndex: number, field: string, value: string) => {
    const updatedUnis = [...formData.universitys];
    const targetUni = { ...updatedUnis[uniIndex] };
    const updatedCourses = [...targetUni.courses];
    const targetCourse = { ...updatedCourses[courseIndex] };
    const updatedDegreeInfos = [...(targetCourse.degreeLevelInfo || [])];

    updatedDegreeInfos[degreeIndex] = { ...updatedDegreeInfos[degreeIndex], [field]: value };

    targetCourse.degreeLevelInfo = updatedDegreeInfos;
    updatedCourses[courseIndex] = targetCourse;
    targetUni.courses = updatedCourses;
    updatedUnis[uniIndex] = targetUni;

    updateRootField('universitys', updatedUnis);
  };

  const toggleExpand = (id: string) => {
    setExpandedUni(expandedUni === id ? null : id);
  };

  const handleSave = () => {
    onSubmit(formData);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-4 md:p-8 font-sans selection:bg-indigo-500/30">
      <div className="max-w-7xl mx-auto bg-zinc-900/50 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-sm">
        <div className="p-6 border-b border-zinc-800 bg-zinc-900/80 backdrop-blur flex items-center gap-3 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/5 to-violet-600/5 pointer-events-none" />
          <div className="p-2 bg-indigo-500/10 rounded-lg border border-indigo-500/20 z-10">
            <Globe className="text-indigo-400" size={24} />
          </div>
          <div className="z-10">
            <h2 className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">Edit Study Destinations</h2>
            <p className="text-zinc-400 text-sm">Manage countries, cities, and associated universities.</p>
          </div>
        </div>

        <div className="p-6 md:p-8 grid grid-cols-1 xl:grid-cols-3 gap-8">
          <div className="xl:col-span-1 space-y-6">
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
                <MapPin size={16} /> Regional Settings
              </h3>

              <div className="bg-zinc-950/50 p-5 rounded-xl border border-zinc-800/50 space-y-5 shadow-inner">
                <div className="space-y-2">
                  <Label className="text-zinc-400 text-xs font-medium">Country Name</Label>
                  <div className="relative group">
                    <Globe className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500 group-hover:text-indigo-400 transition-colors" />
                    <Input
                      value={formData.country}
                      onChange={e => updateRootField('country', e.target.value)}
                      className="bg-zinc-900 border-zinc-800 pl-9 focus:border-indigo-500 transition-all duration-300 focus:ring-1 focus:ring-indigo-500/20"
                      placeholder="e.g. Australia"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="text-zinc-400 text-xs font-medium">Popular Cities</Label>
                  <div className="flex gap-2">
                    <Input
                      value={cityInput}
                      onChange={e => setCityInput(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addCity())}
                      className="bg-zinc-900 border-zinc-800 focus:border-indigo-500 transition-all"
                      placeholder="Add city..."
                    />
                    <Button onClick={addCity} className="bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-900/20">
                      <Plus size={16} />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.city.map((item, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1.5 px-3 py-1 bg-zinc-800/50 text-zinc-200 rounded-md text-xs font-medium border border-zinc-700 hover:border-indigo-500/30 hover:bg-zinc-800 transition-colors"
                      >
                        {item}
                        <button onClick={() => removeCity(idx)} className="text-zinc-500 hover:text-red-400 transition-colors ml-1">
                          <X size={12} />
                        </button>
                      </span>
                    ))}
                    {formData.city.length === 0 && <span className="text-zinc-600 text-xs italic p-1">No cities added yet.</span>}
                  </div>
                </div>
              </div>
            </div>

            <div className="sticky top-6 bg-gradient-to-br from-indigo-900/10 via-zinc-900/50 to-violet-900/10 border border-indigo-500/10 rounded-xl p-6 text-center space-y-4 backdrop-blur-md">
              <div className="w-12 h-12 bg-indigo-500/10 rounded-full flex items-center justify-center mx-auto text-indigo-400 ring-4 ring-indigo-500/5">
                <Building2 size={24} />
              </div>
              <div>
                <h3 className="text-base font-semibold text-zinc-200">Universities</h3>
                <p className="text-zinc-500 text-xs mt-1">
                  You have <span className="text-indigo-400 font-bold">{formData.universitys.length}</span> universities listed.
                </p>
              </div>
              <Button
                onClick={addUniversity}
                variant="outline"
                className="w-full bg-zinc-900/80 border-indigo-500/30 text-indigo-300 hover:bg-indigo-500 hover:text-white transition-all hover:shadow-lg hover:shadow-indigo-500/20"
              >
                <Plus className="mr-2 h-4 w-4" /> Add University
              </Button>
            </div>
          </div>

          <div className="xl:col-span-2 space-y-6">
            <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
              <Building2 size={16} /> University List
            </h3>

            {formData.universitys.length === 0 && (
              <div className="text-center py-16 bg-zinc-950/30 border border-dashed border-zinc-800 rounded-2xl flex flex-col items-center justify-center gap-3">
                <div className="h-12 w-12 rounded-full bg-zinc-900 flex items-center justify-center">
                  <Building2 className="text-zinc-700" size={24} />
                </div>
                <p className="text-zinc-500 text-sm">No universities added yet.</p>
                <Button onClick={addUniversity} variant="link" className="text-indigo-400 hover:text-indigo-300">
                  Add your first university
                </Button>
              </div>
            )}

            <div className="space-y-4">
              {formData.universitys.map((uni, index) => (
                <div
                  key={uni.id}
                  className={`
                    group bg-zinc-950/30 border rounded-2xl overflow-hidden transition-all duration-300
                    ${expandedUni === uni.id ? 'border-indigo-500/30 ring-1 ring-indigo-500/10 bg-zinc-900/40 shadow-xl' : 'border-zinc-800/50 hover:border-zinc-700 hover:bg-zinc-900/20'}
                  `}
                >
                  <div className="p-4 flex items-center justify-between cursor-pointer select-none" onClick={() => toggleExpand(uni.id)}>
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-xl bg-zinc-900 flex items-center justify-center border border-zinc-800 overflow-hidden shrink-0 shadow-sm group-hover:border-zinc-700 transition-colors">
                        {uni.image ? (
                          <Image width={100} height={100} src={uni.image} alt="logo" className="w-full h-full object-cover" />
                        ) : (
                          <Building2 size={20} className="text-zinc-600" />
                        )}
                      </div>
                      <div>
                        <h3 className={`text-base font-medium transition-colors ${expandedUni === uni.id ? 'text-indigo-200' : 'text-zinc-200'}`}>
                          {uni.name || 'Untitled University'}
                        </h3>
                        {uni.location ? (
                          <p className="text-zinc-500 text-xs flex items-center gap-1 mt-0.5">
                            <MapPin size={10} /> {uni.location}
                          </p>
                        ) : (
                          <p className="text-zinc-600 text-xs italic mt-0.5">No location set</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-zinc-500 hover:text-red-400 hover:bg-red-500/10 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={e => {
                          e.stopPropagation();
                          removeUniversity(index);
                        }}
                      >
                        <Trash2 size={14} />
                      </Button>
                      <div
                        className={`p-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-500 transition-transform duration-300 ${expandedUni === uni.id ? 'rotate-180 text-indigo-400 border-indigo-500/30' : ''}`}
                      >
                        <ChevronDown size={14} />
                      </div>
                    </div>
                  </div>

                  {expandedUni === uni.id && (
                    <div className="p-5 pt-0 border-t border-zinc-800/50 animate-in slide-in-from-top-2 fade-in duration-300">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-5">
                        <div className="space-y-5">
                          <div className="space-y-2">
                            <Label className="text-zinc-400 text-xs font-medium">Institution Name</Label>
                            <div className="relative group/input">
                              <Building2 className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500 group-hover/input:text-indigo-400 transition-colors" />
                              <Input
                                value={uni.name}
                                onChange={e => handleUniversityChange(index, 'name', e.target.value)}
                                className="bg-zinc-900 border-zinc-800 pl-9"
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label className="text-zinc-400 text-xs font-medium flex items-center gap-2">
                              Location <span className="text-zinc-600 text-[10px] font-normal">(Select from cities)</span>
                            </Label>
                            <div className="relative group/select">
                              <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500 z-10 group-hover/select:text-indigo-400 transition-colors" />
                              <select
                                value={uni.location}
                                onChange={e => handleUniversityChange(index, 'location', e.target.value)}
                                className="w-full bg-zinc-900 border border-zinc-800 text-zinc-200 text-sm rounded-md h-10 pl-9 pr-10 appearance-none focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-all cursor-pointer hover:bg-zinc-900/80"
                              >
                                <option value="" disabled className="bg-zinc-900 text-zinc-500">
                                  Select a city...
                                </option>
                                {formData.city.map((city, idx) => (
                                  <option key={idx} value={city} className="bg-zinc-900 text-zinc-200 py-2">
                                    {city}
                                  </option>
                                ))}
                                {formData.city.length === 0 && (
                                  <option value="" disabled className="bg-zinc-900 text-zinc-500">
                                    No cities added in regional settings
                                  </option>
                                )}
                              </select>
                              <ChevronDown className="absolute right-3 top-3 h-4 w-4 text-zinc-500 pointer-events-none" />
                            </div>
                            {formData.city.length === 0 && (
                              <p className="text-[10px] text-amber-500/80 mt-1 pl-1">* Add cities in the regional settings sidebar first.</p>
                            )}
                          </div>

                          <div className="space-y-2">
                            <Label className="text-zinc-400 text-xs font-medium">Description</Label>
                            <Textarea
                              value={uni.description}
                              onChange={e => handleUniversityChange(index, 'description', e.target.value)}
                              className="bg-zinc-900 border-zinc-800 min-h-[100px] resize-none focus:ring-1 focus:ring-indigo-500"
                              placeholder="Brief description of the university..."
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label className="text-zinc-400 text-xs font-medium">Thumbnail Image</Label>
                          <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-4 hover:border-zinc-700 transition-colors">
                            <ImageUploadManagerSingle value={uni.image} onChange={url => handleUniversityChange(index, 'image', url)} />
                          </div>
                        </div>
                      </div>

                      <div className="mt-8 space-y-4">
                        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                          <div className="flex items-center gap-2 text-zinc-300 uppercase text-xs font-bold tracking-widest">
                            <GraduationCap size={16} className="text-indigo-400" />
                            <span>Available Courses ({uni.courses.length})</span>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => addCourse(index)}
                            className="bg-zinc-900 border-zinc-800 text-zinc-300 hover:bg-indigo-500 hover:text-white h-8 text-xs transition-all"
                          >
                            <Plus size={12} className="mr-1.5" /> Add Course
                          </Button>
                        </div>

                        <div className="grid gap-4">
                          {uni.courses.map((course, cIndex) => (
                            <div
                              key={course.id}
                              className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 relative group hover:border-zinc-600 transition-all duration-300 shadow-sm"
                            >
                              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => removeCourse(index, cIndex)}
                                  className="h-7 w-7 text-zinc-500 hover:text-red-400 hover:bg-red-500/10"
                                >
                                  <Trash2 size={13} />
                                </Button>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                                <div className="space-y-1.5">
                                  <Label className="text-[10px] text-zinc-500 uppercase font-semibold">Course Name</Label>
                                  <div className="relative">
                                    <Briefcase className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-zinc-600" />
                                    <Input
                                      value={course.name}
                                      onChange={e => handleCourseChange(index, cIndex, 'name', e.target.value)}
                                      className="bg-zinc-900 border-zinc-800 pl-8 h-9 text-sm"
                                    />
                                  </div>
                                </div>
                                <div className="space-y-1.5">
                                  <Label className="text-[10px] text-zinc-500 uppercase font-semibold">Duration (Avg)</Label>
                                  <div className="relative">
                                    <Clock className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-zinc-600" />
                                    <Input
                                      value={course.duration}
                                      onChange={e => handleCourseChange(index, cIndex, 'duration', e.target.value)}
                                      className="bg-zinc-900 border-zinc-800 pl-8 h-9 text-sm"
                                    />
                                  </div>
                                </div>
                                <div className="space-y-1.5">
                                  <Label className="text-[10px] text-zinc-500 uppercase font-semibold">Tuition Fees (Avg)</Label>
                                  <div className="relative">
                                    <DollarSign className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-zinc-600" />
                                    <Input
                                      value={course.tutionFees}
                                      onChange={e => handleCourseChange(index, cIndex, 'tutionFees', e.target.value)}
                                      className="bg-zinc-900 border-zinc-800 pl-8 h-9 text-sm"
                                    />
                                  </div>
                                </div>
                                <div className="space-y-1.5">
                                  <Label className="text-[10px] text-zinc-500 uppercase font-semibold">Description</Label>
                                  <div className="relative">
                                    <BookOpen className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-zinc-600" />
                                    <Input
                                      value={course.description}
                                      onChange={e => handleCourseChange(index, cIndex, 'description', e.target.value)}
                                      className="bg-zinc-900 border-zinc-800 pl-8 h-9 text-sm"
                                    />
                                  </div>
                                </div>
                              </div>

                              <div className="pt-3 border-t border-zinc-800/50 mt-3 space-y-4">
                                <div className="space-y-2">
                                  <div className="flex items-center justify-between">
                                    <Label className="text-[10px] font-bold text-zinc-500 flex items-center gap-2 uppercase tracking-wide">
                                      <Award size={12} className="text-indigo-400" /> Degree Levels Info
                                    </Label>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => addDegreeLevelInfo(index, cIndex)}
                                      className="h-6 text-[10px] text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/10 px-2"
                                    >
                                      <Plus size={10} className="mr-1" /> Add Level
                                    </Button>
                                  </div>

                                  <div className="space-y-2">
                                    {(course.degreeLevelInfo || []).map((degreeInfo, dIdx) => (
                                      <div
                                        key={degreeInfo.id}
                                        className="grid grid-cols-12 gap-2 bg-zinc-900/50 p-2 rounded-lg border border-zinc-800/50 hover:border-zinc-700 transition-colors relative group/degree"
                                      >
                                        <div className="col-span-4">
                                          <Input
                                            placeholder="Degree (e.g. Master)"
                                            value={degreeInfo.degreeLevel}
                                            onChange={e => updateDegreeLevelInfo(index, cIndex, dIdx, 'degreeLevel', e.target.value)}
                                            className="h-7 text-xs bg-zinc-950 border-zinc-800 px-2"
                                          />
                                        </div>
                                        <div className="col-span-3">
                                          <Input
                                            placeholder="Fees"
                                            value={degreeInfo.tutionFees}
                                            onChange={e => updateDegreeLevelInfo(index, cIndex, dIdx, 'tutionFees', e.target.value)}
                                            className="h-7 text-xs bg-zinc-950 border-zinc-800 px-2"
                                          />
                                        </div>
                                        <div className="col-span-4">
                                          <Input
                                            placeholder="Duration"
                                            value={degreeInfo.duration}
                                            onChange={e => updateDegreeLevelInfo(index, cIndex, dIdx, 'duration', e.target.value)}
                                            className="h-7 text-xs bg-zinc-950 border-zinc-800 px-2"
                                          />
                                        </div>
                                        <div className="col-span-1 flex justify-center">
                                          <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => removeDegreeLevelInfo(index, cIndex, dIdx)}
                                            className="h-7 w-7 text-zinc-600 hover:text-red-400 hover:bg-red-500/10"
                                          >
                                            <Trash2 size={12} />
                                          </Button>
                                        </div>
                                      </div>
                                    ))}
                                    {(!course.degreeLevelInfo || course.degreeLevelInfo.length === 0) && (
                                      <div className="text-center py-2 border border-dashed border-zinc-800 rounded bg-zinc-900/20">
                                        <p className="text-[10px] text-zinc-600">No specific degree levels added.</p>
                                      </div>
                                    )}
                                  </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-zinc-800/50">
                                  <div className="space-y-2">
                                    <Label className="text-[10px] font-bold text-zinc-600 block flex items-center gap-2">
                                      <div className="w-1.5 h-1.5 rounded-full bg-zinc-700" /> APPLY BTN PARAMS
                                    </Label>
                                    <div className="grid grid-cols-2 gap-2">
                                      {course.applyBtnParms.map((param, pIdx) => (
                                        <Input
                                          key={`std-${pIdx}`}
                                          value={param}
                                          onChange={e => handleApplyParamChange(index, cIndex, pIdx, e.target.value)}
                                          className="bg-zinc-900 border-zinc-800/50 h-7 text-xs text-zinc-500 focus:text-zinc-300"
                                          placeholder={`Param ${pIdx + 1}`}
                                        />
                                      ))}
                                    </div>
                                  </div>

                                  <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                      <Label className="text-[10px] font-bold text-zinc-600 block flex items-center gap-2">
                                        <Settings2 size={10} /> DEGREE PARAMS
                                      </Label>
                                      <div className="flex gap-1">
                                        <Button size="sm" variant="ghost" className="h-5 w-5 p-0" onClick={() => addApplyParamDegreeLevel(index, cIndex)}>
                                          <Plus size={10} className="text-zinc-500" />
                                        </Button>
                                      </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                      {(course.applyBtnParmsDegreeLevel || []).map((param, pIdx) => (
                                        <div key={`deg-${pIdx}`} className="relative group/param">
                                          <Input
                                            value={param}
                                            onChange={e => handleApplyParamDegreeLevelChange(index, cIndex, pIdx, e.target.value)}
                                            className="bg-zinc-900 border-zinc-800/50 h-7 text-xs text-zinc-500 focus:text-zinc-300 pr-5"
                                            placeholder={`Param ${pIdx + 1}`}
                                          />
                                          <button
                                            onClick={() => removeApplyParamDegreeLevel(index, cIndex, pIdx)}
                                            className="absolute right-1 top-1.5 text-zinc-600 hover:text-red-400 opacity-0 group-hover/param:opacity-100 transition-opacity"
                                          >
                                            <X size={10} />
                                          </button>
                                        </div>
                                      ))}
                                      {(!course.applyBtnParmsDegreeLevel || course.applyBtnParmsDegreeLevel.length === 0) && (
                                        <div className="col-span-2 text-[10px] text-zinc-700 italic text-center py-1">No params</div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                          {uni.courses.length === 0 && (
                            <div className="text-center py-6 bg-zinc-900/30 rounded-xl border border-dashed border-zinc-800">
                              <p className="text-zinc-600 text-xs">No courses listed yet.</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-zinc-800 bg-zinc-900/80 backdrop-blur flex justify-between items-center">
          <p className="text-xs text-zinc-500 hidden sm:block">
            Last updated: <span className="text-zinc-400">Just now</span>
          </p>
          <Button onClick={handleSave} className="bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-900/20 border border-indigo-500/20">
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MutationSection8;
