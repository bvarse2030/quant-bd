/*
|-----------------------------------------
| setting up LoadingServerSkeleton for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

import React from 'react';

const LoadingServerComponent = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-500 via-purple-500 to-indigo-500 p-4 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-linear-to-br from-cyan-400/20 to-transparent rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-linear-to-tl from-pink-400/20 to-transparent rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: '1s', animationDuration: '3s' }}
        />
      </div>

      <div className="relative z-10 w-full max-w-6xl">
        <div className="backdrop-blur-xl bg-white/10 rounded-3xl shadow-2xl border border-white/20 p-6 md:p-8 lg:p-12">
          <div className="space-y-8">
            <div className="flex flex-col items-center space-y-6">
              <div className="relative">
                <div className="w-32 h-32 rounded-full bg-linear-to-br from-blue-500/30 to-purple-600/30 animate-pulse" />
                <div className="absolute top-0 right-0 w-10 h-10 rounded-full bg-white/20 animate-pulse" style={{ animationDelay: '0.2s' }} />
                <div className="absolute bottom-0 left-0 w-8 h-8 rounded-full bg-white/20 animate-pulse" style={{ animationDelay: '0.4s' }} />
              </div>

              <div className="w-full space-y-4">
                <div className="h-12 bg-white/20 rounded-xl w-3/4 mx-auto animate-pulse" />
                <div className="h-6 bg-white/15 rounded-lg w-2/3 mx-auto animate-pulse" style={{ animationDelay: '0.1s' }} />
                <div className="h-14 bg-white/20 rounded-xl w-80 max-w-full mx-auto animate-pulse" style={{ animationDelay: '0.2s' }} />
              </div>
            </div>

            <div className="max-w-2xl mx-auto space-y-4">
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6">
                <div className="space-y-3">
                  <div className="h-4 bg-white/20 rounded-full w-full animate-pulse" />
                  <div className="h-4 bg-white/20 rounded-full w-11/12 animate-pulse" style={{ animationDelay: '0.1s' }} />
                  <div className="h-4 bg-white/20 rounded-full w-4/5 animate-pulse" style={{ animationDelay: '0.2s' }} />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="h-12 bg-white/20 rounded-xl animate-pulse" />
                <div
                  className="h-12 bg-linear-to-r from-blue-500/30 via-purple-500/30 to-indigo-500/30 rounded-xl animate-pulse"
                  style={{ animationDelay: '0.15s' }}
                />
              </div>

              <div className="flex justify-center pt-4">
                <div className="h-4 w-56 bg-white/20 rounded-full animate-pulse" style={{ animationDelay: '0.3s' }} />
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-6">
              <div className="space-y-2">
                <div className="h-20 bg-white/20 rounded-xl animate-pulse" />
                <div className="h-4 bg-white/15 rounded w-16 mx-auto animate-pulse" style={{ animationDelay: '0.1s' }} />
              </div>
              <div className="space-y-2">
                <div className="h-20 bg-white/20 rounded-xl animate-pulse" style={{ animationDelay: '0.15s' }} />
                <div className="h-4 bg-white/15 rounded w-16 mx-auto animate-pulse" style={{ animationDelay: '0.25s' }} />
              </div>
              <div className="space-y-2">
                <div className="h-20 bg-white/20 rounded-xl animate-pulse" style={{ animationDelay: '0.2s' }} />
                <div className="h-4 bg-white/15 rounded w-16 mx-auto animate-pulse" style={{ animationDelay: '0.3s' }} />
              </div>
              <div className="space-y-2">
                <div className="h-20 bg-white/20 rounded-xl animate-pulse" style={{ animationDelay: '0.25s' }} />
                <div className="h-4 bg-white/15 rounded w-16 mx-auto animate-pulse" style={{ animationDelay: '0.35s' }} />
              </div>
            </div>
          </div>

          <div
            className="absolute top-10 right-10 w-16 h-16 rounded-full bg-white/10 blur-xl animate-pulse opacity-50"
            style={{ animationDelay: '0.5s', animationDuration: '2s' }}
          />
          <div
            className="absolute bottom-10 left-10 w-20 h-20 rounded-full bg-white/10 blur-xl animate-pulse opacity-50"
            style={{ animationDelay: '1s', animationDuration: '2.5s' }}
          />
        </div>

        <div className="flex justify-center items-center gap-2 mt-8">
          <div className="w-2 h-2 rounded-full bg-white/60 animate-bounce" />
          <div className="w-2 h-2 rounded-full bg-white/60 animate-bounce" style={{ animationDelay: '0.2s' }} />
          <div className="w-2 h-2 rounded-full bg-white/60 animate-bounce" style={{ animationDelay: '0.4s' }} />
        </div>
      </div>
    </div>
  );
};

export default LoadingServerComponent;
