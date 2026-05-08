/*
|-----------------------------------------
| setting up LoadingSkeleton for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

import React from 'react';

const Skeleton = ({ className = '' }) => {
  return (
    <div
      className={`animate-pulse bg-linear-to-r from-slate-200 via-slate-100 to-slate-200 bg-[length:400%_100%] ${className}`}
      style={{
        animation: 'shimmer 2s ease-in-out infinite',
        backgroundImage: 'linear-gradient(90deg, #f1f5f9 0%, #e2e8f0 50%, #f1f5f9 100%)',
      }}
    >
      <style jsx>{`
        @keyframes shimmer {
          0% {
            background-position: 100% 0;
          }
          100% {
            background-position: -100% 0;
          }
        }
      `}</style>
    </div>
  );
};

export default function LoadingSkeleton() {
  const renderContent = (
    <div className="w-full max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <Skeleton className="h-8 w-3/4 max-w-md rounded-lg mb-3" />
        <Skeleton className="h-4 w-1/2 max-w-sm rounded-md" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
            <Skeleton className="h-16 w-16 rounded-full mb-4 mx-auto lg:mx-0" />
            <Skeleton className="h-5 w-full rounded-lg mb-2" />
            <Skeleton className="h-4 w-3/4 rounded-md mb-3" />
            <Skeleton className="h-3 w-1/2 rounded-sm" />
          </div>

          <div className="hidden lg:block space-y-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-3 p-2">
                <Skeleton className="h-4 w-4 rounded-sm" />
                <Skeleton className="h-4 flex-1 rounded-md" />
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-3 space-y-6">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
            <div className="flex flex-col sm:flex-row gap-4">
              <Skeleton className="h-24 w-full sm:w-32 rounded-xl flex-shrink-0" />
              <div className="flex-1 space-y-3">
                <Skeleton className="h-6 w-full max-w-lg rounded-lg" />
                <Skeleton className="h-4 w-full max-w-md rounded-md" />
                <Skeleton className="h-4 w-3/4 max-w-sm rounded-md" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl p-5 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-3">
                  <Skeleton className="h-12 w-12 rounded-lg flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-5 w-full rounded-md" />
                    <Skeleton className="h-3 w-4/5 rounded-sm" />
                    <Skeleton className="h-3 w-3/5 rounded-sm" />
                  </div>
                </div>

                <div className="mt-4 flex justify-between items-center">
                  <Skeleton className="h-3 w-16 rounded-sm" />
                  <Skeleton className="h-7 w-20 rounded-full" />
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-xl border border-slate-100 divide-y divide-slate-100">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="p-4 flex items-center gap-4">
                <Skeleton className="h-10 w-10 rounded-full flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-full max-w-sm rounded-md" />
                  <Skeleton className="h-3 w-3/4 max-w-xs rounded-sm" />
                </div>
                <div className="hidden sm:flex items-center gap-3">
                  <Skeleton className="h-3 w-16 rounded-sm" />
                  <Skeleton className="h-6 w-6 rounded-md" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
        <Skeleton className="h-10 w-full sm:w-32 rounded-lg" />
        <Skeleton className="h-10 w-full sm:w-32 rounded-lg" />
      </div>
    </div>
  );

  return <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 py-8">{renderContent}</div>;
}
