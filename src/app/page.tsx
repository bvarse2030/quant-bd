/*
|-----------------------------------------
| setting up Page for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Quant BD, May, 2026
|-----------------------------------------
*/

'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Activity,
  CalendarClock,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Eye,
  Pencil,
  Plus,
  RadioTower,
  ShieldCheck,
  TimerReset,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';

type TradeStatus = 'activeTrade' | 'waitingTrade';

interface Entry {
  id: number;
  openDate: string;
  openTime: string;
  closeDate: string;
  closeTime: string;
  volume: number;
  entry: number;
  tp: number;
  sl: number;
  result: {
    type: 'Profit' | 'Loss';
    amount: number;
  };
  isPlaced: boolean;
  trickNumber: string;
}

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const entriesPerPage = 10;

const seedEntries: Entry[] = [
  {
    id: 1,
    openDate: '2026-05-04',
    openTime: '12:08 PM',
    closeDate: '2026-05-04',
    closeTime: '03:26 PM',
    volume: 0.12,
    entry: 1.08342,
    tp: 1.08792,
    sl: 1.08162,
    result: { type: 'Profit', amount: 54 },
    isPlaced: true,
    trickNumber: 'TRK-8101',
  },
  {
    id: 2,
    openDate: '2026-05-05',
    openTime: '12:14 PM',
    closeDate: '2026-05-05',
    closeTime: '02:48 PM',
    volume: 0.1,
    entry: 1.08618,
    tp: 1.08948,
    sl: 1.08468,
    result: { type: 'Loss', amount: 22 },
    isPlaced: true,
    trickNumber: 'TRK-8102',
  },
  {
    id: 3,
    openDate: '2026-05-06',
    openTime: '12:22 PM',
    closeDate: '2026-05-06',
    closeTime: '04:10 PM',
    volume: 0.15,
    entry: 1.09106,
    tp: 1.09556,
    sl: 1.08886,
    result: { type: 'Profit', amount: 67 },
    isPlaced: true,
    trickNumber: 'TRK-8103',
  },
  {
    id: 4,
    openDate: '2026-05-07',
    openTime: '12:02 PM',
    closeDate: '2026-05-07',
    closeTime: '01:56 PM',
    volume: 0.08,
    entry: 1.09432,
    tp: 1.09712,
    sl: 1.09282,
    result: { type: 'Profit', amount: 31 },
    isPlaced: true,
    trickNumber: 'TRK-8104',
  },
  {
    id: 5,
    openDate: '2026-05-08',
    openTime: '12:40 PM',
    closeDate: '2026-05-08',
    closeTime: '05:12 PM',
    volume: 0.2,
    entry: 1.09928,
    tp: 1.10358,
    sl: 1.09738,
    result: { type: 'Loss', amount: 38 },
    isPlaced: true,
    trickNumber: 'TRK-8105',
  },
  {
    id: 6,
    openDate: '2026-05-11',
    openTime: '12:18 PM',
    closeDate: '2026-05-11',
    closeTime: '03:33 PM',
    volume: 0.14,
    entry: 1.10118,
    tp: 1.10528,
    sl: 1.09908,
    result: { type: 'Profit', amount: 58 },
    isPlaced: true,
    trickNumber: 'TRK-8106',
  },
  {
    id: 7,
    openDate: '2026-05-12',
    openTime: '12:11 PM',
    closeDate: '2026-05-12',
    closeTime: '02:21 PM',
    volume: 0.1,
    entry: 1.10478,
    tp: 1.10818,
    sl: 1.10298,
    result: { type: 'Profit', amount: 44 },
    isPlaced: true,
    trickNumber: 'TRK-8107',
  },
  {
    id: 8,
    openDate: '2026-05-13',
    openTime: '12:05 PM',
    closeDate: '2026-05-13',
    closeTime: '01:43 PM',
    volume: 0.09,
    entry: 1.10792,
    tp: 1.11072,
    sl: 1.10642,
    result: { type: 'Loss', amount: 18 },
    isPlaced: false,
    trickNumber: 'TRK-8108',
  },
  {
    id: 9,
    openDate: '2026-05-14',
    openTime: '12:24 PM',
    closeDate: '2026-05-14',
    closeTime: '04:02 PM',
    volume: 0.16,
    entry: 1.10964,
    tp: 1.11394,
    sl: 1.10764,
    result: { type: 'Profit', amount: 69 },
    isPlaced: true,
    trickNumber: 'TRK-8109',
  },
  {
    id: 10,
    openDate: '2026-05-15',
    openTime: '12:19 PM',
    closeDate: '2026-05-15',
    closeTime: '03:08 PM',
    volume: 0.11,
    entry: 1.11236,
    tp: 1.11596,
    sl: 1.11076,
    result: { type: 'Profit', amount: 41 },
    isPlaced: true,
    trickNumber: 'TRK-8110',
  },
  {
    id: 11,
    openDate: '2026-05-18',
    openTime: '12:07 PM',
    closeDate: '2026-05-18',
    closeTime: '02:50 PM',
    volume: 0.13,
    entry: 1.11618,
    tp: 1.12018,
    sl: 1.11418,
    result: { type: 'Loss', amount: 29 },
    isPlaced: false,
    trickNumber: 'TRK-8111',
  },
  {
    id: 12,
    openDate: '2026-05-19',
    openTime: '12:32 PM',
    closeDate: '2026-05-19',
    closeTime: '05:18 PM',
    volume: 0.18,
    entry: 1.11882,
    tp: 1.12332,
    sl: 1.11642,
    result: { type: 'Profit', amount: 73 },
    isPlaced: true,
    trickNumber: 'TRK-8112',
  },
];

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

    if (dayIndex >= 0 && dayIndex <= 4 && candidate > date) {
      return candidate;
    }

    next.setDate(next.getDate() + 1);
    next.setHours(0, 0, 0, 0);
  }

  return next;
};

const createEntry = (id: number): Entry => {
  const now = new Date();
  const close = new Date(now);
  close.setHours(close.getHours() + 3);

  return {
    id,
    openDate: now.toISOString().slice(0, 10),
    openTime: new Intl.DateTimeFormat('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }).format(now),
    closeDate: close.toISOString().slice(0, 10),
    closeTime: new Intl.DateTimeFormat('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }).format(close),
    volume: 0.1,
    entry: 1.11428,
    tp: 1.11868,
    sl: 1.11218,
    result: { type: 'Profit', amount: 0 },
    isPlaced: true,
    trickNumber: `TRK-${8100 + id}`,
  };
};

const SummaryBox = ({ entries, status }: { entries: Entry[]; status: TradeStatus }) => {
  const placed = entries.filter(entry => entry.isPlaced).length;
  const wins = entries.filter(entry => entry.result.type === 'Profit').length;
  const losses = entries.filter(entry => entry.result.type === 'Loss').length;
  const netResult = entries.reduce((total, entry) => {
    return entry.result.type === 'Profit' ? total + entry.result.amount : total - entry.result.amount;
  }, 0);

  return (
    <motion.section
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid grid-cols-2 gap-2 rounded-lg border border-emerald-300/15 bg-black/35 p-2 shadow-[0_0_35px_rgba(16,185,129,0.12)] backdrop-blur md:grid-cols-4"
    >
      {[
        { label: 'Status', value: status, tone: status === 'activeTrade' ? 'text-lime-300' : 'text-cyan-300' },
        { label: 'Placed', value: `${placed}/${entries.length}`, tone: 'text-emerald-200' },
        { label: 'Win / Loss', value: `${wins} / ${losses}`, tone: 'text-teal-200' },
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
  const [entries, setEntries] = useState<Entry[]>(seedEntries);
  const [page, setPage] = useState(1);

  useEffect(() => {
    setNow(new Date());
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const marketOpen = now ? isMarketOpen(now) : false;
  const status: TradeStatus = now && isOrderWindow(now) ? 'activeTrade' : 'waitingTrade';
  const todayIndex = now ? getMondayFirstIndex(now) : -1;
  const nextOrderWindow = now ? getNextOrderWindow(now) : null;
  const countdown = now && nextOrderWindow ? formatCountdown(nextOrderWindow.getTime() - now.getTime()) : '00h 00m 00s';
  const totalPages = Math.ceil(entries.length / entriesPerPage);

  const visibleEntries = useMemo(() => {
    const start = (page - 1) * entriesPerPage;
    return entries.slice(start, start + entriesPerPage);
  }, [entries, page]);

  const addEntry = () => {
    setEntries(current => [createEntry(current.length + 1), ...current]);
    setPage(1);
  };

  const entryList = (
    <section className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <div>
          <p className="text-[10px] uppercase tracking-[0.28em] text-emerald-200/50">Execution Log</p>
          <h2 className="text-xl font-black text-white">Entry List</h2>
        </div>
        <span className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-2 py-1 text-xs font-semibold text-cyan-200">{entries.length} Entries</span>
      </div>

      <div className="grid gap-2">
        {visibleEntries.map((entry, index) => (
          <motion.article
            key={entry.id}
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
                    className={`rounded-full px-2 py-0.5 text-xs font-bold ${
                      entry.isPlaced ? 'bg-lime-400/15 text-lime-200' : 'bg-slate-400/15 text-slate-300'
                    }`}
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
                ['Close Date', entry.closeDate],
                ['Close Time', entry.closeTime],
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
              <button className="inline-flex min-h-12 items-center justify-center gap-1 rounded-md border border-cyan-300/25 bg-cyan-300/10 text-xs font-bold text-cyan-100 transition hover:bg-cyan-300/20">
                <Eye size={14} />
                View
              </button>
              <button className="inline-flex min-h-12 items-center justify-center gap-1 rounded-md border border-lime-300/25 bg-lime-300/10 text-xs font-bold text-lime-100 transition hover:bg-lime-300/20">
                <Pencil size={14} />
                Edit
              </button>
            </div>
          </motion.article>
        ))}
      </div>

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
  );

  return (
    <main className="min-h-screen overflow-hidden bg-[#04130d] text-white pt-20">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(34,197,94,0.24),transparent_28%),radial-gradient(circle_at_85%_18%,rgba(45,212,191,0.16),transparent_24%),linear-gradient(135deg,rgba(3,7,18,0.1),rgba(6,95,70,0.2))]" />
      <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-3 px-2 py-3 sm:px-4 md:py-5">
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
                  <p className={`mt-1 h-2 w-2 rounded-full mx-auto ${isToday ? 'bg-lime-300' : 'bg-emerald-900'}`} />
                  <p className="mt-1 text-[9px] text-emerald-100/35">{isToday ? 'Today' : 'Standby'}</p>
                </motion.div>
              );
            })}
          </div>
        </motion.section>

        <motion.section
          layout
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
                className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-lime-300 px-4 text-sm font-black text-emerald-950 shadow-[0_0_30px_rgba(190,242,100,0.35)] transition hover:bg-lime-200"
              >
                <Plus size={17} />
                Add Entry
              </button>
            </div>
          ) : (
            <div className="grid gap-2 sm:grid-cols-[1fr_auto] sm:items-center">
              <div>
                <p className="flex items-center gap-1 text-[10px] uppercase tracking-[0.25em] text-cyan-100/55">
                  <TimerReset size={13} />
                  Please Wait
                </p>
                <h2 className="mt-1 text-2xl font-black text-cyan-100">Next order window countdown</h2>
                <p className="text-xs text-cyan-100/55">Add Entry unlocks only between 12:00 PM and 1:00 PM while market is open.</p>
              </div>
              <div className="rounded-md border border-cyan-300/30 bg-black/35 px-3 py-2 text-center">
                <p className="text-[10px] uppercase tracking-[0.24em] text-cyan-100/45">Countdown</p>
                <p className="font-mono text-2xl font-black text-cyan-100">{countdown}</p>
              </div>
            </div>
          )}
        </motion.section>

        {status === 'waitingTrade' && <SummaryBox entries={entries} status={status} />}

        {entryList}

        {status === 'activeTrade' && <SummaryBox entries={entries} status={status} />}

        <div className="pointer-events-none absolute bottom-8 right-4 hidden items-center gap-2 rounded-full border border-emerald-300/10 bg-emerald-300/5 px-3 py-2 text-xs text-emerald-100/45 sm:flex">
          <CalendarClock size={14} />
          Monday first, live active-day signal
        </div>
      </div>
      <TrendingUp className="pointer-events-none absolute left-3 top-40 h-16 w-16 animate-pulse text-emerald-300/10" />
      <TrendingDown className="pointer-events-none absolute bottom-20 right-5 h-20 w-20 animate-pulse text-cyan-300/10" />
    </main>
  );
};

export default Page;
