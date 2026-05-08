/*
|-----------------------------------------
| setting up Mutation for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

'use client';

import { useState, useEffect } from 'react';
import { LayoutTemplate, Save, Plus, Trash2, Clock } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

import { ISection38Data, defaultDataSection38, ICourseCard } from './data';

export interface SectionFormProps {
  data?: ISection38Data;
  onSubmit: (values: ISection38Data) => void;
}

const MutationSection38 = ({ data, onSubmit }: SectionFormProps) => {
  const [formData, setFormData] = useState<ISection38Data>({ ...defaultDataSection38 });

  useEffect(() => {
    if (data) {
      setFormData({
        ...defaultDataSection38,
        ...data,
        courses: data.courses || defaultDataSection38.courses,
      });
    }
  }, [data]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateField = (field: keyof ISection38Data, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    onSubmit(formData);
  };

  const handleAddCourse = () => {
    const newCourse: ICourseCard = {
      title: 'New Course',
      level: 'General Level',
      levelColorClass: 'bg-zinc-100 text-zinc-700',
      description: 'Course description...',
      features: ['Feature 1', 'Feature 2'],
      duration: '2 Months',
      classes: '20 Classes',
      price: '$100',
      popular: false,
    };
    updateField('courses', [...formData.courses, newCourse]);
  };

  const handleRemoveCourse = (index: number) => {
    const newCourses = formData.courses.filter((_, i) => i !== index);
    updateField('courses', newCourses);
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateCourse = (index: number, field: keyof ICourseCard, value: any) => {
    const newCourses = [...formData.courses];
    newCourses[index] = { ...newCourses[index], [field]: value };
    updateField('courses', newCourses);
  };

  const handleFeatureChange = (courseIndex: number, featureIndex: number, value: string) => {
    const newCourses = [...formData.courses];
    const newFeatures = [...newCourses[courseIndex].features];
    newFeatures[featureIndex] = value;
    newCourses[courseIndex].features = newFeatures;
    updateField('courses', newCourses);
  };

  const addFeature = (courseIndex: number) => {
    const newCourses = [...formData.courses];
    newCourses[courseIndex].features.push('New Feature');
    updateField('courses', newCourses);
  };

  const removeFeature = (courseIndex: number, featureIndex: number) => {
    const newCourses = [...formData.courses];
    newCourses[courseIndex].features = newCourses[courseIndex].features.filter((_, i) => i !== featureIndex);
    updateField('courses', newCourses);
  };

  const handleScheduleChange = (courseIndex: number, scheduleIndex: number, value: string) => {
    const newCourses = [...formData.courses];
    const newSchedule = [...(newCourses[courseIndex].schedule || [])];
    newSchedule[scheduleIndex] = value;
    newCourses[courseIndex].schedule = newSchedule;
    updateField('courses', newCourses);
  };

  const addScheduleItem = (courseIndex: number) => {
    const newCourses = [...formData.courses];
    if (!newCourses[courseIndex].schedule) newCourses[courseIndex].schedule = [];
    newCourses[courseIndex].schedule!.push('New Time Slot');
    updateField('courses', newCourses);
  };

  const removeScheduleItem = (courseIndex: number, scheduleIndex: number) => {
    const newCourses = [...formData.courses];
    if (newCourses[courseIndex].schedule) {
      newCourses[courseIndex].schedule = newCourses[courseIndex].schedule!.filter((_, i) => i !== scheduleIndex);
    }
    updateField('courses', newCourses);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-4 md:p-8 font-sans">
      <div className="max-w-6xl mx-auto bg-zinc-900/50 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-zinc-800 bg-zinc-900/80 backdrop-blur flex items-center gap-3">
          <div className="p-2 bg-indigo-500/10 rounded-lg">
            <LayoutTemplate className="text-indigo-400" size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">Edit Section 38</h2>
            <p className="text-zinc-400 text-sm">Manage pricing cards and course details.</p>
          </div>
        </div>

        <div className="p-6 md:p-8 space-y-8">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-zinc-400">Badge Text</Label>
                <Input
                  value={formData.badgeText}
                  onChange={e => updateField('badgeText', e.target.value)}
                  className="bg-zinc-950/50 border-zinc-800 focus:border-indigo-500"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-zinc-400">Subtitle</Label>
                <Input
                  value={formData.subTitle}
                  onChange={e => updateField('subTitle', e.target.value)}
                  className="bg-zinc-950/50 border-zinc-800 focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="text-zinc-400">Heading Prefix</Label>
                <Input value={formData.headingPrefix} onChange={e => updateField('headingPrefix', e.target.value)} className="bg-zinc-950/50 border-zinc-800" />
              </div>
              <div className="space-y-2">
                <Label className="text-red-400">Heading Highlight</Label>
                <Input
                  value={formData.headingHighlight}
                  onChange={e => updateField('headingHighlight', e.target.value)}
                  className="bg-zinc-950/50 border-zinc-800 focus:border-red-500"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-zinc-400">Heading Suffix</Label>
                <Input value={formData.headingSuffix} onChange={e => updateField('headingSuffix', e.target.value)} className="bg-zinc-950/50 border-zinc-800" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-zinc-400">Tab 1 Label</Label>
                <Input value={formData.tab1Label} onChange={e => updateField('tab1Label', e.target.value)} className="bg-zinc-950/50 border-zinc-800" />
              </div>
              <div className="space-y-2">
                <Label className="text-zinc-400">Tab 2 Label</Label>
                <Input value={formData.tab2Label} onChange={e => updateField('tab2Label', e.target.value)} className="bg-zinc-950/50 border-zinc-800" />
              </div>
            </div>
          </div>

          <div className="h-px bg-zinc-800" />

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <Label className="text-zinc-300 text-lg font-semibold">Courses</Label>
              <Button onClick={handleAddCourse} size="sm" variant="outline" className="border-zinc-700 hover:bg-zinc-800">
                <Plus className="w-4 h-4 mr-2" /> Add Course
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {formData.courses.map((course, idx) => (
                <div key={idx} className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-xl space-y-4 relative group">
                  <button
                    onClick={() => handleRemoveCourse(idx)}
                    className="absolute top-4 right-4 p-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500 hover:text-white opacity-0 group-hover:opacity-100 transition-all z-10"
                  >
                    <Trash2 size={16} />
                  </button>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-xs text-zinc-500">Title</Label>
                      <Input value={course.title} onChange={e => updateCourse(idx, 'title', e.target.value)} className="bg-zinc-950/50 border-zinc-800 h-9" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs text-zinc-500">Price</Label>
                      <Input value={course.price} onChange={e => updateCourse(idx, 'price', e.target.value)} className="bg-zinc-950/50 border-zinc-800 h-9" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs text-zinc-500">Description</Label>
                    <Textarea
                      value={course.description}
                      onChange={e => updateCourse(idx, 'description', e.target.value)}
                      className="bg-zinc-950/50 border-zinc-800 min-h-[60px] text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-xs text-zinc-500">Level Name</Label>
                      <Input value={course.level} onChange={e => updateCourse(idx, 'level', e.target.value)} className="bg-zinc-950/50 border-zinc-800 h-9" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs text-zinc-500">Level Class (Tailwind)</Label>
                      <Input
                        value={course.levelColorClass}
                        onChange={e => updateCourse(idx, 'levelColorClass', e.target.value)}
                        className="bg-zinc-950/50 border-zinc-800 h-9"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-xs text-zinc-500">Duration</Label>
                      <Input
                        value={course.duration}
                        onChange={e => updateCourse(idx, 'duration', e.target.value)}
                        className="bg-zinc-950/50 border-zinc-800 h-9"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs text-zinc-500">Classes</Label>
                      <Input
                        value={course.classes}
                        onChange={e => updateCourse(idx, 'classes', e.target.value)}
                        className="bg-zinc-950/50 border-zinc-800 h-9"
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch checked={course.popular} onCheckedChange={checked => updateCourse(idx, 'popular', checked)} />
                    <Label className="text-sm text-zinc-400">Mark as Popular</Label>
                  </div>

                  <div className="space-y-2 bg-zinc-950/30 p-3 rounded-lg border border-zinc-800/50">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-semibold text-zinc-500">Features</span>
                      <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => addFeature(idx)}>
                        <Plus size={14} />
                      </Button>
                    </div>
                    {course.features.map((feat, fIdx) => (
                      <div key={fIdx} className="flex gap-2 mb-2">
                        <Input
                          value={feat}
                          onChange={e => handleFeatureChange(idx, fIdx, e.target.value)}
                          className="h-7 text-xs bg-zinc-900 border-zinc-800"
                        />
                        <Button size="icon" variant="ghost" className="h-7 w-7 text-zinc-500 hover:text-red-400" onClick={() => removeFeature(idx, fIdx)}>
                          <Trash2 size={12} />
                        </Button>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-2 bg-zinc-950/30 p-3 rounded-lg border border-zinc-800/50">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-semibold text-zinc-500">Schedule (Optional)</span>
                      <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => addScheduleItem(idx)}>
                        <Clock size={14} />
                      </Button>
                    </div>
                    {course.schedule &&
                      course.schedule.map((sch, sIdx) => (
                        <div key={sIdx} className="flex gap-2 mb-2">
                          <Input
                            value={sch}
                            onChange={e => handleScheduleChange(idx, sIdx, e.target.value)}
                            className="h-7 text-xs bg-zinc-900 border-zinc-800"
                          />
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-7 w-7 text-zinc-500 hover:text-red-400"
                            onClick={() => removeScheduleItem(idx, sIdx)}
                          >
                            <Trash2 size={12} />
                          </Button>
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-zinc-800 bg-zinc-900/80 backdrop-blur flex justify-end">
          <Button onClick={handleSave} className="bg-indigo-600 hover:bg-indigo-500 text-white">
            <Save className="w-5 h-5 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MutationSection38;
