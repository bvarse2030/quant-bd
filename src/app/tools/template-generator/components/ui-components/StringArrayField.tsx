/*
|-----------------------------------------
| setting up StringArrayField for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

import React, { useState, ChangeEvent } from 'react';
import { FaTrash } from 'react-icons/fa';

interface DataItem {
  id: number;
  title: string;
  quantity: number;
}

const StringArrayField: React.FC = () => {
  const [data, setData] = useState<DataItem[]>([
    { id: 1, title: 'The New Box', quantity: 3 },
    { id: 2, title: 'The New Box', quantity: 3 },
    { id: 3, title: 'The New Box', quantity: 3 },
  ]);

  const [nextId, setNextId] = useState<number>(4);

  const handleTitleChange = (id: number, event: ChangeEvent<HTMLInputElement>) => {
    const newTitle = event.target.value;
    setData(prevData => prevData.map(item => (item.id === id ? { ...item, title: newTitle } : item)));
  };

  const handleQuantityChange = (id: number, event: ChangeEvent<HTMLInputElement>) => {
    const newQuantity = parseInt(event.target.value, 10);
    setData(prevData =>
      prevData.map(item =>
        item.id === id
          ? {
              ...item,
              quantity: isNaN(newQuantity) ? 0 : newQuantity,
            }
          : item,
      ),
    );
  };

  const handleAddListItem = () => {
    setData(prevData => [...prevData, { id: nextId, title: '', quantity: 0 }]);
    setNextId(prevId => prevId + 1);
  };

  const handleDeleteListItem = (id: number) => {
    setData(prevData => prevData.filter(item => item.id !== id));
  };

  return (
    <div className="flex flex-col items-center p-4 min-h-[80vh] bg-gray-800 bg-opacity-50 rounded-lg shadow-lg backdrop-blur-md border border-gray-700 w-full max-w-3xl mx-auto">
      <h1 className="text-2xl text-white mb-4">Data List</h1>

      <div className="flex flex-col gap-4 w-full mb-4">
        <div className="flex items-center gap-2 p-3 bg-gray-700 rounded-md shadow-md hover:bg-gray-600 transition-colors duration-200">
          <span className="text-white text-sm">ID</span>
          <span className="text-white text-sm">Title</span>
          <span className="text-white text-sm">Quantity</span>
        </div>
        {data.map(item => (
          <div key={item.id} className="flex items-center gap-2 p-3 bg-gray-700 rounded-md shadow-md hover:bg-gray-600 transition-colors duration-200">
            <input
              type="text"
              className="flex-1 px-3 py-2 border border-gray-600 rounded-md bg-gray-800 text-white text-sm focus:border-blue-500 focus:outline-none placeholder-gray-400"
              value={item.id}
              readOnly
              onChange={e => handleTitleChange(item.id, e)}
              placeholder="ID"
            />
            <input
              type="text"
              className="flex-1 px-3 py-2 border border-gray-600 rounded-md bg-gray-800 text-white text-sm focus:border-blue-500 focus:outline-none placeholder-gray-400"
              value={item.title}
              onChange={e => handleTitleChange(item.id, e)}
              placeholder="Title"
            />
            <input
              type="number"
              className="w-24 px-3 py-2 border border-gray-600 rounded-md bg-gray-800 text-white text-sm focus:border-blue-500 focus:outline-none placeholder-gray-400"
              value={item.quantity}
              onChange={e => handleQuantityChange(item.id, e)}
              placeholder="Quantity"
            />
            <button
              className="bg-red-500 text-white px-2 py-1 rounded-md hover:bg-red-600 transition-colors duration-200 focus:outline-none"
              onClick={() => handleDeleteListItem(item.id)}
            >
              <FaTrash size={16} />
            </button>
          </div>
        ))}

        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors duration-200 focus:outline-none"
          onClick={handleAddListItem}
        >
          Add Item
        </button>
      </div>
    </div>
  );
};

export default StringArrayField;
