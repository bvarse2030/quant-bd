/*
|-----------------------------------------
| setting up Page for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Quant BD, May, 2026
|-----------------------------------------
*/

'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, ChevronLeft, ChevronRight, Clock3, Eye, Plus, RadioTower, ShieldCheck, TimerReset, TrendingDown, TrendingUp } from 'lucide-react';

type TradeStatus = 'activeTrade' | 'waitingTrade';
type ResultType = 'Profit' | 'Loss';

interface Entry {
  _id: string;
  openDate: string;
  openTime: string;
  closeDate: string;
  closeTime: string;
  volume: number;
  entry: number;
  tp: number;
  sl: number;
  result: {
    type: ResultType;
    amount: number;
  };
  isPlaced: boolean;
  trickNumber: string;
}

interface ApiResponse<T> {
  data: T;
  message: string;
  status: number;
}

interface EntriesPayload {
  entries: Entry[];
  total: number;
  page: number;
  limit: number;
}

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const homeEntriesLimit = 1000;
const entriesPerPage = 10;

const pad = (value: number) => String(value).padStart(2, '0');

const formatCountdown = (milliseconds: number) => {
  const totalSeconds = Math.max(0, Math.floor(milliseconds / 1000));
  const daysLeft = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (daysLeft > 0) return `${daysLeft}d ${pad(hours)}h ${pad(minutes)}m ${pad(seconds)}s`;
  return `${pad(hours)}h ${pad(minutes)}m ${pad(seconds)}s`;
};

const formatDisplayDate = (date: Date) =>
  new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date);

const formatDisplayTime = (date: Date) =>
  new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  }).format(date);

const getMondayFirstIndex = (date: Date) => (date.getDay() + 6) % 7;

const isMarketOpen = (date: Date) => {
  const dayIndex = getMondayFirstIndex(date);
  const minutes = date.getHours() * 60 + date.getMinutes();

  if (dayIndex === 0) return minutes >= 240;
  if (dayIndex > 0 && dayIndex < 5) return true;
  if (dayIndex === 5) return minutes < 120;
  return false;
};

const isOrderWindow = (date: Date) => isMarketOpen(date) && date.getHours() === 12;

const getNextOrderWindow = (date: Date) => {
  const next = new Date(date);
  next.setSeconds(0, 0);

  for (let index = 0; index < 10; index += 1) {
    const dayIndex = getMondayFirstIndex(next);
    const candidate = new Date(next);
    candidate.setHours(12, 0, 0, 0);

    if (dayIndex >= 0 && dayIndex <= 4 && candidate > date) return candidate;

    next.setDate(next.getDate() + 1);
    next.setHours(0, 0, 0, 0);
  }

  return next;
};

const createEntryPayload = (total: number) => {
  const now = new Date();
  const close = new Date(now);
  close.setHours(close.getHours() + 3);

  return {
    openDate: now.toISOString().slice(0, 10),
    openTime: new Intl.DateTimeFormat('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }).format(now),
    closeDate: close.toISOString().slice(0, 10),
    closeTime: new Intl.DateTimeFormat('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }).format(close),
    volume: 0.01,
    entry: 0,
    tp: 0,
    sl: 0,
    result: { type: 'Profit' as ResultType, amount: 0 },
    isPlaced: true,
    trickNumber: `TRK-${Date.now()}-${total + 1}`,
  };
};

const SummaryBox = ({ entries, total, status }: { entries: Entry[]; total: number; status: TradeStatus }) => {
  const placed = entries.filter(entry => entry.isPlaced).length;
  const wins = entries.filter(entry => entry.result.type === 'Profit').length;
  const losses = entries.filter(entry => entry.result.type === 'Loss').length;
  const netResult = entries.reduce((sum, entry) => (entry.result.type === 'Profit' ? sum + entry.result.amount : sum - entry.result.amount), 0);

  return (
    <motion.section
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid grid-cols-2 gap-2 rounded-lg border border-emerald-300/15 bg-black/35 p-2 shadow-[0_0_35px_rgba(16,185,129,0.12)] backdrop-blur md:grid-cols-4"
    >
      {[
        { label: 'Status', value: status, tone: status === 'activeTrade' ? 'text-lime-300' : 'text-cyan-300' },
        { label: 'Placed', value: `${placed}/${total}`, tone: 'text-emerald-200' },
        { label: 'Profit / Loss', value: `${wins} / ${losses}`, tone: 'text-teal-200' },
        { label: 'Net Result', value: `${netResult >= 0 ? '+' : '-'}$${Math.abs(netResult)}`, tone: netResult >= 0 ? 'text-lime-300' : 'text-rose-300' },
      ].map(item => (
        <div key={item.label} className="rounded-md border border-white/10 bg-white/[0.04] px-2 py-2">
          <p className="text-[10px] uppercase tracking-[0.2em] text-emerald-100/45">{item.label}</p>
          <p className={`mt-1 truncate text-lg font-black ${item.tone}`}>{item.value}</p>
        </div>
      ))}
    </motion.section>
  );
};

const Page = () => {
  const [now, setNow] = useState<Date | null>(null);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [totalEntries, setTotalEntries] = useState(0);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  const fetchEntries = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await fetch(`/api/home/v1?page=1&limit=${homeEntriesLimit}`, { cache: 'no-store' });
      const payload = (await response.json()) as ApiResponse<EntriesPayload>;
      if (!response.ok) throw new Error(payload.message || 'Failed to load entries');

      setEntries(payload.data.entries);
      setTotalEntries(payload.data.total);
    } catch (fetchError) {
      setError(fetchError instanceof Error ? fetchError.message : 'Failed to load entries');
      setEntries([]);
      setTotalEntries(0);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const totalPages = Math.max(1, Math.ceil(entries.length / entriesPerPage));
  const visibleEntries = useMemo(() => {
    const start = (page - 1) * entriesPerPage;
    return entries.slice(start, start + entriesPerPage);
  }, [entries, page]);

  const analytics = useMemo(() => {
    const placed = entries.filter(entry => entry.isPlaced).length;
    const profit = entries.filter(entry => entry.result.type === 'Profit').length;
    const loss = entries.filter(entry => entry.result.type === 'Loss').length;
    const net = entries.reduce((total, entry) => (entry.result.type === 'Profit' ? total + entry.result.amount : total - entry.result.amount), 0);
    const placedRate = entries.length ? Math.round((placed / entries.length) * 100) : 0;
    const profitRate = entries.length ? Math.round((profit / entries.length) * 100) : 0;
    const totalVolume = entries.reduce((total, entry) => total + entry.volume, 0);

    return { placed, profit, loss, net, placedRate, profitRate, totalVolume };
  }, [entries]);

  useEffect(() => {
    setNow(new Date());
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const marketOpen = now ? isMarketOpen(now) : false;
  const status: TradeStatus = now && isOrderWindow(now) ? 'activeTrade' : 'waitingTrade';
  const todayIndex = now ? getMondayFirstIndex(now) : -1;
  const nextOrderWindow = now ? getNextOrderWindow(now) : null;
  const countdown = now && nextOrderWindow ? formatCountdown(nextOrderWindow.getTime() - now.getTime()) : '00h 00m 00s';

  const addEntry = async () => {
    setIsSaving(true);
    setError('');
    try {
      const response = await fetch('/api/home/v1', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(createEntryPayload(totalEntries)),
      });
      const payload = (await response.json()) as ApiResponse<Entry>;
      if (!response.ok) throw new Error(payload.message || 'Failed to add entry');

      await fetchEntries();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Failed to add entry');
    } finally {
      setIsSaving(false);
    }
  };

  const viewEntry = (entry: Entry) => {
    window.alert(
      [
        `Trick: ${entry.trickNumber}`,
        `Open: ${entry.openDate} ${entry.openTime}`,
        `Close: ${entry.closeDate || '-'} ${entry.closeTime || '-'}`,
        `Volume: ${entry.volume}`,
        `Entry: ${entry.entry}`,
        `TP: ${entry.tp}`,
        `SL: ${entry.sl}`,
        `Result: ${entry.result.type} $${entry.result.amount}`,
        `Placed: ${entry.isPlaced ? 'Yes' : 'No'}`,
      ].join('\n'),
    );
  };

  const entryList = useMemo(
    () => (
      <section className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          <div>
            <p className="text-[10px] uppercase tracking-[0.28em] text-emerald-200/50">Execution Log</p>
            <h2 className="text-xl font-black text-white">Entry List</h2>
          </div>
          <span className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-2 py-1 text-xs font-semibold text-cyan-200">{totalEntries} Entries</span>
        </div>

        {error && <div className="rounded-md border border-rose-300/25 bg-rose-400/10 px-3 py-2 text-xs font-semibold text-rose-100">{error}</div>}

        {isLoading ? (
          <div className="rounded-lg border border-emerald-300/15 bg-black/35 p-6 text-center text-sm font-semibold text-emerald-100/60">
            Loading entries...
          </div>
        ) : entries.length === 0 ? (
          <div className="rounded-lg border border-emerald-300/15 bg-black/35 p-6 text-center text-sm font-semibold text-emerald-100/60">No entries found.</div>
        ) : (
          <div className="grid gap-2">
            {visibleEntries.map((entry, index) => (
              <motion.article
                key={entry._id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.035 }}
                className="rounded-lg border border-emerald-300/15 bg-slate-950/70 p-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="rounded-full bg-emerald-400/15 px-2 py-0.5 text-xs font-bold text-emerald-200">{entry.trickNumber}</span>
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-bold ${entry.isPlaced ? 'bg-lime-400/15 text-lime-200' : 'bg-slate-400/15 text-slate-300'}`}
                      >
                        {entry.isPlaced ? 'Placed' : 'Not Placed'}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-emerald-100/50">
                      Open {entry.openDate} at {entry.openTime}
                    </p>
                  </div>
                  <div className={`text-right text-sm font-black ${entry.result.type === 'Profit' ? 'text-lime-300' : 'text-rose-300'}`}>
                    {entry.result.type} ${entry.result.amount}
                  </div>
                </div>

                <div className="mt-2 grid grid-cols-2 gap-1.5 text-xs sm:grid-cols-4 lg:grid-cols-8">
                  {[
                    ['Close Date', entry.closeDate || '-'],
                    ['Close Time', entry.closeTime || '-'],
                    ['Volume', entry.volume],
                    ['Entry', entry.entry],
                    ['TP', entry.tp],
                    ['SL', entry.sl],
                  ].map(([label, value]) => (
                    <div key={label} className="rounded-md border border-white/10 bg-white/[0.03] px-2 py-1.5">
                      <p className="text-[9px] uppercase tracking-[0.16em] text-emerald-100/40">{label}</p>
                      <p className="mt-0.5 font-semibold text-emerald-50">{value}</p>
                    </div>
                  ))}
                  <button
                    onClick={() => viewEntry(entry)}
                    className="inline-flex min-h-12 items-center justify-center gap-1 rounded-md border border-cyan-300/25 bg-cyan-300/10 text-xs font-bold text-cyan-100 transition hover:bg-cyan-300/20"
                  >
                    <Eye size={14} />
                    View
                  </button>
                </div>
              </motion.article>
            ))}
          </div>
        )}

        {entries.length > entriesPerPage && (
          <div className="flex items-center justify-between rounded-lg border border-emerald-300/15 bg-black/35 p-2">
            <button
              onClick={() => setPage(current => Math.max(1, current - 1))}
              disabled={page === 1}
              className="inline-flex h-9 items-center gap-1 rounded-md border border-white/10 px-2 text-xs font-bold text-emerald-100 disabled:cursor-not-allowed disabled:opacity-35"
            >
              <ChevronLeft size={15} />
              Prev
            </button>
            <span className="text-xs font-semibold text-emerald-100/60">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage(current => Math.min(totalPages, current + 1))}
              disabled={page === totalPages}
              className="inline-flex h-9 items-center gap-1 rounded-md border border-white/10 px-2 text-xs font-bold text-emerald-100 disabled:cursor-not-allowed disabled:opacity-35"
            >
              Next
              <ChevronRight size={15} />
            </button>
          </div>
        )}
      </section>
    ),
    [entries.length, error, isLoading, page, totalEntries, totalPages, visibleEntries],
  );

  return (
    <main className="min-h-screen overflow-hidden bg-[#04130d] pt-20 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(34,197,94,0.24),transparent_28%),radial-gradient(circle_at_85%_18%,rgba(45,212,191,0.16),transparent_24%),linear-gradient(135deg,rgba(3,7,18,0.1),rgba(6,95,70,0.2))]" />
      <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-3 px-2 py-3 sm:px-4 md:py-5">
        <motion.section
          layout
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-lg border p-3 backdrop-blur ${
            status === 'activeTrade'
              ? 'border-lime-300/30 bg-lime-300/10 shadow-[0_0_45px_rgba(132,204,22,0.18)]'
              : 'border-cyan-300/25 bg-cyan-300/10 shadow-[0_0_45px_rgba(34,211,238,0.14)]'
          }`}
        >
          {status === 'activeTrade' ? (
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="flex items-center gap-1 text-[10px] uppercase tracking-[0.25em] text-lime-100/55">
                  <ShieldCheck size={13} />
                  Place Order
                </p>
                <h2 className="mt-1 text-2xl font-black text-lime-100">Active trade window</h2>
                <p className="text-xs text-lime-100/55">Order time is live from 12:00 PM to 1:00 PM.</p>
              </div>
              <button
                onClick={addEntry}
                disabled={isSaving}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-lime-300 px-4 text-sm font-black text-emerald-950 shadow-[0_0_30px_rgba(190,242,100,0.35)] transition hover:bg-lime-200 disabled:opacity-60"
              >
                <Plus size={17} />
                {isSaving ? 'Adding...' : 'Add Entry'}
              </button>
            </div>
          ) : (
            <div className="grid gap-2 sm:grid-cols-[1fr_auto] sm:items-center">
              <div>
                <p className="flex items-center gap-1 text-[10px] uppercase tracking-[0.25em] text-cyan-100/55">
                  <TimerReset size={13} />
                  Next order window countdown
                </p>
                <h2 className="mt-1 text-2xl font-black text-cyan-100">Please Wait</h2>
                <p className="text-xs text-cyan-100/55">Add Entry unlocks only between 12:00 PM and 1:00 PM while market is open.</p>
              </div>
              <div className="rounded-md border border-cyan-300/30 bg-black/35 px-3 py-2 text-center">
                <p className="text-[10px] uppercase tracking-[0.24em] text-cyan-100/45">Countdown</p>
                <p className="font-mono text-2xl font-black text-cyan-100">{countdown}</p>
              </div>
            </div>
          )}
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-lg border border-emerald-300/15 bg-black/40 p-3 shadow-[0_0_55px_rgba(20,184,166,0.14)] backdrop-blur"
        >
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full border border-lime-300/20 bg-lime-300/10 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.25em] text-lime-200">
                <RadioTower size={13} />
                EURUSD - BST
              </div>
              <h1 className="mt-2 text-2xl font-black tracking-tight text-white sm:text-3xl">Market Open & Close</h1>
              <p className="mt-1 max-w-xl text-xs leading-5 text-emerald-100/55">Weekly Open: Monday at 4:00 AM. Weekly Close: Saturday at 2:00 AM.</p>
            </div>

            <div className="grid grid-cols-2 gap-2 sm:min-w-80">
              <div className="rounded-md border border-cyan-300/20 bg-cyan-300/10 p-2">
                <p className="flex items-center gap-1 text-[10px] uppercase tracking-[0.2em] text-cyan-100/50">
                  <Clock3 size={12} />
                  Current
                </p>
                <p className="mt-1 text-sm font-black text-cyan-100">{now ? formatDisplayTime(now) : 'Loading...'}</p>
                <p className="text-[11px] text-cyan-100/45">{now ? formatDisplayDate(now) : ''}</p>
              </div>
              <div className="rounded-md border border-lime-300/20 bg-lime-300/10 p-2">
                <p className="flex items-center gap-1 text-[10px] uppercase tracking-[0.2em] text-lime-100/50">
                  <Activity size={12} />
                  Market
                </p>
                <p className={`mt-1 text-sm font-black ${marketOpen ? 'text-lime-200' : 'text-rose-200'}`}>{marketOpen ? 'Open' : 'Closed'}</p>
                <p className="text-[11px] text-lime-100/45">{status}</p>
              </div>
            </div>
          </div>

          <div className="mt-3 grid grid-cols-7 gap-1">
            {days.map((day, index) => {
              const isToday = index === todayIndex;

              return (
                <motion.div
                  key={day}
                  animate={isToday ? { scale: [1, 1.04, 1] } : { scale: 1 }}
                  transition={isToday ? { duration: 1.8, repeat: Infinity } : undefined}
                  className={`min-h-16 rounded-md border px-1 py-2 text-center ${
                    isToday ? 'border-lime-300/70 bg-lime-300/20 shadow-[0_0_22px_rgba(190,242,100,0.28)]' : 'border-emerald-300/10 bg-white/[0.03]'
                  }`}
                >
                  <p className={`text-[10px] font-black uppercase ${isToday ? 'text-lime-100' : 'text-emerald-100/45'}`}>{day.slice(0, 3)}</p>
                  <p className={`mx-auto mt-1 h-2 w-2 rounded-full ${isToday ? 'bg-lime-300' : 'bg-emerald-900'}`} />
                  <p className="mt-1 text-[9px] text-emerald-100/35">{isToday ? 'Today' : 'Standby'}</p>
                </motion.div>
              );
            })}
          </div>
        </motion.section>

        <SummaryBox entries={entries} total={totalEntries} status={status} />

        <section className="rounded-lg border border-emerald-300/15 bg-black/35 p-3 backdrop-blur">
          <div className="mb-3 flex items-center justify-between gap-2">
            <div>
              <p className="text-[10px] uppercase tracking-[0.28em] text-cyan-200/50">Analytics</p>
              <h2 className="text-xl font-black text-white">Performance Overview</h2>
            </div>
            <span className={analytics.net >= 0 ? 'text-sm font-black text-lime-300' : 'text-sm font-black text-rose-300'}>
              {analytics.net >= 0 ? '+' : '-'}${Math.abs(analytics.net)}
            </span>
          </div>

          <div className="grid gap-3 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-3">
              {[
                { label: 'Placed Rate', value: analytics.placedRate, tone: 'from-emerald-400 to-lime-300' },
                { label: 'Profit Rate', value: analytics.profitRate, tone: 'from-cyan-400 to-emerald-300' },
              ].map(item => (
                <div key={item.label}>
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <span className="font-bold uppercase tracking-[0.18em] text-white/45">{item.label}</span>
                    <span className="font-black text-white">{item.value}%</span>
                  </div>
                  <div className="h-3 overflow-hidden rounded-full bg-black/35">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${item.value}%` }} className={`h-full rounded-full bg-gradient-to-r ${item.tone}`} />
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              {[
                ['Total Entries', totalEntries],
                ['Placed', analytics.placed],
                ['Profit / Loss', `${analytics.profit} / ${analytics.loss}`],
                ['Total Volume', analytics.totalVolume.toFixed(2)],
              ].map(([label, value]) => (
                <div key={label} className="rounded-md border border-white/10 bg-white/[0.03] px-2 py-2">
                  <p className="text-[10px] uppercase tracking-[0.18em] text-white/35">{label}</p>
                  <p className="mt-1 font-black text-emerald-50">{value}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {entryList}
      </div>
      <TrendingUp className="pointer-events-none absolute left-3 top-40 h-16 w-16 animate-pulse text-emerald-300/10" />
      <TrendingDown className="pointer-events-none absolute bottom-20 right-5 h-20 w-20 animate-pulse text-cyan-300/10" />
    </main>
  );
};

export default Page;
