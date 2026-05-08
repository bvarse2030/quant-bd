/*
|-----------------------------------------
| setting up Summary for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

'use client';

import { useState } from 'react';
import { Loader2, TrendingUp, Calendar, Activity, BarChart3 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';


import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useGetUsersSummaryQuery } from '@/redux/features/user/userSlice';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface SummaryData {
  overall: {
    totalRecords: number;
    recordsLast24Hours: number;
    recordsLastMonth: number;
  };
  monthlyTable?: Array<Record<string, string | number>>;
  tableSummary?: {
    totalMonths: number;
    [key: string]: number;
  };
  pagination?: {
    currentPage: number;
    limit: number;
    totalMonths: number;
    totalPages: number;
  };
}

const UsersSummary = () => {
  const [page] = useState(1);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const limit = 10;

  const { data, isLoading, isError } = useGetUsersSummaryQuery({ page, limit }, { skip: !isDialogOpen });

  const summaryData: SummaryData | undefined = data?.data;

  const overallStatsData = [
    { name: 'Total Records', value: summaryData?.overall.totalRecords || 0 },
    { name: 'Last 24 Hours', value: summaryData?.overall.recordsLast24Hours || 0 },
    { name: 'Last Month', value: summaryData?.overall.recordsLastMonth || 0 },
  ];

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outlineGlassy" size="sm">
          <TrendingUp className="mr-2 h-4 w-4" />
          Summary
        </Button>
      </DialogTrigger>

      <DialogContent
        className="sm:max-w-6xl mt-[30px] max-h-[90vh rounded-2xl border border-white/20 
                   bg-gradient-to-br from-slate-900/95 via-blue-900/90 to-purple-900/95 
                   backdrop-blur-3xl shadow-2xl text-white"
      >
        <DialogHeader className="space-y-3 pb-1 border-b border-white/10">
          <DialogTitle className="text-3xl font-bold bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Users Analytics Dashboard
          </DialogTitle>
          <DialogDescription className="text-white/60 text-base"></DialogDescription>
        </DialogHeader>
        <ScrollArea className="w-full h-[70vh] pr-4">
          {isLoading && (
            <div className="flex items-center justify-center p-16">
              <div className="text-center space-y-4">
                <Loader2 className="h-12 w-12 animate-spin text-blue-400 mx-auto" />
                <p className="text-white/70">Loading analytics...</p>
              </div>
            </div>
          )}

          {isError && (
            <div className="text-center p-16">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-500/20 mb-4">
                <Activity className="h-8 w-8 text-red-400" />
              </div>
              <p className="text-red-300 text-lg">Failed to load summary data. Please try again later.</p>
            </div>
          )}

          {!isLoading && !isError && summaryData && (
            <div className="space-y-6 py-2">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card
                  className="border-white/20 bg-gradient-to-br from-blue-500/20 to-blue-600/10 
                           backdrop-blur-xl shadow-lg text-white hover:shadow-blue-500/20 
                           transition-all duration-300 hover:scale-[1.02]"
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white/60 text-sm mb-1">Total Records</p>
                        <p className="text-3xl font-bold">{summaryData.overall.totalRecords ?? 'N/A'}</p>
                      </div>
                      <div className="h-12 w-12 rounded-full bg-blue-500/30 flex items-center justify-center">
                        <Calendar className="h-6 w-6 text-blue-300" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card
                  className="border-white/20 bg-gradient-to-br from-green-500/20 to-green-600/10 
                           backdrop-blur-xl shadow-lg text-white hover:shadow-green-500/20 
                           transition-all duration-300 hover:scale-[1.02]"
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white/60 text-sm mb-1">Last 24 Hours</p>
                        <p className="text-3xl font-bold">{summaryData.overall.recordsLast24Hours ?? 'N/A'}</p>
                      </div>
                      <div className="h-12 w-12 rounded-full bg-green-500/30 flex items-center justify-center">
                        <Activity className="h-6 w-6 text-green-300" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card
                  className="border-white/20 bg-gradient-to-br from-purple-500/20 to-purple-600/10 
                           backdrop-blur-xl shadow-lg text-white hover:shadow-purple-500/20 
                           transition-all duration-300 hover:scale-[1.02]"
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white/60 text-sm mb-1">Last Month</p>
                        <p className="text-3xl font-bold">{summaryData.overall.recordsLastMonth ?? 'N/A'}</p>
                      </div>
                      <div className="h-12 w-12 rounded-full bg-purple-500/30 flex items-center justify-center">
                        <TrendingUp className="h-6 w-6 text-purple-300" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="border-white/20 bg-white/5 backdrop-blur-xl shadow-lg text-white">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-blue-400" />
                    Overall Statistics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={overallStatsData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                      <XAxis dataKey="name" stroke="rgba(255,255,255,0.7)" tick={{ fontSize: 12 }} />
                      <YAxis stroke="rgba(255,255,255,0.7)" tick={{ fontSize: 12 }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'rgba(0,0,0,0.9)',
                          border: '1px solid rgba(255,255,255,0.2)',
                          borderRadius: '12px',
                          color: 'white',
                        }}
                      />
                      <Bar dataKey="value" fill="url(#colorGradient)" radius={[8, 8, 0, 0]} />
                      <defs>
                        <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#60a5fa" stopOpacity={1} />
                          <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.8} />
                        </linearGradient>
                      </defs>
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default UsersSummary;
