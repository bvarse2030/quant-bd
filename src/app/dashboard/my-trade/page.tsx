/*
|-----------------------------------------
| setting up Page for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Quant BD, May, 2026
|-----------------------------------------
*/

'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Camera,
  Trash2,
  PlusCircle,
  TrendingUp,
  TrendingDown,
  Minus,
  StickyNote,
  BarChart2,
  ListOrdered,
  ClipboardPen,
  X,
} from 'lucide-react';

import { useSession } from '@/lib/auth-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type TradeDirection = 'buy_stop' | 'sell_stop';
type TradeOutcome = 'profit' | 'loss' | 'draw';
type TradeResult = 'win' | 'lose' | 'pending';
type ActiveView = 'form' | 'history' | 'analysis';

interface TradeImage {
  type: '15min' | '1hr';
  dataUrl: string;
}

interface Trade {
  id: string;
  authorEmail: string;
  lot: number;
  entryPrice: number;
  TP1: number;
  TP2: number;
  SL: number;
  result: TradeResult;
  time: string;
  direction: TradeDirection;
  outcome: TradeOutcome;
  tradingStartDate: string;
  tradingEndDate: string;
  tradingStartTime: string;
  tradingEndTime: string;
  note: string;
  images: TradeImage[];
  createdAt: string;
}

type TradeFormState = Omit<Trade, 'id' | 'authorEmail' | 'createdAt'>;

const STORAGE_KEY = 'quant_trades';
const NOTE_STORAGE_KEY = 'quant_quick_note';

const defaultForm: TradeFormState = {
  lot: 0.01,
  entryPrice: 0,
  TP1: 0,
  TP2: 0,
  SL: 0,
  result: 'pending',
  time: '',
  direction: 'buy_stop',
  outcome: 'profit',
  tradingStartDate: '',
  tradingEndDate: '',
  tradingStartTime: '',
  tradingEndTime: '',
  note: '',
  images: [],
};

const inputCls =
  'bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-indigo-400/60 focus-visible:ring-0 focus-visible:ring-offset-0';

export default function MyTradePage() {
  const session = useSession();
  const email = session?.data?.user?.email ?? '';

  const [trades, setTrades] = useState<Trade[]>([]);
  const [form, setForm] = useState<TradeFormState>(defaultForm);
  const [view, setView] = useState<ActiveView>('form');
  const [pendingImages, setPendingImages] = useState<TradeImage[]>([]);
  const [quickNote, setQuickNote] = useState('');
  const [showNotePanel, setShowNotePanel] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);

  const img15Ref = useRef<HTMLInputElement>(null);
  const img1hRef = useRef<HTMLInputElement>(null);
  const noteRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) setTrades(JSON.parse(stored) as Trade[]);
    const note = localStorage.getItem(NOTE_STORAGE_KEY);
    if (note) setQuickNote(note);
  }, []);

  const persistTrades = (updated: Trade[]) => {
    setTrades(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const handleImageUpload = (type: '15min' | '1hr', file: File) => {
    const reader = new FileReader();
    reader.onload = e => {
      const dataUrl = e.target?.result as string;
      setPendingImages(prev => [...prev.filter(i => i.type !== type), { type, dataUrl }]);
    };
    reader.readAsDataURL(file);
  };

  const handleTakeTrade = () => {
    if (!form.entryPrice || !form.SL) return;
    const newTrade: Trade = {
      id: crypto.randomUUID(),
      authorEmail: email,
      ...form,
      images: pendingImages,
      createdAt: new Date().toISOString(),
    };
    persistTrades([newTrade, ...trades]);
    setForm(defaultForm);
    setPendingImages([]);
  };

  const handleClearTrades = () => {
    if (!confirmClear) {
      setConfirmClear(true);
      return;
    }
    persistTrades([]);
    setConfirmClear(false);
  };

  const handleSaveNote = () => {
    localStorage.setItem(NOTE_STORAGE_KEY, quickNote);
    setShowNotePanel(false);
  };

  // ── analysis ──────────────────────────────────────────────────────────────
  const total = trades.length;
  const wins = trades.filter(t => t.result === 'win').length;
  const losses = trades.filter(t => t.result === 'lose').length;
  const pending = trades.filter(t => t.result === 'pending').length;
  const winRate = total > 0 ? ((wins / total) * 100).toFixed(1) : '0.0';
  const profitCount = trades.filter(t => t.outcome === 'profit').length;
  const lossCount = trades.filter(t => t.outcome === 'loss').length;
  const drawCount = trades.filter(t => t.outcome === 'draw').length;
  const buyStopCount = trades.filter(t => t.direction === 'buy_stop').length;
  const sellStopCount = trades.filter(t => t.direction === 'sell_stop').length;

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-6">
      {/* ── Header ────────────────────────────────────────────────────────── */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">My Trade Journal</h1>
          <p className="text-white/50 text-xs mt-1">{email}</p>
        </div>

        {/* Utility toolbar */}
        <div className="flex gap-2 flex-wrap">
          <Button
            size="sm"
            onClick={() => img15Ref.current?.click()}
            className="bg-blue-500/20 border border-blue-400/30 text-blue-300 hover:bg-blue-500/30"
          >
            <Camera size={14} className="mr-1.5" />
            15 Min
            {pendingImages.find(i => i.type === '15min') && (
              <span className="ml-1.5 w-1.5 h-1.5 rounded-full bg-blue-300 inline-block" />
            )}
          </Button>
          <Button
            size="sm"
            onClick={() => img1hRef.current?.click()}
            className="bg-purple-500/20 border border-purple-400/30 text-purple-300 hover:bg-purple-500/30"
          >
            <Camera size={14} className="mr-1.5" />
            1 Hour
            {pendingImages.find(i => i.type === '1hr') && (
              <span className="ml-1.5 w-1.5 h-1.5 rounded-full bg-purple-300 inline-block" />
            )}
          </Button>
          <Button
            size="sm"
            onClick={() => {
              setShowNotePanel(v => !v);
              setTimeout(() => noteRef.current?.focus(), 100);
            }}
            className="bg-amber-500/20 border border-amber-400/30 text-amber-300 hover:bg-amber-500/30"
          >
            <StickyNote size={14} className="mr-1.5" />
            Note
          </Button>
          <Button
            size="sm"
            onClick={handleTakeTrade}
            className="bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 hover:bg-emerald-500/30"
          >
            <PlusCircle size={14} className="mr-1.5" />
            Take Trade
          </Button>
          <Button
            size="sm"
            onClick={handleClearTrades}
            onBlur={() => setConfirmClear(false)}
            variant="outline"
            className="border-red-400/30 text-red-300 hover:bg-red-500/10"
          >
            <Trash2 size={14} className="mr-1.5" />
            {confirmClear ? 'Confirm Clear?' : 'Clear Trades'}
          </Button>
        </div>
      </div>

      {/* Hidden file inputs */}
      <input
        ref={img15Ref}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={e => e.target.files?.[0] && handleImageUpload('15min', e.target.files[0])}
      />
      <input
        ref={img1hRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={e => e.target.files?.[0] && handleImageUpload('1hr', e.target.files[0])}
      />

      {/* ── Quick Note panel ──────────────────────────────────────────────── */}
      <AnimatePresence>
        {showNotePanel && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-amber-500/10 border border-amber-400/20 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-amber-300 font-semibold text-sm flex items-center gap-2">
                  <StickyNote size={14} /> Quick Note
                </span>
                <button onClick={() => setShowNotePanel(false)} className="text-white/40 hover:text-white/70">
                  <X size={14} />
                </button>
              </div>
              <Textarea
                ref={noteRef}
                value={quickNote}
                onChange={e => setQuickNote(e.target.value)}
                className={`${inputCls} resize-none`}
                placeholder="Jot down observations, market context, setup reasons..."
                rows={4}
              />
              <Button size="sm" onClick={handleSaveNote} className="bg-amber-500/20 border border-amber-400/30 text-amber-300 hover:bg-amber-500/30">
                Save Note
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Pending image previews ─────────────────────────────────────────── */}
      {pendingImages.length > 0 && (
        <div className="flex gap-4 flex-wrap">
          {pendingImages.map(img => (
            <div key={img.type} className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.dataUrl} alt={img.type} className="w-48 h-28 object-cover rounded-xl border border-white/20" />
              <Badge className="absolute top-2 left-2 bg-black/60 text-white text-[10px] border-0">{img.type}</Badge>
              <button
                onClick={() => setPendingImages(prev => prev.filter(i => i.type !== img.type))}
                className="absolute top-1.5 right-1.5 bg-red-500/70 hover:bg-red-500 rounded-full p-0.5 text-white"
              >
                <X size={10} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* ── View tabs ─────────────────────────────────────────────────────── */}
      <div className="flex gap-1 bg-white/5 border border-white/10 rounded-xl p-1 w-fit">
        {(
          [
            { v: 'form', icon: ClipboardPen, label: 'New Trade' },
            { v: 'history', icon: ListOrdered, label: 'History' },
            { v: 'analysis', icon: BarChart2, label: 'Analysis' },
          ] as const
        ).map(({ v, icon: Icon, label }) => (
          <button
            key={v}
            onClick={() => setView(v)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              view === v ? 'bg-white/20 text-white' : 'text-white/50 hover:text-white/80'
            }`}
          >
            <Icon size={14} />
            {label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* ── FORM VIEW ──────────────────────────────────────────────────── */}
        {view === 'form' && (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 bg-white/5 border border-white/10 rounded-2xl p-6">
              <div className="space-y-1">
                <Label className="text-white/60 text-xs uppercase tracking-widest">Lot Size</Label>
                <Input
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={form.lot}
                  onChange={e => setForm(f => ({ ...f, lot: parseFloat(e.target.value) || 0.01 }))}
                  className={inputCls}
                  placeholder="0.01"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-white/60 text-xs uppercase tracking-widest">Entry Price</Label>
                <Input
                  type="number"
                  step="0.00001"
                  value={form.entryPrice || ''}
                  onChange={e => setForm(f => ({ ...f, entryPrice: parseFloat(e.target.value) || 0 }))}
                  className={inputCls}
                  placeholder="0.00000"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-white/60 text-xs uppercase tracking-widest">TP 1</Label>
                <Input
                  type="number"
                  step="0.00001"
                  value={form.TP1 || ''}
                  onChange={e => setForm(f => ({ ...f, TP1: parseFloat(e.target.value) || 0 }))}
                  className={`${inputCls} text-emerald-300`}
                  placeholder="0.00000"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-white/60 text-xs uppercase tracking-widest">TP 2</Label>
                <Input
                  type="number"
                  step="0.00001"
                  value={form.TP2 || ''}
                  onChange={e => setForm(f => ({ ...f, TP2: parseFloat(e.target.value) || 0 }))}
                  className={`${inputCls} text-emerald-300`}
                  placeholder="0.00000"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-white/60 text-xs uppercase tracking-widest">Stop Loss</Label>
                <Input
                  type="number"
                  step="0.00001"
                  value={form.SL || ''}
                  onChange={e => setForm(f => ({ ...f, SL: parseFloat(e.target.value) || 0 }))}
                  className={`${inputCls} text-rose-300`}
                  placeholder="0.00000"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-white/60 text-xs uppercase tracking-widest">Time</Label>
                <Input
                  type="time"
                  value={form.time}
                  onChange={e => setForm(f => ({ ...f, time: e.target.value }))}
                  className={inputCls}
                />
              </div>

              <div className="space-y-1">
                <Label className="text-white/60 text-xs uppercase tracking-widest">Direction</Label>
                <Select
                  value={form.direction}
                  onValueChange={v => setForm(f => ({ ...f, direction: v as TradeDirection }))}
                >
                  <SelectTrigger className={inputCls}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-white/20 text-white">
                    <SelectItem value="buy_stop">▲ Buy Stop</SelectItem>
                    <SelectItem value="sell_stop">▼ Sell Stop</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label className="text-white/60 text-xs uppercase tracking-widest">Result</Label>
                <Select
                  value={form.result}
                  onValueChange={v => setForm(f => ({ ...f, result: v as TradeResult }))}
                >
                  <SelectTrigger className={inputCls}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-white/20 text-white">
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="win">Win</SelectItem>
                    <SelectItem value="lose">Lose</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label className="text-white/60 text-xs uppercase tracking-widest">Outcome</Label>
                <Select
                  value={form.outcome}
                  onValueChange={v => setForm(f => ({ ...f, outcome: v as TradeOutcome }))}
                >
                  <SelectTrigger className={inputCls}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-white/20 text-white">
                    <SelectItem value="profit">Profit</SelectItem>
                    <SelectItem value="loss">Loss</SelectItem>
                    <SelectItem value="draw">Draw</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label className="text-white/60 text-xs uppercase tracking-widest">Start Date</Label>
                <Input
                  type="date"
                  value={form.tradingStartDate}
                  onChange={e => setForm(f => ({ ...f, tradingStartDate: e.target.value }))}
                  className={inputCls}
                />
              </div>

              <div className="space-y-1">
                <Label className="text-white/60 text-xs uppercase tracking-widest">End Date</Label>
                <Input
                  type="date"
                  value={form.tradingEndDate}
                  onChange={e => setForm(f => ({ ...f, tradingEndDate: e.target.value }))}
                  className={inputCls}
                />
              </div>

              <div className="space-y-1">
                <Label className="text-white/60 text-xs uppercase tracking-widest">Start Time</Label>
                <Input
                  type="time"
                  value={form.tradingStartTime}
                  onChange={e => setForm(f => ({ ...f, tradingStartTime: e.target.value }))}
                  className={inputCls}
                />
              </div>

              <div className="space-y-1">
                <Label className="text-white/60 text-xs uppercase tracking-widest">End Time</Label>
                <Input
                  type="time"
                  value={form.tradingEndTime}
                  onChange={e => setForm(f => ({ ...f, tradingEndTime: e.target.value }))}
                  className={inputCls}
                />
              </div>

              <div className="space-y-1 md:col-span-2 lg:col-span-3">
                <Label className="text-white/60 text-xs uppercase tracking-widest">Trade Note</Label>
                <Textarea
                  value={form.note}
                  onChange={e => setForm(f => ({ ...f, note: e.target.value }))}
                  className={`${inputCls} resize-none`}
                  placeholder="Setup reasoning, confluences, market context..."
                  rows={3}
                />
              </div>
            </div>

            {!form.entryPrice && (
              <p className="text-white/40 text-xs mt-2 ml-1">Entry price and stop loss are required to save a trade.</p>
            )}
          </motion.div>
        )}

        {/* ── HISTORY VIEW ───────────────────────────────────────────────── */}
        {view === 'history' && (
          <motion.div
            key="history"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="space-y-4"
          >
            {trades.length === 0 ? (
              <div className="text-center text-white/40 py-24">No trades recorded yet.</div>
            ) : (
              trades.map(trade => (
                <div key={trade.id} className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-4">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex gap-2 flex-wrap items-center">
                      <Badge
                        className={
                          trade.direction === 'buy_stop'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30'
                            : 'bg-rose-500/20 text-rose-300 border border-rose-400/30'
                        }
                      >
                        {trade.direction === 'buy_stop' ? '▲ Buy Stop' : '▼ Sell Stop'}
                      </Badge>
                      <Badge
                        className={
                          trade.result === 'win'
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30'
                            : trade.result === 'lose'
                            ? 'bg-red-500/20 text-red-300 border-red-400/30'
                            : 'bg-yellow-500/20 text-yellow-300 border-yellow-400/30'
                        }
                      >
                        {trade.result}
                      </Badge>
                      <Badge
                        className={
                          trade.outcome === 'profit'
                            ? 'bg-teal-500/20 text-teal-300 border-teal-400/30'
                            : trade.outcome === 'loss'
                            ? 'bg-rose-500/20 text-rose-300 border-rose-400/30'
                            : 'bg-slate-500/20 text-slate-300 border-slate-400/30'
                        }
                      >
                        {trade.outcome}
                      </Badge>
                    </div>
                    <span className="text-white/30 text-xs font-mono">
                      {new Date(trade.createdAt).toLocaleString()}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                    {[
                      { label: 'Lot', value: trade.lot, cls: 'text-white' },
                      { label: 'Entry', value: trade.entryPrice, cls: 'text-white font-mono' },
                      { label: 'TP1', value: trade.TP1, cls: 'text-emerald-300 font-mono' },
                      { label: 'TP2', value: trade.TP2, cls: 'text-emerald-300 font-mono' },
                      { label: 'SL', value: trade.SL, cls: 'text-rose-300 font-mono' },
                    ].map(cell => (
                      <div key={cell.label}>
                        <p className="text-white/40 text-[10px] uppercase tracking-widest mb-0.5">{cell.label}</p>
                        <p className={`text-sm font-semibold ${cell.cls}`}>{cell.value}</p>
                      </div>
                    ))}
                  </div>

                  {(trade.tradingStartDate || trade.tradingStartTime) && (
                    <div className="flex gap-6 text-xs text-white/40 font-mono">
                      {trade.tradingStartDate && (
                        <span>
                          Start: {trade.tradingStartDate}
                          {trade.tradingStartTime && ` · ${trade.tradingStartTime}`}
                        </span>
                      )}
                      {trade.tradingEndDate && (
                        <span>
                          End: {trade.tradingEndDate}
                          {trade.tradingEndTime && ` · ${trade.tradingEndTime}`}
                        </span>
                      )}
                    </div>
                  )}

                  {trade.note && (
                    <p className="text-white/60 text-sm bg-white/5 rounded-xl px-4 py-3 border border-white/5">
                      {trade.note}
                    </p>
                  )}

                  {trade.images.length > 0 && (
                    <div className="flex gap-3 flex-wrap">
                      {trade.images.map(img => (
                        <div key={img.type} className="relative">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={img.dataUrl}
                            alt={img.type}
                            className="w-44 h-28 object-cover rounded-xl border border-white/20"
                          />
                          <Badge className="absolute top-2 left-2 bg-black/60 text-white text-[10px] border-0">
                            {img.type}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
          </motion.div>
        )}

        {/* ── ANALYSIS VIEW ──────────────────────────────────────────────── */}
        {view === 'analysis' && (
          <motion.div
            key="analysis"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Total Trades', value: total },
                { label: 'Win Rate', value: `${winRate}%` },
                { label: 'Wins', value: wins },
                { label: 'Losses', value: losses },
              ].map(card => (
                <div key={card.label} className="bg-white/5 border border-white/10 rounded-2xl p-5">
                  <p className="text-white/40 text-[10px] uppercase tracking-widest mb-1">{card.label}</p>
                  <p className="text-3xl font-black text-white">{card.value}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5 flex items-center gap-4">
                <TrendingUp className="text-emerald-400 w-8 h-8 shrink-0" />
                <div>
                  <p className="text-white/40 text-xs uppercase tracking-widest">Profit Trades</p>
                  <p className="text-2xl font-bold text-emerald-400">{profitCount}</p>
                </div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5 flex items-center gap-4">
                <TrendingDown className="text-rose-400 w-8 h-8 shrink-0" />
                <div>
                  <p className="text-white/40 text-xs uppercase tracking-widest">Loss Trades</p>
                  <p className="text-2xl font-bold text-rose-400">{lossCount}</p>
                </div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5 flex items-center gap-4">
                <Minus className="text-slate-400 w-8 h-8 shrink-0" />
                <div>
                  <p className="text-white/40 text-xs uppercase tracking-widest">Draw Trades</p>
                  <p className="text-2xl font-bold text-slate-400">{drawCount}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
                <h3 className="text-white font-bold">Direction Breakdown</h3>
                <div className="flex gap-8">
                  <div>
                    <p className="text-white/40 text-xs uppercase tracking-widest mb-1">Buy Stop</p>
                    <p className="text-2xl font-bold text-emerald-400">{buyStopCount}</p>
                  </div>
                  <div>
                    <p className="text-white/40 text-xs uppercase tracking-widest mb-1">Sell Stop</p>
                    <p className="text-2xl font-bold text-rose-400">{sellStopCount}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
                <h3 className="text-white font-bold">Result Breakdown</h3>
                <div className="flex gap-8">
                  <div>
                    <p className="text-white/40 text-xs uppercase tracking-widest mb-1">Win</p>
                    <p className="text-2xl font-bold text-emerald-400">{wins}</p>
                  </div>
                  <div>
                    <p className="text-white/40 text-xs uppercase tracking-widest mb-1">Lose</p>
                    <p className="text-2xl font-bold text-rose-400">{losses}</p>
                  </div>
                  <div>
                    <p className="text-white/40 text-xs uppercase tracking-widest mb-1">Pending</p>
                    <p className="text-2xl font-bold text-yellow-400">{pending}</p>
                  </div>
                </div>
              </div>
            </div>

            {total > 0 && (
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <h3 className="text-white font-bold mb-4">Win Rate Bar</h3>
                <div className="w-full bg-white/10 rounded-full h-4 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-700"
                    style={{ width: `${winRate}%` }}
                  />
                </div>
                <p className="text-white/50 text-xs mt-2">{winRate}% win rate across {total} trade{total !== 1 ? 's' : ''}</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
