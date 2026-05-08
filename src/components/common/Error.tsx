/*
|-----------------------------------------
| setting up Error for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

import { motion, AnimatePresence } from 'framer-motion';
import React, { useState, useEffect, useCallback } from 'react';

import { SerializedError } from '@reduxjs/toolkit';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';

type CustomErrorType = {
  data: unknown;
  message: string;
  status: number;
};
interface ErrorMessageProps {
  message: string | FetchBaseQueryError | SerializedError | CustomErrorType;
  type?: 'warning' | 'error' | 'critical';
  dismissible?: boolean;
  autoHideDuration?: number | null;
  showIcon?: boolean;
  onDismiss?: () => void;
}

const colorScheme = {
  warning: { bg: 'bg-amber-50', border: 'border-amber-500', text: 'text-amber-800', icon: 'text-amber-500', button: 'text-amber-500 hover:text-amber-700' },
  error: { bg: 'bg-red-50', border: 'border-red-500', text: 'text-red-800', icon: 'text-red-500', button: 'text-red-500 hover:text-red-700' },
  critical: { bg: 'bg-rose-100', border: 'border-rose-600', text: 'text-rose-900', icon: 'text-rose-600', button: 'text-rose-600 hover:text-rose-800' },
};

const icons = {
  warning: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
      />
    </svg>
  ),
  error: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  critical: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
};

const ErrorMessageComponent: React.FC<ErrorMessageProps> = ({
  message,
  type = 'error',
  dismissible = true,
  autoHideDuration = 5000,
  showIcon = true,
  onDismiss,
}) => {
  const [isVisible, setIsVisible] = useState(true);

  const handleDismiss = useCallback(() => {
    setIsVisible(false);
    onDismiss?.();
  }, [onDismiss]);

  useEffect(() => {
    if (autoHideDuration && isVisible) {
      const timer = setTimeout(handleDismiss, autoHideDuration);
      return () => clearTimeout(timer);
    }
  }, [autoHideDuration, isVisible, handleDismiss]);

  const getDisplayMessage = (error: string | FetchBaseQueryError | SerializedError): string => {
    if (typeof error === 'object' && error !== null && 'message' in error) {
      console.log('error: 1');
      const customErrorMessage = error as CustomErrorType;
      return `Error: ${customErrorMessage.message}`;
    }
    if (typeof error === 'string') {
      console.log('error: 2');
      return error;
    }

    if (typeof error === 'object' && error !== null && 'status' in error) {
      const fetchError = error as FetchBaseQueryError;
      if (typeof fetchError.status === 'number') {
        return `Error ${fetchError.status}: ${JSON.stringify(fetchError.data)}`;
      } else {
        console.log('error: 5');
        return `Error: ${fetchError.error}`;
      }
    }

    if (typeof error === 'object' && error !== null && 'message' in error) {
      console.log('error: 6');
      const serializedError = error as SerializedError;
      return `Error: ${serializedError.message}`;
    }

    return 'An unknown error occurred.';
  };

  const displayMessage = getDisplayMessage(message);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.3 }}
          className={`w-full rounded-lg border-l-4 p-4 shadow-md mb-4 ${colorScheme[type].bg} ${colorScheme[type].border}`}
        >
          <div className="flex items-start">
            {showIcon && <motion.div className={`mr-3 flex-shrink-0 ${colorScheme[type].icon}`}>{icons[type]}</motion.div>}
            <div className="flex-grow">
              <motion.div className={`text-sm md:text-base ${colorScheme[type].text}`}>{displayMessage}</motion.div>
            </div>
            {dismissible && (
              <button onClick={handleDismiss} className={`ml-3 flex-shrink-0 ${colorScheme[type].button} transition-colors duration-200`} aria-label="Dismiss">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
          {autoHideDuration && (
            <motion.div className="mt-2 h-1 w-full bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: '100%' }}
                animate={{ width: '0%' }}
                transition={{ duration: autoHideDuration / 1000, ease: 'linear' }}
                className={`h-full ${colorScheme[type].border.replace('border', 'bg')}`}
              />
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ErrorMessageComponent;
