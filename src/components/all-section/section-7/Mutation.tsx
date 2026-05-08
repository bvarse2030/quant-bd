/*
|-----------------------------------------
| setting up Mutation for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

'use client';

import { useState, useEffect } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import ImageUploadManagerSingle from '@/components/dashboard-ui/ImageUploadManagerSingle';

import {
  X,
  Plus,
  Save,
  Users,
  Award,
  MapPin,
  Building2,
  DollarSign,
  CheckCircle2,
  GraduationCap,
  LayoutDashboard,
  MousePointerClick,
  Image as ImageIcon,
} from 'lucide-react';
import type { ISection7Data } from './data';
import { defaultDataSection7 } from './data';

export interface Section7FormProps {
  data?: ISection7Data;
  onSubmit: (values: ISection7Data) => void;
}

const MutationSection7 = ({ data, onSubmit }: Section7FormProps) => {
  const [formData, setFormData] = useState<ISection7Data>({ ...defaultDataSection7 });
  const [programInput, setProgramInput] = useState('');
  const [subjectInput, setSubjectInput] = useState('');
  const [featureInput, setFeatureInput] = useState('');

  useEffect(() => {
    if (data) {
      setFormData({ ...data });
    }
  }, [data]);

  const updateField = (field: keyof ISection7Data, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addArrayItem = (field: 'programs' | 'subjects' | 'features', value: string, setter: (val: string) => void) => {
    if (value.trim()) {
      updateField(field, [...formData[field], value.trim()]);
      setter('');
    }
  };

  const removeArrayItem = (field: 'programs' | 'subjects' | 'features', index: number) => {
    updateField(
      field,
      formData[field].filter((_, i) => i !== index),
    );
  };

  const handleSave = () => {
    onSubmit(formData);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-4 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto bg-zinc-900/50 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-zinc-800 bg-zinc-900/80 backdrop-blur flex items-center gap-3">
          <div className="p-2 bg-blue-500/10 rounded-lg">
            <Building2 className="text-blue-400" size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">Edit University Details</h2>
            <p className="text-zinc-400 text-sm">Manage institutional profile and academic content.</p>
          </div>
        </div>

        <div className="p-6 md:p-8 grid grid-cols-1 xl:grid-cols-3 gap-8">
          <div className="xl:col-span-2 space-y-8">
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
                <LayoutDashboard size={16} /> General Information
              </h3>

              <div className="bg-zinc-950/30 p-4 rounded-xl border border-zinc-800/50 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-zinc-400">University Name</Label>
                    <Input
                      value={formData.universityName}
                      onChange={e => updateField('universityName', e.target.value)}
                      className="bg-zinc-900 border-zinc-800 focus:border-blue-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-zinc-400">Location</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
                      <Input
                        value={formData.location}
                        onChange={e => updateField('location', e.target.value)}
                        className="bg-zinc-900 border-zinc-800 pl-9 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-zinc-400">Description</Label>
                  <Textarea
                    value={formData.description}
                    onChange={e => updateField('description', e.target.value)}
                    className="min-h-[120px] bg-zinc-900 border-zinc-800 focus:border-blue-500 resize-none"
                    placeholder="Detailed overview..."
                  />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
                  <div className="space-y-2">
                    <Label className="text-zinc-500 text-xs">Established</Label>
                    <Input
                      value={formData.established}
                      onChange={e => updateField('established', e.target.value)}
                      className="bg-zinc-900 border-zinc-800 h-9 text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-zinc-500 text-xs">Students</Label>
                    <div className="relative">
                      <Users className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-zinc-600" />
                      <Input
                        value={formData.totalStudents}
                        onChange={e => updateField('totalStudents', e.target.value)}
                        className="bg-zinc-900 border-zinc-800 pl-8 h-9 text-sm"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-zinc-500 text-xs">Rating</Label>
                    <div className="relative">
                      <Award className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-zinc-600" />
                      <Input
                        value={formData.rating}
                        onChange={e => updateField('rating', e.target.value)}
                        className="bg-zinc-900 border-zinc-800 pl-8 h-9 text-sm"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-zinc-500 text-xs">Tuition</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-zinc-600" />
                      <Input
                        value={formData.tuitionFee}
                        onChange={e => updateField('tuitionFee', e.target.value)}
                        className="bg-zinc-900 border-zinc-800 pl-8 h-9 text-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
                <GraduationCap size={16} /> Academic Programs
              </h3>

              <div className="bg-zinc-950/30 p-4 rounded-xl border border-zinc-800/50 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label className="text-zinc-400">Degrees Offered</Label>
                  <div className="flex gap-2">
                    <Input
                      value={programInput}
                      onChange={e => setProgramInput(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addArrayItem('programs', programInput, setProgramInput))}
                      className="bg-zinc-900 border-zinc-800"
                      placeholder="e.g. MBA"
                    />
                    <Button onClick={() => addArrayItem('programs', programInput, setProgramInput)} className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300">
                      <Plus size={16} />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.programs.map((item, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-200 rounded-lg text-sm"
                      >
                        {item}
                        <button onClick={() => removeArrayItem('programs', idx)} className="hover:text-red-400 transition-colors ml-1">
                          <X size={12} />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="text-zinc-400">Major Subjects</Label>
                  <div className="flex gap-2">
                    <Input
                      value={subjectInput}
                      onChange={e => setSubjectInput(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addArrayItem('subjects', subjectInput, setSubjectInput))}
                      className="bg-zinc-900 border-zinc-800"
                      placeholder="e.g. Science"
                    />
                    <Button onClick={() => addArrayItem('subjects', subjectInput, setSubjectInput)} className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300">
                      <Plus size={16} />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.subjects.map((item, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-200 rounded-lg text-sm"
                      >
                        {item}
                        <button onClick={() => removeArrayItem('subjects', idx)} className="hover:text-red-400 transition-colors ml-1">
                          <X size={12} />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
                <ImageIcon size={16} /> Media Assets
              </h3>
              <div className="bg-zinc-950/30 p-4 rounded-xl border border-zinc-800/50 space-y-4">
                <div className="space-y-2">
                  <Label className="text-zinc-400 text-xs">Banner Image</Label>
                  <ImageUploadManagerSingle value={formData.bannerImage} onChange={url => updateField('bannerImage', url)} />
                </div>
                <div className="space-y-2">
                  <Label className="text-zinc-400 text-xs">University Logo</Label>
                  <ImageUploadManagerSingle value={formData.logoUrl} onChange={url => updateField('logoUrl', url)} />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
                <MousePointerClick size={16} /> Actions & Links
              </h3>
              <div className="bg-zinc-950/30 p-4 rounded-xl border border-zinc-800/50 space-y-4">
                <div className="space-y-2">
                  <Label className="text-zinc-400 text-xs">Accreditation</Label>
                  <Input value={formData.accreditation} onChange={e => updateField('accreditation', e.target.value)} className="bg-zinc-900 border-zinc-800" />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2 space-y-1">
                    <Label className="text-zinc-500 text-[10px] uppercase">Primary Button</Label>
                  </div>
                  <div className="space-y-1">
                    <Input
                      placeholder="Text"
                      value={formData.applyText}
                      onChange={e => updateField('applyText', e.target.value)}
                      className="bg-zinc-900 border-zinc-800 text-sm"
                    />
                  </div>
                  <div className="space-y-1">
                    <Input
                      placeholder="URL"
                      value={formData.buttonUrl}
                      onChange={e => updateField('buttonUrl', e.target.value)}
                      className="bg-zinc-900 border-zinc-800 text-sm"
                    />
                  </div>

                  <div className="col-span-2 space-y-1 mt-1">
                    <Label className="text-zinc-500 text-[10px] uppercase">Secondary Button</Label>
                  </div>
                  <div className="space-y-1">
                    <Input
                      placeholder="Text"
                      value={formData.buttonText || ''}
                      onChange={e => updateField('buttonText', e.target.value)}
                      className="bg-zinc-900 border-zinc-800 text-sm"
                    />
                  </div>
                  <div className="space-y-1">
                    <Input
                      placeholder="URL"
                      value={formData.websiteUrl}
                      onChange={e => updateField('websiteUrl', e.target.value)}
                      className="bg-zinc-900 border-zinc-800 text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
                <CheckCircle2 size={16} /> Key Features
              </h3>
              <div className="bg-zinc-950/30 p-4 rounded-xl border border-zinc-800/50 space-y-3">
                <div className="flex gap-2">
                  <Input
                    value={featureInput}
                    onChange={e => setFeatureInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addArrayItem('features', featureInput, setFeatureInput))}
                    className="bg-zinc-900 border-zinc-800"
                    placeholder="Add feature..."
                  />
                  <Button onClick={() => addArrayItem('features', featureInput, setFeatureInput)} className="bg-emerald-600 hover:bg-emerald-500">
                    <Plus size={16} />
                  </Button>
                </div>
                <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
                  {formData.features.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center p-2 rounded-lg bg-zinc-900/50 border border-zinc-800/50">
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <span className="text-sm text-zinc-300">{item}</span>
                      </div>
                      <button onClick={() => removeArrayItem('features', idx)} className="text-zinc-500 hover:text-red-400 transition-colors">
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                  {formData.features.length === 0 && <p className="text-xs text-zinc-500 italic p-1">No features added yet.</p>}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-zinc-800 bg-zinc-900/80 backdrop-blur flex justify-end">
          <Button onClick={handleSave} variant="outlineGlassy" size="sm">
            <Save className="w-5 h-5 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MutationSection7;
