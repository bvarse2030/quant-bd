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
    setEditList(prev =>
      prev.map(item =>
        item._id === id
          ? {
              ...item,
              Class: newClass,
            }
          : item,
      ),
    );
  };

  const handleRollChange = (id: string, e: ChangeEvent<HTMLInputElement>) => {
    const newRoll = parseInt(e.target.value, 10);
    setEditList(prev =>
      prev.map(item =>
        item._id === id
          ? {
              ...item,
              Roll: isNaN(newRoll) ? 0 : newRoll,
            }
          : item,
      ),
    );
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
    <div className="flex flex-col items-center p-4 bg-gray-800/70 rounded-lg shadow-lg border border-gray-700 w-full">
      <h2 className="text-lg md:text-xl text-white mb-3 font-semibold text-center">Students List</h2>

      {!isEditing && (
        <div className="w-full space-y-3">
          {value?.length === 0 ? (
            <p className="text-gray-400 text-sm text-center">Nothing found.</p>
          ) : (
            value?.map(item => (
              <div key={item._id} className="flex justify-between items-center p-3 bg-gray-700 rounded-md shadow-md">
                <span className="text-white text-sm">{item.Name || 'Untitled'}</span>
                <span className="text-gray-300 text-sm">
                  Class: {item.Class || 'Untitled'}
                  Roll: {item.Roll || 'Untitled'}
                </span>
              </div>
            ))
          )}

          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors duration-200 w-full mt-3"
            onClick={() => setIsEditing(true)}
          >
            Update
          </button>
        </div>
      )}

      {isEditing && (
        <div className="flex flex-col gap-3 w-full mt-2">
          {editList?.length === 0 && <p className="text-gray-400 text-sm text-center">No students yet — add some below.</p>}

          {editList?.map(item => (
            <div
              key={item._id}
              className="flex flex-col sm:flex-row items-center gap-2 p-3 bg-gray-700 rounded-md shadow-md hover:bg-gray-600 transition-colors duration-200"
            >
              <input
                type="text"
                className="flex-1 px-3 py-2 border border-gray-600 rounded-md bg-gray-800 text-white text-sm focus:border-blue-500 focus:outline-none placeholder-gray-400"
                value={item.Name}
                onChange={e => handleNameChange(item._id!, e)}
                placeholder="Student Name"
              />
              <input
                type="number"
                className="w-full sm:w-24 px-3 py-2 border border-gray-600 rounded-md bg-gray-800 text-white text-sm focus:border-blue-500 focus:outline-none placeholder-gray-400"
                value={item.Class}
                onChange={e => handleClassChange(item._id!, e)}
                placeholder="Class"
              />
              <input
                type="text"
                className="w-full sm:w-24 px-3 py-2 border border-gray-600 rounded-md bg-gray-800 text-white text-sm focus:border-blue-500 focus:outline-none placeholder-gray-400"
                value={item.Roll}
                onChange={e => handleRollChange(item._id!, e)}
                placeholder="Roll"
              />
              <button
                className="bg-red-500 text-white px-3 py-2 rounded-md hover:bg-red-600 transition-colors duration-200 focus:outline-none"
                onClick={() => handleDeleteListItem(item._id!)}
              >
                <FaTrash size={14} />
              </button>
            </div>
          ))}

          <div className="flex gap-2 mt-2">
            <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors duration-200 flex-1" onClick={handleAddListItem}>
              + Add
            </button>
            <button className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors duration-200 flex-1" onClick={handleSubmit}>
              Submit
            </button>
            <button className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors duration-200 flex-1" onClick={handleCancel}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StringArrayField;
