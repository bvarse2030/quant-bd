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
import { BarChart2, CheckCircle2, Clock, Pencil, PlusCircle, RefreshCcw, Save, Trash2, XCircle } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

type ResultType = 'Profit' | 'Loss';
type ActiveTab = 'my-trade' | 'analytics';

interface HomeEntry {
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
  entries: HomeEntry[];
  total: number;
  page: number;
  limit: number;
}

type EntryForm = Omit<HomeEntry, '_id'>;

const emptyForm: EntryForm = {
  openDate: '',
  openTime: '',
  closeDate: '',
  closeTime: '',
  volume: 0.01,
  entry: 0,
  tp: 0,
  sl: 0,
  result: {
    type: 'Profit',
    amount: 0,
  },
  isPlaced: false,
  trickNumber: '',
};

const inputCls = 'bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-emerald-400/60 focus-visible:ring-0 focus-visible:ring-offset-0';

const getTodayValue = () => new Date().toISOString().slice(0, 10);

const getTimeValue = () =>
  new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(new Date());

const createDefaultForm = (entryCount: number): EntryForm => ({
  ...emptyForm,
  openDate: getTodayValue(),
  openTime: getTimeValue(),
  trickNumber: `TRK-${Date.now()}-${entryCount + 1}`,
});

export default function MyTradePage() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('my-trade');
  const [entries, setEntries] = useState<HomeEntry[]>([]);
  const [editingId, setEditingId] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [form, setForm] = useState<EntryForm>(emptyForm);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  const fetchEntries = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await fetch('/api/home/v1?page=1&limit=1000', { cache: 'no-store' });
      const payload = (await response.json()) as ApiResponse<EntriesPayload>;
      if (!response.ok) throw new Error(payload.message || 'Failed to load entries');
      setEntries(payload.data.entries);
    } catch (fetchError) {
      setError(fetchError instanceof Error ? fetchError.message : 'Failed to load entries');
      setEntries([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  const summary = useMemo(() => {
    const placed = entries.filter(item => item.isPlaced).length;
    const profit = entries.filter(item => item.result.type === 'Profit').length;
    const loss = entries.filter(item => item.result.type === 'Loss').length;
    const net = entries.reduce((total, item) => (item.result.type === 'Profit' ? total + item.result.amount : total - item.result.amount), 0);

    return { placed, profit, loss, net };
  }, [entries]);

  const analytics = useMemo(() => {
    const total = entries.length;
    const placedRate = total ? Math.round((summary.placed / total) * 100) : 0;
    const profitRate = total ? Math.round((summary.profit / total) * 100) : 0;
    const totalVolume = entries.reduce((totalValue, item) => totalValue + item.volume, 0);
    const grossProfit = entries.filter(item => item.result.type === 'Profit').reduce((totalValue, item) => totalValue + item.result.amount, 0);
    const grossLoss = entries.filter(item => item.result.type === 'Loss').reduce((totalValue, item) => totalValue + item.result.amount, 0);
    const averageResult = total ? summary.net / total : 0;
    const bestEntry = entries.reduce<HomeEntry | null>((best, item) => {
      if (item.result.type !== 'Profit') return best;
      if (!best || item.result.amount > best.result.amount) return item;
      return best;
    }, null);
    const worstEntry = entries.reduce<HomeEntry | null>((worst, item) => {
      if (item.result.type !== 'Loss') return worst;
      if (!worst || item.result.amount > worst.result.amount) return item;
      return worst;
    }, null);

    return { placedRate, profitRate, totalVolume, grossProfit, grossLoss, averageResult, bestEntry, worstEntry };
  }, [entries, summary]);

  const startEdit = (entry: HomeEntry) => {
    setIsCreating(false);
    setEditingId(entry._id);
    setForm({
      openDate: entry.openDate,
      openTime: entry.openTime,
      closeDate: entry.closeDate,
      closeTime: entry.closeTime,
      volume: entry.volume,
      entry: entry.entry,
      tp: entry.tp,
      sl: entry.sl,
      result: {
        type: entry.result.type,
        amount: entry.result.amount,
      },
      isPlaced: entry.isPlaced,
      trickNumber: entry.trickNumber,
    });
  };

  const startCreate = () => {
    setEditingId('');
    setIsCreating(true);
    setForm(createDefaultForm(entries.length));
  };

  const cancelEdit = () => {
    setEditingId('');
    setIsCreating(false);
    setForm(emptyForm);
  };

  const saveEntry = async () => {
    if (!isCreating && !editingId) return;
    setIsSaving(true);
    setError('');
    try {
      const response = await fetch('/api/home/v1', {
        method: isCreating ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(isCreating ? form : { id: editingId, ...form }),
      });
      const payload = (await response.json()) as ApiResponse<HomeEntry>;
      if (!response.ok) throw new Error(payload.message || `Failed to ${isCreating ? 'add' : 'update'} entry`);
      setEntries(current => (isCreating ? [payload.data, ...current] : current.map(item => (item._id === editingId ? payload.data : item))));
      cancelEdit();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : `Failed to ${isCreating ? 'add' : 'update'} entry`);
    } finally {
      setIsSaving(false);
    }
  };

  const deleteEntry = async (id: string) => {
    setIsSaving(true);
    setError('');
    try {
      const response = await fetch('/api/home/v1', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      const payload = (await response.json()) as ApiResponse<{ deletedCount: number }>;
      if (!response.ok) throw new Error(payload.message || 'Failed to delete entry');
      setEntries(current => current.filter(item => item._id !== id));
      if (editingId === id) cancelEdit();
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : 'Failed to delete entry');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl space-y-4 p-3 md:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-emerald-300/60">Home Entry API</p>
          <h1 className="text-3xl font-black tracking-tight text-white">My Trade Manager</h1>
          <p className="mt-1 text-xs text-white/45">Edit and delete the same records shown on the home page.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button onClick={startCreate} disabled={isSaving} className="bg-lime-500/20 text-lime-200 border border-lime-400/30 hover:bg-lime-500/30">
            <PlusCircle size={15} className="mr-2" />
            Add Entry
          </Button>
          <Button onClick={fetchEntries} disabled={isLoading || isSaving} className="bg-emerald-500/20 text-emerald-200 border border-emerald-400/30 hover:bg-emerald-500/30">
            <RefreshCcw size={15} className="mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {error && <div className="rounded-lg border border-red-400/30 bg-red-500/10 px-3 py-2 text-sm font-semibold text-red-200">{error}</div>}

      <div className="flex w-fit gap-1 rounded-lg border border-white/10 bg-white/5 p-1">
        {[
          { id: 'my-trade', label: 'My trade' },
          { id: 'analytics', label: 'Analitics' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as ActiveTab)}
            className={`rounded-md px-4 py-2 text-sm font-bold transition ${
              activeTab === tab.id ? 'bg-emerald-400/20 text-emerald-100 shadow-[0_0_20px_rgba(52,211,153,0.14)]' : 'text-white/45 hover:bg-white/10 hover:text-white/75'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
        {[
          { label: 'Total', value: entries.length, icon: BarChart2, tone: 'text-white' },
          { label: 'Placed', value: summary.placed, icon: CheckCircle2, tone: 'text-emerald-300' },
          { label: 'Profit / Loss', value: `${summary.profit} / ${summary.loss}`, icon: Clock, tone: 'text-cyan-300' },
          { label: 'Net', value: `${summary.net >= 0 ? '+' : '-'}$${Math.abs(summary.net)}`, icon: summary.net >= 0 ? CheckCircle2 : XCircle, tone: summary.net >= 0 ? 'text-lime-300' : 'text-rose-300' },
        ].map(item => (
          <div key={item.label} className="rounded-lg border border-white/10 bg-white/5 p-3">
            <div className="flex items-center gap-2 text-white/40">
              <item.icon size={15} />
              <p className="text-[10px] font-bold uppercase tracking-[0.2em]">{item.label}</p>
            </div>
            <p className={`mt-2 text-2xl font-black ${item.tone}`}>{item.value}</p>
          </div>
        ))}
      </div>

      {activeTab === 'analytics' && (
        <section className="rounded-lg border border-white/10 bg-white/5 p-3">
          <div className="mb-3 flex items-center justify-between gap-2">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-cyan-300/60">Analytics</p>
              <h2 className="text-xl font-black text-white">Performance Overview</h2>
            </div>
            <Badge className={summary.net >= 0 ? 'border-lime-400/30 bg-lime-500/15 text-lime-200' : 'border-rose-400/30 bg-rose-500/15 text-rose-200'}>
              {summary.net >= 0 ? 'Positive' : 'Negative'} Net
            </Badge>
          </div>

          <div className="grid gap-3 lg:grid-cols-[1.2fr_0.8fr]">
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
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${item.value}%` }}
                      className={`h-full rounded-full bg-gradient-to-r ${item.tone}`}
                      transition={{ duration: 0.6 }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              {[
                ['Total Volume', analytics.totalVolume.toFixed(2), 'text-emerald-200'],
                ['Gross Profit', `$${analytics.grossProfit}`, 'text-lime-300'],
                ['Gross Loss', `$${analytics.grossLoss}`, 'text-rose-300'],
                [
                  'Avg Result',
                  `${analytics.averageResult >= 0 ? '+' : '-'}$${Math.abs(analytics.averageResult).toFixed(2)}`,
                  analytics.averageResult >= 0 ? 'text-lime-300' : 'text-rose-300',
                ],
                ['Best Trick', analytics.bestEntry?.trickNumber || '-', 'text-cyan-200'],
                ['Worst Trick', analytics.worstEntry?.trickNumber || '-', 'text-amber-200'],
              ].map(([label, value, tone]) => (
                <div key={label} className="rounded-md border border-white/10 bg-black/20 px-2 py-2">
                  <p className="text-[10px] uppercase tracking-[0.18em] text-white/35">{label}</p>
                  <p className={`mt-1 truncate font-black ${tone}`}>{value}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {activeTab === 'my-trade' && (editingId || isCreating) && (
        <motion.section initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-lg border border-emerald-400/20 bg-emerald-500/10 p-3">
          <div className="mb-3 flex items-center justify-between gap-2">
            <h2 className="text-lg font-black text-white">{isCreating ? 'Add Entry' : 'Edit Entry'}</h2>
            <Button size="sm" variant="outline" onClick={cancelEdit} className="border-white/15 text-white/70 hover:bg-white/10">
              Cancel
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            {[
              ['Open Date', 'openDate', 'date'],
              ['Open Time', 'openTime', 'time'],
              ['Close Date', 'closeDate', 'date'],
              ['Close Time', 'closeTime', 'time'],
              ['Volume', 'volume', 'number'],
              ['Entry', 'entry', 'number'],
              ['TP', 'tp', 'number'],
              ['SL', 'sl', 'number'],
              ['Trick Number', 'trickNumber', 'text'],
            ].map(([label, key, type]) => (
              <div key={key} className="space-y-1">
                <Label className="text-xs uppercase tracking-widest text-white/55">{label}</Label>
                <Input
                  type={type}
                  step={type === 'number' ? '0.00001' : undefined}
                  value={form[key as keyof EntryForm] as string | number}
                  onChange={event =>
                    setForm(current => ({
                      ...current,
                      [key]: type === 'number' ? parseFloat(event.target.value) || 0 : event.target.value,
                    }))
                  }
                  className={inputCls}
                />
              </div>
            ))}

            <div className="space-y-1">
              <Label className="text-xs uppercase tracking-widest text-white/55">Result</Label>
              <Select value={form.result.type} onValueChange={value => setForm(current => ({ ...current, result: { ...current.result, type: value as ResultType } }))}>
                <SelectTrigger className={inputCls}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-950 text-white border-white/20">
                  <SelectItem value="Profit">Profit</SelectItem>
                  <SelectItem value="Loss">Loss</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label className="text-xs uppercase tracking-widest text-white/55">Result Amount</Label>
              <Input
                type="number"
                value={form.result.amount}
                onChange={event => setForm(current => ({ ...current, result: { ...current.result, amount: parseFloat(event.target.value) || 0 } }))}
                className={inputCls}
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs uppercase tracking-widest text-white/55">Placed</Label>
              <Select value={form.isPlaced ? 'true' : 'false'} onValueChange={value => setForm(current => ({ ...current, isPlaced: value === 'true' }))}>
                <SelectTrigger className={inputCls}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-950 text-white border-white/20">
                  <SelectItem value="true">Placed</SelectItem>
                  <SelectItem value="false">Not Placed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button onClick={saveEntry} disabled={isSaving} className="mt-3 bg-emerald-500/20 text-emerald-200 border border-emerald-400/30 hover:bg-emerald-500/30">
            <Save size={15} className="mr-2" />
            {isSaving ? 'Saving...' : isCreating ? 'Create Entry' : 'Save Changes'}
          </Button>
        </motion.section>
      )}

      {activeTab === 'my-trade' && (
        <section className="space-y-2">
          {isLoading ? (
            <div className="rounded-lg border border-white/10 bg-white/5 p-10 text-center text-white/45">Loading entries...</div>
          ) : entries.length === 0 ? (
            <div className="rounded-lg border border-white/10 bg-white/5 p-10 text-center text-white/45">No home entries found.</div>
          ) : (
            entries.map(entry => (
            <motion.article key={entry._id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-lg border border-white/10 bg-white/5 p-3">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge className="border-emerald-400/30 bg-emerald-500/15 text-emerald-200">{entry.trickNumber}</Badge>
                    <Badge className={entry.isPlaced ? 'border-lime-400/30 bg-lime-500/15 text-lime-200' : 'border-slate-400/30 bg-slate-500/15 text-slate-200'}>
                      {entry.isPlaced ? 'Placed' : 'Not Placed'}
                    </Badge>
                    <Badge className={entry.result.type === 'Profit' ? 'border-lime-400/30 bg-lime-500/15 text-lime-200' : 'border-rose-400/30 bg-rose-500/15 text-rose-200'}>
                      {entry.result.type} ${entry.result.amount}
                    </Badge>
                  </div>
                  <p className="mt-2 text-xs text-white/45">
                    Open {entry.openDate} at {entry.openTime} · Close {entry.closeDate || '-'} at {entry.closeTime || '-'}
                  </p>
                </div>

                <div className="flex gap-2">
                  <Button size="sm" onClick={() => startEdit(entry)} className="bg-cyan-500/15 text-cyan-200 border border-cyan-400/30 hover:bg-cyan-500/25">
                    <Pencil size={14} className="mr-1.5" />
                    Edit
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button size="sm" disabled={isSaving} className="bg-red-500/15 text-red-200 border border-red-400/30 hover:bg-red-500/25">
                        <Trash2 size={14} className="mr-1.5" />
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="border-red-400/25 bg-slate-950 text-white">
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete entry?</AlertDialogTitle>
                        <AlertDialogDescription className="text-white/55">
                          This will permanently remove {entry.trickNumber} from the dashboard and home page.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="border-white/15 bg-white/5 text-white hover:bg-white/10">Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => deleteEntry(entry._id)} className="bg-red-500 text-white hover:bg-red-600">
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2 text-xs md:grid-cols-4">
                {[
                  ['Volume', entry.volume],
                  ['Entry', entry.entry],
                  ['TP', entry.tp],
                  ['SL', entry.sl],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-md border border-white/10 bg-black/20 px-2 py-2">
                    <p className="text-[10px] uppercase tracking-[0.18em] text-white/35">{label}</p>
                    <p className="mt-1 font-bold text-white">{value}</p>
                  </div>
                ))}
              </div>
            </motion.article>
            ))
          )}
        </section>
      )}
    </div>
  );
}
