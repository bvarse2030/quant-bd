/*
|-----------------------------------------
| setting up JsonValue for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

'use client';

import React, { useState } from 'react';

import { Button } from '@/components/ui/button';

const SuccessPopup = ({ isVisible, message }: { isVisible: boolean; message: string }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-2 duration-300">
      <div className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg border border-green-400 flex items-center gap-2">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
        </svg>
        <span className="font-medium">{message}</span>
      </div>
    </div>
  );
};

const JsonEditor: React.FC = () => {
  const [jsonInput, setJsonInput] = useState<string>(
    JSON.stringify({
      id: '1234',
      title: ' The Name of Country',
      parent: {
        id: '111234',
        title: ' The Name of Parent',
        child: {
          id: '1234',
          title: ' The Name of Child',
          child: '',
          note: 'The Note',
        },
        note: 'The Note',
      },
      note: 'The Note',
    }),
  );
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>('');

  const showSuccess = (message: string) => {
    setSuccessMessage(message);
    setShowSuccessPopup(true);
    setTimeout(() => setShowSuccessPopup(false), 1000);
  };

  const handleSave = async () => {
    setError('');
    setIsLoading(true);

    try {
      const parsedJson = JSON.parse(jsonInput);

      const schema = parsedJson.schema;
      if (!schema || typeof schema !== 'object') {
        setError('Validation Error: The JSON must include a "schema" object.');
        setIsLoading(false);
        return;
      }
      showSuccess('JSON saved successfully!');
    } catch (err: unknown) {
      setError(`Invalid JSON format. Please check your syntax. ${err}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setJsonInput(e.target.value);
    if (error) setError('');
  };

  const handleFormat = () => {
    try {
      const parsedJson = JSON.parse(jsonInput);
      const formattedJson = JSON.stringify(parsedJson, null, 2);
      setJsonInput(formattedJson);
      showSuccess('JSON formatted successfully!');
    } catch (error) {
      console.error('Invalid JSON input:', error);
      setError('Invalid JSON input');
    }
  };
  return (
    <>
      <SuccessPopup isVisible={showSuccessPopup} message={successMessage} />

      <div className="w-full mx-auto p-6">
        <div className="rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6 bg-white dark:bg-gray-800 transition-all duration-300 hover:shadow-xl">
          <div className="w-full flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4 bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text">JSON Editor</h2>
          </div>

          <div className="space-y-6">
            <div className="relative">
              <textarea
                id="json-input"
                value={jsonInput}
                onChange={handleInputChange}
                className="w-full dark:text-gray-100 h-64 p-4 border dark:bg-gray-900 border-gray-300 dark:border-gray-600 rounded-lg font-mono text-sm resize-vertical focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-blue-300 dark:hover:border-blue-600"
                placeholder="Enter your JSON data here..."
              />
              {isLoading && (
                <div className="absolute inset-0 bg-white dark:bg-gray-900 bg-opacity-50 flex items-center justify-center rounded-lg backdrop-blur-sm">
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                    <span className="text-blue-600 font-medium">{isLoading ? 'Saving...' : 'Generating...'}</span>
                  </div>
                </div>
              )}
            </div>

            {error && (
              <div className="text-red-600 text-sm bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800 animate-in slide-in-from-top-2 duration-300">
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <span>{error}</span>
                </div>
              </div>
            )}

            <div className="flex gap-4 flex-wrap">
              <Button
                onClick={handleSave}
                disabled={isLoading || !jsonInput.trim()}
                className="px-6 py-2 bg-linear-to-r from-blue-600 to-blue-700 text-white font-medium rounded-lg hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg"
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Saving...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3-3m0 0l-3 3m3-3v12"
                      ></path>
                    </svg>
                    <span>Save</span>
                  </div>
                )}
              </Button>

              <Button
                onClick={handleFormat}
                className="px-6 py-2 bg-linear-to-r from-green-600 to-green-700 text-white font-medium rounded-lg hover:from-green-700 hover:to-green-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg"
              >
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path>
                  </svg>
                  <span>Format</span>
                </div>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default JsonEditor;
