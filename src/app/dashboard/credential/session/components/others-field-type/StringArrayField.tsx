/*
|-----------------------------------------
| setting up StringArrayField for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

import { v4 as uuidv4 } from 'uuid';
import { FaTrash } from 'react-icons/fa';
import React, { ChangeEvent, useState } from 'react';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

import { StringArrayData } from './types';

interface StringArrayFieldProps {
  value: StringArrayData[];
  onChange: (newValue: StringArrayData[]) => void;
}

const StringArrayField: React.FC<StringArrayFieldProps> = ({ value, onChange }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editList, setEditList] = useState<StringArrayData[]>(value);

  React.useEffect(() => {
    setEditList(value);
  }, [value]);

  const handleNameChange = (id: string, e: ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setEditList(prev => prev.map(item => (item._id === id ? { ...item, Name: newTitle } : item)));
  };

  const handleClassChange = (id: string, e: ChangeEvent<HTMLInputElement>) => {
    const newClass = e.target.value;
    setEditList(prev => prev.map(item => (item._id === id ? { ...item, Class: newClass } : item)));
  };

  const handleRollChange = (id: string, e: ChangeEvent<HTMLInputElement>) => {
    const newRoll = parseInt(e.target.value, 10);
    setEditList(prev => prev.map(item => (item._id === id ? { ...item, Roll: isNaN(newRoll) ? 0 : newRoll } : item)));
  };

  const handleAddListItem = () => {
    const nextId = uuidv4();
    const newItem: StringArrayData = {
      _id: nextId.toString(),
      Name: '',
      Class: '',
      Roll: 0,
    };
    setEditList([...editList, newItem]);
  };

  const handleDeleteListItem = (id: string) => {
    setEditList(prev => prev.filter(item => item._id !== id));
  };

  const handleSubmit = () => {
    onChange(editList);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditList(value);
    setIsEditing(false);
  };

  return (
    <div className="flex flex-col items-center w-full p-4 rounded-xl border border-white/20 bg-white/10 backdrop-blur-xl shadow-lg">
      <h2 className="text-white text-lg md:text-xl mb-3 font-semibold text-center drop-shadow-sm">Students List</h2>

      {!isEditing && (
        <div className="w-full space-y-3">
          {value?.length === 0 ? (
            <p className="text-white/60 text-sm text-center">Nothing found.</p>
          ) : (
            value?.map(item => (
              <div key={item._id} className="flex justify-between items-center p-3 rounded-lg bg-white/10 backdrop-blur-lg border border-white/10 shadow-md">
                <span className="text-white text-sm">{item.Name || 'Untitled'}</span>
                <span className="text-white/70 text-sm">
                  Class: {item.Class || '—'} • Roll: {item.Roll || '—'}
                </span>
              </div>
            ))
          )}

          <div className="w-full flex items-center justify-center">
            <Button variant="outlineGarden" onClick={() => setIsEditing(true)} size="sm">
              Update
            </Button>
          </div>
        </div>
      )}

      {isEditing && (
        <div className="flex flex-col gap-3 w-full mt-2">
          {editList?.length === 0 && <p className="text-white/60 text-sm text-center">No students yet — add some below.</p>}

          {editList?.map(item => (
            <div
              key={item._id}
              className="flex flex-col sm:flex-row items-center gap-2 p-3 bg-white/10 border border-white/20 backdrop-blur-xl rounded-lg shadow-md"
            >
              <Input type="text" value={item.Name} onChange={e => handleNameChange(item._id!, e)} placeholder="Student Name" />
              <Input type="text" value={item.Class} onChange={e => handleClassChange(item._id!, e)} placeholder="Class" />
              <Input type="number" value={item.Roll} onChange={e => handleRollChange(item._id!, e)} placeholder="Roll" />
              <FaTrash
                size={14}
                onClick={() => handleDeleteListItem(item._id!)}
                className="cursor-pointer text-rose-400 hover:text-rose-300 duration-300 min-w-[12px]"
              />
            </div>
          ))}

          <div className="flex gap-2 mt-2">
            <Button variant="outlineWater" onClick={handleAddListItem} size="sm">
              + Add
            </Button>
            <Button variant="outlineWater" onClick={handleSubmit} size="sm">
              Submit
            </Button>
            <Button variant="outlineFire" onClick={handleCancel} size="sm" className="text-white">
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StringArrayField;
