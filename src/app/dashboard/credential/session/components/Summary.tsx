/*
|-----------------------------------------
| setting up Summary for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

'use client';

import {
  Bar,
  Pie,
  Cell,
  YAxis,
  XAxis,
  Legend,
  Tooltip,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  PieLabelRenderProps,
  PieChart as RechartsPieChart,
} from 'recharts';
import { useState } from 'react';
import { Loader2, TrendingUp, BarChart3, PieChart, Calendar, Activity } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useGetSessionsSummaryQuery } from '@/redux/features/sessions/sessionsSlice';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';

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

const COLORS = ['#60a5fa', '#34d399', '#fbbf24', '#f87171', '#a78bfa', '#fb923c', '#ec4899', '#06b6d4'];

const SessionsSummary = () => {
  const [page, setPage] = useState(1);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'table' | 'bar' | 'pie'>('table');
  const limit = 10;

  const { data, isLoading, isError, isFetching } = useGetSessionsSummaryQuery({ page, limit }, { skip: !isDialogOpen });

  const summaryData: SummaryData | undefined = data?.data;

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= (summaryData?.pagination?.totalPages || 1)) {
      setPage(newPage);
    }
  };

  const tableHeaders = summaryData?.monthlyTable?.[0] ? Object.keys(summaryData.monthlyTable[0]) : [];

  const summaryKeys = summaryData?.tableSummary ? Object.keys(summaryData.tableSummary).filter(key => key !== 'totalMonths') : [];

  const barChartData =
    summaryData?.monthlyTable?.map(row => {
      const formattedRow: Record<string, number | string> = {};
      Object.keys(row).forEach(key => {
        formattedRow[key] = typeof row[key] === 'number' ? row[key] : row[key];
      });
      return formattedRow;
    }) || [];

  const pieChartData = summaryData?.tableSummary
    ? summaryKeys.map(key => ({
        name: key.replace(/([A-Z])/g, ' $1').trim(),
        value: summaryData.tableSummary![key] as number,
      }))
    : [];

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

      <DialogContent className="sm:max-w-7xl max-h-[90vh] mt-4 overflow-y-auto rounded-2xl border border-white/20 bg-gradient-to-br from-slate-900/95 via-blue-900/90 to-purple-900/95 backdrop-blur-3xl shadow-2xl text-white">
        <DialogHeader className="space-y-3 pb-4 border-b border-white/10">
          <DialogTitle className="text-3xl font-bold bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Sessions Analytics Dashboard
          </DialogTitle>
          <DialogDescription className="text-white/60 text-base">
            Comprehensive overview of your sessions data with interactive visualizations
          </DialogDescription>
        </DialogHeader>

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
            <p className="text-red-300 text-lg">Failed to load summary data.</p>
          </div>
        )}

        {!isLoading && !isError && summaryData && (
          <div className="space-y-6 py-2">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="border-white/20 bg-gradient-to-br from-blue-500/20 to-blue-600/10 backdrop-blur-xl shadow-lg text-white hover:shadow-blue-500/20 transition-all duration-300 hover:scale-[1.02]">
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

              <Card className="border-white/20 bg-gradient-to-br from-green-500/20 to-green-600/10 backdrop-blur-xl shadow-lg text-white hover:shadow-green-500/20 transition-all duration-300 hover:scale-[1.02]">
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

              <Card className="border-white/20 bg-gradient-to-br from-purple-500/20 to-purple-600/10 backdrop-blur-xl shadow-lg text-white hover:shadow-purple-500/20 transition-all duration-300 hover:scale-[1.02]">
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

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-white/20 bg-white/5 backdrop-blur-xl shadow-lg text-white">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-blue-400" />
                    Overall Statistics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
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

              {summaryData.tableSummary && (
                <Card className="border-white/20 bg-white/5 backdrop-blur-xl shadow-lg text-white">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <PieChart className="h-5 w-5 text-purple-400" />
                      Grand Total Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                          <p className="text-white/60 text-xs mb-1">Total Months</p>
                          <p className="text-2xl font-bold">{summaryData.tableSummary.totalMonths}</p>
                        </div>
                        {summaryKeys.map((key, index) => (
                          <div key={key} className="p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                            <p className="text-white/60 text-xs mb-1">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                            <p className="text-xl font-bold" style={{ color: COLORS[index % COLORS.length] }}>
                              {summaryData.tableSummary![key].toLocaleString()}
                            </p>
                          </div>
                        ))}
                      </div>
                      <ResponsiveContainer width="100%" height={250}>
                        <RechartsPieChart>
                          <Pie
                            data={pieChartData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={(props: PieLabelRenderProps) => {
                              const percent = props.percent as number;
                              return `${(percent * 100).toFixed(0)}%`;
                            }}
                            outerRadius={85}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {pieChartData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip
                            contentStyle={{
                              backgroundColor: 'rgba(0,0,0,0.9)',
                              border: '1px solid rgba(255,255,255,0.2)',
                              borderRadius: '12px',
                              color: 'white',
                            }}
                          />
                        </RechartsPieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {summaryData.monthlyTable && (
              <Card className="border-white/20 bg-white/5 backdrop-blur-xl shadow-lg text-white">
                <CardHeader>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <CardTitle className="text-xl">Monthly Data Breakdown</CardTitle>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant={viewMode === 'table' ? 'default' : 'ghost'}
                        onClick={() => setViewMode('table')}
                        className={cn(
                          'h-9 px-4 transition-all duration-200',
                          viewMode === 'table' ? 'bg-blue-500 hover:bg-blue-600 text-white' : 'text-white/70 hover:text-white hover:bg-white/10',
                        )}
                      >
                        Table
                      </Button>
                      <Button
                        size="sm"
                        variant={viewMode === 'bar' ? 'default' : 'ghost'}
                        onClick={() => setViewMode('bar')}
                        className={cn(
                          'h-9 px-4 transition-all duration-200',
                          viewMode === 'bar' ? 'bg-blue-500 hover:bg-blue-600 text-white' : 'text-white/70 hover:text-white hover:bg-white/10',
                        )}
                      >
                        <BarChart3 className="h-4 w-4 mr-1" />
                        Bar
                      </Button>
                      <Button
                        size="sm"
                        variant={viewMode === 'pie' ? 'default' : 'ghost'}
                        onClick={() => setViewMode('pie')}
                        className={cn(
                          'h-9 px-4 transition-all duration-200',
                          viewMode === 'pie' ? 'bg-blue-500 hover:bg-blue-600 text-white' : 'text-white/70 hover:text-white hover:bg-white/10',
                        )}
                      >
                        <PieChart className="h-4 w-4 mr-1" />
                        Pie
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className={`relative transition-opacity duration-200 ${isFetching ? 'opacity-50' : ''}`}>
                    {isFetching && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-lg backdrop-blur-sm z-10">
                        <Loader2 className="h-8 w-8 animate-spin text-white" />
                      </div>
                    )}

                    {viewMode === 'table' && (
                      <div className="rounded-xl border border-white/20 bg-white/5 backdrop-blur-xl overflow-hidden">
                        <Table className="text-white">
                          <TableHeader className="bg-linear-to-r from-blue-500/20 to-purple-500/20">
                            <TableRow className="border-white/10 hover:bg-transparent">
                              {tableHeaders.map(header => (
                                <TableHead key={header} className="text-white font-semibold whitespace-nowrap">
                                  {header.charAt(0).toUpperCase() +
                                    header
                                      .slice(1)
                                      .replace(/([A-Z])/g, ' $1')
                                      .trim()}
                                </TableHead>
                              ))}
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {summaryData.monthlyTable.length > 0 ? (
                              summaryData.monthlyTable.map((row, index) => (
                                <TableRow key={index} className="hover:bg-white/10 transition-colors border-white/5">
                                  {tableHeaders.map(header => (
                                    <TableCell key={header} className="text-white/90">
                                      {row[header]}
                                    </TableCell>
                                  ))}
                                </TableRow>
                              ))
                            ) : (
                              <TableRow>
                                <TableCell colSpan={tableHeaders.length} className="h-32 text-center text-white/70">
                                  No monthly data to display.
                                </TableCell>
                              </TableRow>
                            )}
                          </TableBody>
                        </Table>
                      </div>
                    )}

                    {viewMode === 'bar' && (
                      <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                        <ResponsiveContainer width="100%" height={400}>
                          <BarChart data={barChartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                            <XAxis dataKey={tableHeaders[0]} stroke="rgba(255,255,255,0.7)" angle={-45} textAnchor="end" height={80} />
                            <YAxis stroke="rgba(255,255,255,0.7)" />
                            <Tooltip
                              contentStyle={{
                                backgroundColor: 'rgba(0,0,0,0.9)',
                                border: '1px solid rgba(255,255,255,0.2)',
                                borderRadius: '12px',
                                color: 'white',
                              }}
                            />
                            <Legend />
                            {tableHeaders.slice(1).map((header, index) => (
                              <Bar key={header} dataKey={header} fill={COLORS[index % COLORS.length]} radius={[8, 8, 0, 0]} />
                            ))}
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    )}

                    {viewMode === 'pie' && barChartData.length > 0 && (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {tableHeaders.slice(1).map((header, idx) => {
                          const chartData = barChartData
                            .map(row => ({
                              name: String(row[tableHeaders[0]]),
                              value: Number(row[header]) || 0,
                            }))
                            .filter(item => item.value > 0);

                          return (
                            <div
                              key={header}
                              className="border border-white/20 rounded-xl p-5 bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300 hover:scale-[1.02]"
                            >
                              <h3 className="text-base font-semibold mb-4 text-center text-white/90 pb-2 border-b border-white/10">
                                {header.replace(/([A-Z])/g, ' $1').trim()}
                              </h3>
                              <ResponsiveContainer width="100%" height={220}>
                                <RechartsPieChart>
                                  <Pie
                                    data={chartData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={(props: PieLabelRenderProps) => {
                                      const value = props.value as number;
                                      return value && value > 0 ? String(value) : '';
                                    }}
                                    outerRadius={70}
                                    fill="#8884d8"
                                    dataKey="value"
                                  >
                                    {chartData.map((entry, index) => (
                                      <Cell key={`cell-${index}`} fill={COLORS[(index + idx) % COLORS.length]} />
                                    ))}
                                  </Pie>
                                  <Tooltip
                                    contentStyle={{
                                      backgroundColor: 'rgba(0,0,0,0.9)',
                                      border: '1px solid rgba(255,255,255,0.2)',
                                      borderRadius: '12px',
                                      color: 'white',
                                    }}
                                  />
                                </RechartsPieChart>
                              </ResponsiveContainer>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        <DialogFooter className="border-t border-white/10 pt-4 mt-2">
          {summaryData?.pagination && summaryData.pagination.totalPages > 1 && (
            <Pagination className="text-white w-full justify-center">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={e => {
                      e.preventDefault();
                      handlePageChange(page - 1);
                    }}
                    className={cn(
                      'border-white/30 bg-white/10 backdrop-blur-lg text-white hover:bg-white/20 transition-all duration-200',
                      page <= 1 && 'pointer-events-none opacity-40',
                    )}
                  />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink
                    isActive
                    className="border-white/30 bg-blue-500/30 backdrop-blur-xl text-white hover:bg-blue-500/40 transition-all duration-200"
                  >
                    Page {page} of {summaryData.pagination.totalPages}
                  </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={e => {
                      e.preventDefault();
                      handlePageChange(page + 1);
                    }}
                    className={cn(
                      'border-white/30 bg-white/10 backdrop-blur-lg text-white hover:bg-white/20 transition-all duration-200',
                      page >= summaryData.pagination.totalPages && 'pointer-events-none opacity-40',
                    )}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SessionsSummary;
