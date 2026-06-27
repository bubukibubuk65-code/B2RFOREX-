/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import {
  TrendingUp,
  TrendingDown,
  Plus,
  BookOpen,
  MessageSquare,
  ShieldAlert,
  Calendar,
  Layers,
  Award,
  Download,
  Upload,
  Trash2,
  Edit3,
  Search,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Play,
  ArrowRight,
  ChevronRight,
  Heart,
  HelpCircle,
  Clock,
  Briefcase,
  User,
  Activity
} from "lucide-react";

import { Trade, AccountSettings, Lesson, CourseModule } from "./types";
import { CURRENCY_PAIRS, STRATEGIES, EMOTIONS, SESSIONS, ACADEMY_COURSES, SEED_TRADES } from "./data";
import Mentor from "./components/Mentor";
import RiskCalculator from "./components/RiskCalculator";

export default function App() {
  // Navigation & Core States
  const [activeTab, setActiveTab] = useState<"dashboard" | "journal" | "academy" | "mentor" | "calculator">("dashboard");
  const [trades, setTrades] = useState<Trade[]>([]);
  const [account, setAccount] = useState<AccountSettings>({
    balance: 10000,
    currency: "USD",
    riskPerTrade: 1.0,
  });

  // UI Modal State
  const [isNewTradeModalOpen, setIsNewTradeModalOpen] = useState(false);
  const [editingTrade, setEditingTrade] = useState<Trade | null>(null);

  // Form States
  const [formPair, setFormPair] = useState("EUR/USD");
  const [formType, setFormType] = useState<"BUY" | "SELL">("BUY");
  const [formEntryPrice, setFormEntryPrice] = useState("");
  const [formExitPrice, setFormExitPrice] = useState("");
  const [formLotSize, setFormLotSize] = useState("0.10");
  const [formStopLoss, setFormStopLoss] = useState("");
  const [formTakeProfit, setFormTakeProfit] = useState("");
  const [formStrategy, setFormStrategy] = useState("Smart Money Concepts (SMC)");
  const [formEmotion, setFormEmotion] = useState("Patient (Disciplined)");
  const [formSession, setFormSession] = useState("London Session");
  const [formNotes, setFormNotes] = useState("");
  const [formOutcome, setFormOutcome] = useState<"PROFIT" | "LOSS" | "BREAK_EVEN" | "RUNNING">("PROFIT");
  const [formProfit, setFormProfit] = useState("");

  // Journal Filters
  const [filterPair, setFilterPair] = useState("ALL");
  const [filterStrategy, setFilterStrategy] = useState("ALL");
  const [filterOutcome, setFilterOutcome] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  // Academy states
  const [activeModule, setActiveModule] = useState<CourseModule>(ACADEMY_COURSES[0]);
  const [activeLesson, setActiveLesson] = useState<Lesson>(ACADEMY_COURSES[0].lessons[0]);
  const [activePdfSlide, setActivePdfSlide] = useState(0);
  const [selectedQuizAnswers, setSelectedQuizAnswers] = useState<{ [key: number]: number }>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  // Simulated Live Forex Tickers to add live terminal aesthetic
  const [tickerPrices, setTickerPrices] = useState({
    "EUR/USD": 1.08221,
    "GBP/USD": 1.26442,
    "USD/JPY": 154.215,
    "XAU/USD": 2321.45,
    "BTC/USD": 64285.50
  });

  // Load Initial Data from localStorage or seed
  useEffect(() => {
    const storedTrades = localStorage.getItem("fx_trades");
    const storedAccount = localStorage.getItem("fx_account");

    if (storedTrades) {
      setTrades(JSON.parse(storedTrades));
    } else {
      setTrades(SEED_TRADES);
      localStorage.setItem("fx_trades", JSON.stringify(SEED_TRADES));
    }

    if (storedAccount) {
      setAccount(JSON.parse(storedAccount));
    } else {
      localStorage.setItem("fx_account", JSON.stringify(account));
    }
  }, []);

  // Sync state helpers
  const saveTradesToStorage = (updatedTrades: Trade[]) => {
    setTrades(updatedTrades);
    localStorage.setItem("fx_trades", JSON.stringify(updatedTrades));
  };

  const saveAccountToStorage = (updatedAccount: AccountSettings) => {
    setAccount(updatedAccount);
    localStorage.setItem("fx_account", JSON.stringify(updatedAccount));
  };

  // Live market price ticking simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setTickerPrices((prev) => {
        const change = (Math.random() - 0.5) * 0.0005;
        const goldChange = (Math.random() - 0.5) * 0.8;
        const btcChange = (Math.random() - 0.5) * 15;
        return {
          "EUR/USD": Number((prev["EUR/USD"] + change).toFixed(5)),
          "GBP/USD": Number((prev["GBP/USD"] + change).toFixed(5)),
          "USD/JPY": Number((prev["USD/JPY"] + change * 100).toFixed(3)),
          "XAU/USD": Number((prev["XAU/USD"] + goldChange).toFixed(2)),
          "BTC/USD": Number((prev["BTC/USD"] + btcChange).toFixed(2)),
        };
      });
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Statistics Calculation
  const totalTradesCount = trades.length;
  const closedTrades = trades.filter((t) => t.outcome !== "RUNNING");
  const winTrades = closedTrades.filter((t) => t.outcome === "PROFIT");
  const lossTrades = closedTrades.filter((t) => t.outcome === "LOSS");
  
  const winRate = closedTrades.length > 0 
    ? Math.round((winTrades.length / closedTrades.length) * 100) 
    : 0;

  const totalPnL = trades.reduce((sum, t) => sum + (t.profitAmount || 0), 0);
  const currentNetBalance = account.balance + totalPnL;

  // Average Risk Reward Ratio
  const averageRR = closedTrades.length > 0
    ? Number((closedTrades.reduce((sum, t) => sum + (t.riskReward || 0), 0) / closedTrades.length).toFixed(1))
    : 1.5;

  // Max Drawdown estimate
  const highestBalance = account.balance;
  const currentDrawdown = totalPnL < 0 
    ? Number(((Math.abs(totalPnL) / highestBalance) * 100).toFixed(1)) 
    : 0;

  // Strategy Win Rate stats
  const strategyStats = STRATEGIES.map((strat) => {
    const stratTrades = closedTrades.filter((t) => t.strategy === strat);
    const stratWins = stratTrades.filter((t) => t.outcome === "PROFIT");
    const rate = stratTrades.length > 0 ? Math.round((stratWins.length / stratTrades.length) * 100) : 0;
    return { name: strat, count: stratTrades.length, winRate: rate };
  }).filter((s) => s.count > 0);

  // Emotional triggers analyze
  const emotionalStats = EMOTIONS.map((emo) => {
    const emoTrades = closedTrades.filter((t) => t.emotion === emo);
    const losses = emoTrades.filter((t) => t.outcome === "LOSS").length;
    const wins = emoTrades.filter((t) => t.outcome === "PROFIT").length;
    return { name: emo, total: emoTrades.length, wins, losses };
  }).filter((e) => e.total > 0);

  // Form Management
  const openNewTradeModal = () => {
    setEditingTrade(null);
    setFormPair("EUR/USD");
    setFormType("BUY");
    setFormEntryPrice("");
    setFormExitPrice("");
    setFormLotSize("0.10");
    setFormStopLoss("");
    setFormTakeProfit("");
    setFormStrategy("Smart Money Concepts (SMC)");
    setFormEmotion("Patient (Disciplined)");
    setFormSession("London Session");
    setFormNotes("");
    setFormOutcome("RUNNING");
    setFormProfit("");
    setIsNewTradeModalOpen(true);
  };

  const openEditTradeModal = (trade: Trade) => {
    setEditingTrade(trade);
    setFormPair(trade.pair);
    setFormType(trade.type);
    setFormEntryPrice(trade.entryPrice.toString());
    setFormExitPrice(trade.exitPrice?.toString() || "");
    setFormLotSize(trade.lotSize.toString());
    setFormStopLoss(trade.stopLoss?.toString() || "");
    setFormTakeProfit(trade.takeProfit?.toString() || "");
    setFormStrategy(trade.strategy);
    setFormEmotion(trade.emotion);
    setFormSession(trade.session);
    setFormNotes(trade.notes || "");
    setFormOutcome(trade.outcome);
    setFormProfit(trade.profitAmount?.toString() || "");
    setIsNewTradeModalOpen(true);
  };

  const handleSaveTrade = (e: React.FormEvent) => {
    e.preventDefault();

    const entryPriceNum = parseFloat(formEntryPrice) || 0;
    const exitPriceNum = parseFloat(formExitPrice) || undefined;
    const lotSizeNum = parseFloat(formLotSize) || 0.10;
    const stopLossNum = parseFloat(formStopLoss) || undefined;
    const takeProfitNum = parseFloat(formTakeProfit) || undefined;
    const profitAmountNum = parseFloat(formProfit) || 0;

    // Automatic risk reward calculation if stoploss and takeproof are present
    let calculatedRR = 2.0;
    if (entryPriceNum && stopLossNum && takeProfitNum) {
      const risk = Math.abs(entryPriceNum - stopLossNum);
      const reward = Math.abs(takeProfitNum - entryPriceNum);
      if (risk > 0) {
        calculatedRR = Number((reward / risk).toFixed(1));
      }
    }

    const tradeData: Trade = {
      id: editingTrade ? editingTrade.id : `t-${Date.now()}`,
      pair: formPair,
      type: formType,
      entryPrice: entryPriceNum,
      exitPrice: exitPriceNum,
      lotSize: lotSizeNum,
      stopLoss: stopLossNum,
      takeProfit: takeProfitNum,
      entryTime: editingTrade ? editingTrade.entryTime : new Date().toISOString(),
      exitTime: formOutcome !== "RUNNING" ? (editingTrade?.exitTime || new Date().toISOString()) : undefined,
      outcome: formOutcome,
      profitAmount: formOutcome === "RUNNING" ? 0 : profitAmountNum,
      strategy: formStrategy,
      emotion: formEmotion,
      session: formSession,
      notes: formNotes,
      riskReward: calculatedRR
    };

    let updatedList: Trade[];
    if (editingTrade) {
      updatedList = trades.map((t) => (t.id === editingTrade.id ? tradeData : t));
    } else {
      updatedList = [tradeData, ...trades];
    }

    saveTradesToStorage(updatedList);
    setIsNewTradeModalOpen(false);
  };

  const handleDeleteTrade = (id: string) => {
    if (confirm("Are you sure you want to delete this trade from your journal?")) {
      const updated = trades.filter((t) => t.id !== id);
      saveTradesToStorage(updated);
    }
  };

  // Database actions: Reset, Export, Import
  const resetDatabaseToSeed = () => {
    if (confirm("This will replace all your current journal entries with professional seed setups. Continue?")) {
      saveTradesToStorage(SEED_TRADES);
      saveAccountToStorage({
        balance: 10000,
        currency: "USD",
        riskPerTrade: 1.0
      });
    }
  };

  const exportData = () => {
    const dataStr = JSON.stringify({ trades, account }, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `FX_Pro_Journal_Backup_${new Date().toISOString().slice(0,10)}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], "UTF-8");
      fileReader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (parsed.trades && Array.isArray(parsed.trades)) {
            saveTradesToStorage(parsed.trades);
            if (parsed.account) {
              saveAccountToStorage(parsed.account);
            }
            alert("Data successfully imported!");
          } else {
            alert("Invalid backup file format.");
          }
        } catch (error) {
          alert("Error parsing file.");
        }
      };
    }
  };

  // Generate dynamic performance curve chart coordinates
  const getPerformanceDataCoordinates = () => {
    const points: { x: number; y: number; balance: number }[] = [];
    let currentBal = account.balance;
    
    // Sort trades chronologically
    const sortedTrades = [...trades]
      .filter(t => t.outcome !== "RUNNING")
      .sort((a, b) => new Date(a.entryTime).getTime() - new Date(b.entryTime).getTime());

    // Initial point
    points.push({ x: 0, y: 80, balance: currentBal });

    if (sortedTrades.length === 0) {
      // Return a flat line
      return { path: "M0,80 L400,80", points, areaPath: "M0,80 L400,80 L400,100 L0,100 Z" };
    }

    const maxDelta = Math.max(...sortedTrades.map(t => Math.abs(t.profitAmount || 0)), 100);
    const widthStep = 400 / sortedTrades.length;

    let path = "M0,80";
    let areaPath = "M0,80";

    sortedTrades.forEach((trade, idx) => {
      currentBal += (trade.profitAmount || 0);
      const x = (idx + 1) * widthStep;
      // Map profit relative to a baseline
      const normalizedY = 80 - ((currentBal - account.balance) / (maxDelta * sortedTrades.length)) * 50;
      const safeY = Math.max(10, Math.min(90, normalizedY));
      
      path += ` L${x},${safeY}`;
      points.push({ x, y: safeY, balance: currentBal });
    });

    areaPath = path + ` L400,100 L0,100 Z`;

    return { path, points, areaPath };
  };

  const chartData = getPerformanceDataCoordinates();

  // Handle lesson selected
  const handleSelectLesson = (lesson: Lesson) => {
    setActiveLesson(lesson);
    setSelectedQuizAnswers({});
    setQuizSubmitted(false);
  };

  return (
    <div className="min-h-screen bg-[#0A0C10] text-[#E0E2E6] font-sans flex flex-col antialiased">
      
      {/* Upper Tick Tape Bar */}
      <div className="h-9 bg-[#07090D] border-b border-[#1E232B] flex items-center justify-between px-6 overflow-hidden">
        <div className="flex gap-6 items-center shrink-0">
          <div className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-[10px] text-[#8E9299] uppercase tracking-wider font-semibold">Live Market Rates</span>
          </div>
          {Object.entries(tickerPrices).map(([pair, price]) => {
            const isUp = pair.includes("EUR") || pair.includes("XAU") || pair.includes("BTC");
            return (
              <div key={pair} className="flex items-center gap-1.5 text-[11px] font-mono">
                <span className="text-slate-400 font-sans font-medium">{pair}:</span>
                <span className="text-slate-200 font-bold">{price}</span>
                <span className={isUp ? "text-emerald-400" : "text-rose-400"}>
                  {isUp ? "▲" : "▼"}
                </span>
              </div>
            );
          })}
        </div>
        <div className="hidden md:flex items-center gap-4 text-[10px] text-[#8E9299] font-medium">
          <span>Server Time: {new Date().toLocaleTimeString()}</span>
          <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase tracking-widest text-[9px]">
            No Auth Required
          </span>
        </div>
      </div>

      {/* Header Navigation */}
      <nav className="h-16 border-b border-[#1E232B] flex items-center justify-between px-6 bg-[#0F1218] sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center font-black text-white text-base shadow-lg shadow-blue-600/15 border border-blue-500/30">
            FX
          </div>
          <div>
            <span className="text-base font-bold tracking-tight text-white block">
              FXPRO <span className="text-blue-500 font-light">JOURNAL</span>
            </span>
            <span className="text-[9px] text-slate-500 block -mt-1 font-mono">INDEXEDDB ENABLED</span>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex gap-1 md:gap-2 text-sm text-[#8E9299]">
            {[
              { id: "dashboard", label: "Dashboard" },
              { id: "journal", label: "Trade Journal" },
              { id: "academy", label: "FX Academy" },
              { id: "mentor", label: "AI Coach" },
              { id: "calculator", label: "Risk Sizer" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3 py-2 rounded-lg text-xs md:text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? "text-white bg-[#1E232B] border-b-2 border-blue-500 rounded-b-none"
                    : "hover:text-white hover:bg-[#1E232B]/50"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <button
            onClick={openNewTradeModal}
            className="bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-lg shadow-blue-600/10 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">New Trade</span>
          </button>
        </div>
      </nav>

      {/* Main Content View Frame */}
      <main className="flex-1 p-4 md:p-6 max-w-7xl mx-auto w-full">
        
        {/* DASHBOARD TAB (BENTO GRID LAYOUT) */}
        {activeTab === "dashboard" && (
          <div className="space-y-6">
            
            {/* Bento Grid layout: 12-column grid system */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
              
              {/* Box 1: Core Performance Net Balance (col-span-4) */}
              <div className="md:col-span-4 bg-[#151921] rounded-2xl p-6 border border-[#1E232B] flex flex-col justify-between shadow-xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl group-hover:bg-blue-500/10 transition-all"></div>
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-[#8E9299] text-xs font-bold uppercase tracking-wider">Net Portfolio Balance</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-blue-500/10 text-blue-400 border border-blue-500/20">
                      LIVE ACCOUNT
                    </span>
                  </div>
                  <div className="text-4xl font-extrabold font-mono text-white tracking-tight">
                    ${currentNetBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                  
                  <div className="flex items-center gap-1.5 mt-2">
                    {totalPnL >= 0 ? (
                      <span className="text-emerald-400 text-sm font-bold flex items-center gap-0.5">
                        <TrendingUp className="w-4 h-4" />
                        +${totalPnL.toFixed(2)} (+{((totalPnL / account.balance) * 100).toFixed(1)}%)
                      </span>
                    ) : (
                      <span className="text-rose-400 text-sm font-bold flex items-center gap-0.5">
                        <TrendingDown className="w-4 h-4" />
                        -${Math.abs(totalPnL).toFixed(2)} (-{((Math.abs(totalPnL) / account.balance) * 100).toFixed(1)}%)
                      </span>
                    )}
                    <span className="text-[#8E9299] text-xs">all-time net return</span>
                  </div>
                </div>

                <div className="mt-6 pt-5 border-t border-[#1E232B] grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-[10px] text-[#8E9299] uppercase font-bold tracking-wider block">Deposited Capital</span>
                    <span className="text-base font-semibold font-mono text-slate-300">
                      ${account.balance.toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#8E9299] uppercase font-bold tracking-wider block">Risk Parameter</span>
                    <span className="text-base font-semibold font-mono text-slate-300">
                      {account.riskPerTrade}% / Trade
                    </span>
                  </div>
                </div>
              </div>

              {/* Box 2: Main Interactive Performance Curve Chart (col-span-8) */}
              <div className="md:col-span-8 bg-[#151921] rounded-2xl p-6 border border-[#1E232B] shadow-xl relative overflow-hidden flex flex-col justify-between">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-base font-bold text-white tracking-tight">Cumulative Equity Growth</h3>
                    <p className="text-[#8E9299] text-xs">P/L performance progression across closed journal positions</p>
                  </div>
                  <div className="flex bg-[#0A0C10] rounded-xl p-1 border border-[#1E232B]">
                    <button className="px-3 py-1 text-xs bg-[#1E232B] rounded-lg shadow text-white font-medium">Session Trades</button>
                  </div>
                </div>

                {/* SVG Performance graph */}
                <div className="relative h-44 w-full flex items-center justify-center">
                  <svg className="w-full h-full overflow-visible" viewBox="0 0 400 100" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="chartGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" style={{ stopColor: "rgba(59, 130, 246, 0.35)", stopOpacity: 1 }} />
                        <stop offset="100%" style={{ stopColor: "rgba(59, 130, 246, 0)", stopOpacity: 1 }} />
                      </linearGradient>
                    </defs>
                    
                    {/* Horizontal gridlines */}
                    <line x1="0" y1="20" x2="400" y2="20" stroke="#1E232B" strokeWidth="0.5" strokeDasharray="3,3" />
                    <line x1="0" y1="50" x2="400" y2="50" stroke="#1E232B" strokeWidth="0.5" strokeDasharray="3,3" />
                    <line x1="0" y1="80" x2="400" y2="80" stroke="#1E232B" strokeWidth="0.5" strokeDasharray="3,3" />

                    {/* Gradient Area */}
                    <path d={chartData.areaPath} fill="url(#chartGrad)" />
                    
                    {/* Growth Line */}
                    <path d={chartData.path} fill="none" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" />
                    
                    {/* Points markers */}
                    {chartData.points.map((pt, idx) => (
                      <g key={idx} className="group/dot cursor-pointer">
                        <circle cx={pt.x} cy={pt.y} r="3.5" fill="#3b82f6" stroke="#0A0C10" strokeWidth="1" />
                        <circle cx={pt.x} cy={pt.y} r="8" fill="transparent" />
                      </g>
                    ))}
                  </svg>
                  
                  {/* Floating labels for absolute transparency */}
                  {closedTrades.length === 0 && (
                    <div className="absolute inset-0 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs rounded-xl">
                      <p className="text-xs text-slate-400 italic">No trades in journal to compute equity curve. Tap "+ New Trade" to log.</p>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-4 gap-4 mt-6 pt-5 border-t border-[#1E232B]">
                  <div className="text-center">
                    <div className="text-[10px] text-[#8E9299] mb-0.5 uppercase tracking-wider font-bold">Win Rate</div>
                    <div className={`text-xl font-black ${winRate >= 50 ? "text-emerald-400" : "text-yellow-500"}`}>{winRate}%</div>
                  </div>
                  <div className="text-center">
                    <div className="text-[10px] text-[#8E9299] mb-0.5 uppercase tracking-wider font-bold">Avg R:R</div>
                    <div className="text-xl font-black text-white">{averageRR}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-[10px] text-[#8E9299] mb-0.5 uppercase tracking-wider font-bold">Profit Trades</div>
                    <div className="text-xl font-black text-emerald-400">{winTrades.length}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-[10px] text-[#8E9299] mb-0.5 uppercase tracking-wider font-bold">Drawdown</div>
                    <div className="text-xl font-black text-rose-400">-{currentDrawdown}%</div>
                  </div>
                </div>
              </div>

              {/* Box 3: AI Assistant Insight Widget (col-span-4) */}
              <div className="md:col-span-4 bg-[#151921] rounded-2xl p-5 border border-[#1E232B] flex flex-col justify-between shadow-xl">
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse"></span>
                    <h3 className="text-xs font-bold uppercase tracking-widest text-white">Coach Insight</h3>
                  </div>

                  <div className="space-y-3">
                    <div className="p-3.5 bg-[#0A0C10] rounded-xl border-l-4 border-blue-500 text-xs">
                      <p className="text-[#E0E2E6] leading-relaxed">
                        {closedTrades.length > 0 ? (
                          <span>
                            Your primary strategy is <strong>{closedTrades[0].strategy}</strong>. Keep checking risk metrics to maintain a positive expectancy. Avoid emotional exits.
                          </span>
                        ) : (
                          <span>
                            "Welcome to FXPro! Begin by viewing our <strong>FX Academy</strong> courses to understand Smart Money Concepts and Liquidity Pools before executing live positions."
                          </span>
                        )}
                      </p>
                    </div>
                    
                    <div className="p-3 bg-[#0A0C10] rounded-xl text-[11px] text-[#8E9299]">
                      <span className="block font-bold text-slate-400 mb-1 uppercase tracking-wider">Trading Psychology Tip</span>
                      Avoid revenge trading after a stop out. Wait at least 1 hour before scanning for new liquidity sweeps.
                    </div>
                  </div>
                </div>

                <div className="mt-5">
                  <button 
                    onClick={() => setActiveTab("mentor")}
                    className="w-full bg-[#1E232B] hover:bg-slate-800 text-xs text-white font-bold py-2.5 rounded-xl border border-slate-800/80 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <MessageSquare className="w-4 h-4 text-blue-400" />
                    <span>Talk to AI Coach</span>
                  </button>
                </div>
              </div>

              {/* Box 4: Recent Session Trades Log (col-span-5) */}
              <div className="md:col-span-5 bg-[#151921] rounded-2xl p-5 border border-[#1E232B] flex flex-col justify-between shadow-xl">
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">Recent Logs</h3>
                    <button 
                      onClick={() => setActiveTab("journal")}
                      className="text-[11px] text-blue-400 hover:underline font-bold"
                    >
                      View All
                    </button>
                  </div>

                  <div className="space-y-2.5">
                    {trades.slice(0, 3).map((trade) => {
                      const isProfit = trade.outcome === "PROFIT";
                      const isRunning = trade.outcome === "RUNNING";
                      return (
                        <div 
                          key={trade.id} 
                          className="flex items-center justify-between p-2.5 rounded-xl bg-[#0A0C10] border border-[#1E232B] hover:border-slate-800 transition-colors group cursor-pointer"
                          onClick={() => openEditTradeModal(trade)}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-xs font-black border ${
                              isRunning 
                                ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                                : isProfit 
                                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
                                  : "bg-rose-500/10 text-rose-400 border-rose-500/20"
                            }`}>
                              {trade.pair.slice(0, 2)}
                            </div>
                            <div>
                              <div className="text-xs font-bold text-white">{trade.pair}</div>
                              <div className="text-[10px] text-[#8E9299] font-mono mt-0.5">
                                <span className={trade.type === "BUY" ? "text-emerald-400" : "text-rose-400"}>
                                  {trade.type}
                                </span>{" "}
                                • Lot {trade.lotSize}
                              </div>
                            </div>
                          </div>
                          
                          <div className="text-right">
                            {isRunning ? (
                              <span className="text-xs font-semibold text-amber-400 px-2 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/20">
                                Running
                              </span>
                            ) : (
                              <div className={`text-xs font-bold ${isProfit ? "text-emerald-400" : "text-rose-400"}`}>
                                {isProfit ? "+" : "-"}${Math.abs(trade.profitAmount || 0).toFixed(2)}
                              </div>
                            )}
                            <div className="text-[9px] text-slate-500 font-mono mt-0.5">
                              {new Date(trade.entryTime).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                            </div>
                          </div>
                        </div>
                      );
                    })}

                    {trades.length === 0 && (
                      <div className="py-8 text-center text-xs text-slate-500 italic">
                        No trade entries registered yet. Keep a persistent journal.
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-950">
                  <div className="flex justify-between items-center text-[11px] text-[#8E9299]">
                    <span>Average Position Size:</span>
                    <span className="font-mono text-white font-bold">0.30 Lots</span>
                  </div>
                </div>
              </div>

              {/* Box 5: Continuing Course Progress (col-span-3) */}
              <div className="md:col-span-3 bg-[#151921] rounded-2xl p-5 border border-[#1E232B] flex flex-col justify-between shadow-xl">
                <div>
                  <div className="text-[10px] font-bold text-blue-500 uppercase tracking-widest mb-1">
                    ACTIVE ACADEMY MODULE
                  </div>
                  <h4 className="text-sm font-bold text-white leading-tight uppercase mb-3">
                    {activeModule.title}
                  </h4>

                  <p className="text-xs text-slate-400 line-clamp-3 mb-4">
                    {activeLesson.description}
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="w-full bg-[#0A0C10] h-1.5 rounded-full overflow-hidden">
                    <div className="bg-blue-500 h-full w-[65%]"></div>
                  </div>
                  <div className="flex justify-between text-[10px] text-[#8E9299] font-semibold">
                    <span>Lessons Complete</span>
                    <span>65%</span>
                  </div>

                  <button 
                    onClick={() => setActiveTab("academy")}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2.5 rounded-xl transition-all flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <span>Open Academy</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

            </div>

            {/* Quick action utility shortcuts */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              
              {/* Box: Risk Tool preview */}
              <div className="bg-gradient-to-br from-blue-700 to-indigo-800 rounded-2xl p-6 text-white flex flex-col justify-between shadow-xl">
                <div>
                  <h3 className="font-bold text-lg mb-1 tracking-tight">Interactive Position Sizer</h3>
                  <p className="text-blue-100 text-xs leading-relaxed">
                    Calculate exact standard or micro lot volumes instantly to avoid catastrophic portfolio drawdowns.
                  </p>
                </div>
                <div className="space-y-2 mt-4">
                  <div className="flex justify-between text-xs">
                    <span className="text-blue-100">Standard Risk Parameter:</span>
                    <span className="font-bold font-mono">1.0% ($100.00)</span>
                  </div>
                  <div className="h-px bg-white/10"></div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-blue-100">Select Asset Class:</span>
                    <span className="text-xs font-bold font-mono bg-white/10 px-2.5 py-1 rounded-md">GBP/USD</span>
                  </div>
                </div>
                <button 
                  onClick={() => setActiveTab("calculator")}
                  className="w-full mt-5 bg-white text-blue-800 hover:bg-slate-100 py-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer shadow-md"
                >
                  Open Sizing Calculator
                </button>
              </div>

              {/* Box: SMC Smart CheatSheet viewer */}
              <div className="bg-[#151921] rounded-2xl p-5 border border-[#1E232B] col-span-2 flex flex-col justify-between shadow-xl">
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-emerald-400" />
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">Quick SMC Cheat-Sheet</h3>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">Forex_Basics_Quick_Reference.pdf</span>
                </div>

                <div className="bg-[#0A0C10] border border-slate-900 rounded-xl p-4 min-h-[110px] flex items-center">
                  <p className="text-xs text-slate-300 leading-relaxed italic">
                    {activeModule.cheatsheetSlides[activePdfSlide]}
                  </p>
                </div>

                <div className="flex justify-between items-center mt-3 pt-3 border-t border-[#1E232B]">
                  <div className="flex gap-1">
                    {activeModule.cheatsheetSlides.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActivePdfSlide(idx)}
                        className={`w-5 h-5 rounded flex items-center justify-center text-[10px] font-mono font-bold transition-all ${
                          activePdfSlide === idx 
                            ? "bg-emerald-500 text-slate-950" 
                            : "bg-[#0A0C10] hover:bg-slate-800 text-slate-400"
                        }`}
                      >
                        {idx + 1}
                      </button>
                    ))}
                  </div>
                  <span className="text-[10px] text-slate-500">Visual concepts. Touch/click page indicators to flip.</span>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* JOURNAL TAB (FULL JOURNAL LOGS & ANALYTICS VIEW) */}
        {activeTab === "journal" && (
          <div className="space-y-6">
            
            {/* Journal Header with DB sync actions */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#151921] p-5 rounded-2xl border border-[#1E232B] shadow-xl">
              <div>
                <h2 className="text-lg font-bold text-white">Forex Trade Journal Logs</h2>
                <p className="text-xs text-slate-400">Manage, search, and audit your complete trading history with local IndexedDB persistence.</p>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={exportData}
                  className="px-3 py-1.5 bg-[#0A0C10] hover:bg-slate-800 border border-slate-800 text-slate-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export JSON</span>
                </button>
                <label className="px-3 py-1.5 bg-[#0A0C10] hover:bg-slate-800 border border-slate-800 text-slate-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Import JSON</span>
                  <input type="file" accept=".json" onChange={handleImportData} className="hidden" />
                </label>
                <button
                  onClick={resetDatabaseToSeed}
                  className="px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-400 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Reset Demo Data</span>
                </button>
              </div>
            </div>

            {/* Comprehensive statistics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-[#151921] border border-[#1E232B] p-4 rounded-xl">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Total Placed Trades</span>
                <span className="text-2xl font-black text-white font-mono">{totalTradesCount}</span>
              </div>
              <div className="bg-[#151921] border border-[#1E232B] p-4 rounded-xl">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Win Rate Ratio</span>
                <span className={`text-2xl font-black font-mono ${winRate >= 50 ? "text-emerald-400" : "text-amber-400"}`}>{winRate}%</span>
              </div>
              <div className="bg-[#151921] border border-[#1E232B] p-4 rounded-xl">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Net Gain/Loss</span>
                <span className={`text-2xl font-black font-mono ${totalPnL >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                  {totalPnL >= 0 ? "+" : "-"}${Math.abs(totalPnL).toFixed(2)}
                </span>
              </div>
              <div className="bg-[#151921] border border-[#1E232B] p-4 rounded-xl">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Average Profit Factor</span>
                <span className="text-2xl font-black text-white font-mono">{averageRR} R:R</span>
              </div>
            </div>

            {/* Filter Tray */}
            <div className="bg-[#151921] p-4 rounded-2xl border border-[#1E232B] flex flex-wrap gap-3 items-center shadow-xl">
              <div className="flex-1 min-w-[200px] relative">
                <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search notes, assets, or setups..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-[#0A0C10] border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              <div>
                <select
                  value={filterPair}
                  onChange={(e) => setFilterPair(e.target.value)}
                  className="bg-[#0A0C10] text-slate-300 text-xs px-3 py-2 rounded-xl border border-slate-800 focus:outline-none cursor-pointer"
                >
                  <option value="ALL">All Currency Pairs</option>
                  {CURRENCY_PAIRS.map((pair) => (
                    <option key={pair} value={pair}>{pair}</option>
                  ))}
                </select>
              </div>

              <div>
                <select
                  value={filterStrategy}
                  onChange={(e) => setFilterStrategy(e.target.value)}
                  className="bg-[#0A0C10] text-slate-300 text-xs px-3 py-2 rounded-xl border border-slate-800 focus:outline-none cursor-pointer"
                >
                  <option value="ALL">All Strategies</option>
                  {STRATEGIES.map((strat) => (
                    <option key={strat} value={strat}>{strat}</option>
                  ))}
                </select>
              </div>

              <div>
                <select
                  value={filterOutcome}
                  onChange={(e) => setFilterOutcome(e.target.value)}
                  className="bg-[#0A0C10] text-slate-300 text-xs px-3 py-2 rounded-xl border border-slate-800 focus:outline-none cursor-pointer"
                >
                  <option value="ALL">All Outcomes</option>
                  <option value="PROFIT">Profit Only</option>
                  <option value="LOSS">Loss Only</option>
                  <option value="BREAK_EVEN">Break-even Only</option>
                  <option value="RUNNING">Running Positions</option>
                </select>
              </div>
            </div>

            {/* Grid of Strategy analytics vs. Trades Table */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Column: Trades table log list (col-span-8) */}
              <div className="lg:col-span-8 bg-[#151921] rounded-2xl border border-[#1E232B] shadow-xl overflow-hidden">
                <div className="px-5 py-4 border-b border-[#1E232B] flex justify-between items-center">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">Historical Trade Database</h3>
                  <span className="text-xs text-slate-400 font-mono">Showing {trades.length} elements</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead className="bg-[#0A0C10] text-[#8E9299] uppercase text-[10px] font-bold tracking-wider">
                      <tr>
                        <th className="px-5 py-3">Asset Pair</th>
                        <th className="px-5 py-3">Type / Size</th>
                        <th className="px-5 py-3">Execution Prices</th>
                        <th className="px-5 py-3">Strategy Framework</th>
                        <th className="px-5 py-3">Net Profit</th>
                        <th className="px-5 py-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-900/60">
                      {trades
                        .filter((t) => {
                          const matchPair = filterPair === "ALL" || t.pair === filterPair;
                          const matchStrategy = filterStrategy === "ALL" || t.strategy === filterStrategy;
                          const matchOutcome = filterOutcome === "ALL" || t.outcome === filterOutcome;
                          const matchSearch = searchQuery === "" || 
                            t.pair.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            (t.notes && t.notes.toLowerCase().includes(searchQuery.toLowerCase())) ||
                            t.strategy.toLowerCase().includes(searchQuery.toLowerCase());
                          return matchPair && matchStrategy && matchOutcome && matchSearch;
                        })
                        .map((trade) => {
                          const isProfit = trade.outcome === "PROFIT";
                          const isLoss = trade.outcome === "LOSS";
                          const isRunning = trade.outcome === "RUNNING";
                          return (
                            <tr key={trade.id} className="hover:bg-[#0F1218] transition-colors group">
                              <td className="px-5 py-3.5">
                                <span className="font-bold text-white block">{trade.pair}</span>
                                <span className="text-[10px] text-slate-500 font-mono">
                                  {new Date(trade.entryTime).toLocaleDateString()}
                                </span>
                              </td>
                              <td className="px-5 py-3.5 font-mono">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold inline-block mr-1.5 ${
                                  trade.type === "BUY" ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"
                                }`}>
                                  {trade.type}
                                </span>
                                <span className="text-slate-400">{trade.lotSize} Lots</span>
                              </td>
                              <td className="px-5 py-3.5 font-mono text-[11px]">
                                <div><span className="text-slate-500">In:</span> {trade.entryPrice}</div>
                                {trade.exitPrice && (
                                  <div><span className="text-slate-500">Out:</span> {trade.exitPrice}</div>
                                )}
                              </td>
                              <td className="px-5 py-3.5">
                                <span className="text-xs text-slate-300 block max-w-[150px] truncate" title={trade.strategy}>
                                  {trade.strategy}
                                </span>
                                <span className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-400 mt-0.5 inline-block">
                                  {trade.session.split(" ")[0]}
                                </span>
                              </td>
                              <td className="px-5 py-3.5 font-mono">
                                {isRunning ? (
                                  <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] font-semibold">
                                    RUNNING
                                  </span>
                                ) : (
                                  <span className={`font-bold ${isProfit ? "text-emerald-400" : isLoss ? "text-rose-400" : "text-slate-400"}`}>
                                    {isProfit ? "+" : isLoss ? "-" : ""}${Math.abs(trade.profitAmount || 0).toFixed(2)}
                                  </span>
                                )}
                                <div className="text-[10px] text-slate-500">{trade.riskReward} R:R</div>
                              </td>
                              <td className="px-5 py-3.5 text-right">
                                <div className="flex gap-1.5 justify-end opacity-60 group-hover:opacity-100 transition-opacity">
                                  <button
                                    onClick={() => openEditTradeModal(trade)}
                                    className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded text-slate-300 transition-colors"
                                    title="Edit position"
                                  >
                                    <Edit3 className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteTrade(trade.id)}
                                    className="p-1.5 bg-rose-500/10 hover:bg-rose-500/20 rounded text-rose-400 transition-colors"
                                    title="Delete position"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Right Column: Advanced Analytics Metrics widgets (col-span-4) */}
              <div className="lg:col-span-4 space-y-6">
                
                {/* Strategy win rate performance index */}
                <div className="bg-[#151921] rounded-2xl p-5 border border-[#1E232B] shadow-xl">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Layers className="w-4 h-4 text-blue-400" />
                    Strategy Expectancy Index
                  </h3>

                  <div className="space-y-3.5">
                    {strategyStats.map((strat, i) => (
                      <div key={i} className="space-y-1">
                        <div className="flex justify-between text-xs font-semibold">
                          <span className="text-slate-300 max-w-[200px] truncate" title={strat.name}>
                            {strat.name}
                          </span>
                          <span className="text-slate-400">{strat.winRate}% wr ({strat.count} trades)</span>
                        </div>
                        <div className="w-full bg-[#0A0C10] h-2 rounded-full overflow-hidden border border-[#1E232B]">
                          <div 
                            className={`h-full rounded-full ${strat.winRate >= 50 ? "bg-emerald-500" : "bg-blue-500"}`}
                            style={{ width: `${strat.winRate}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}

                    {strategyStats.length === 0 && (
                      <p className="text-xs text-slate-500 italic text-center py-4">No statistical data generated yet.</p>
                    )}
                  </div>
                </div>

                {/* Emotional triggers analyze */}
                <div className="bg-[#151921] rounded-2xl p-5 border border-[#1E232B] shadow-xl">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-rose-400" />
                    Mindset & Emotional Impact
                  </h3>

                  <div className="space-y-3">
                    {emotionalStats.map((emo, i) => {
                      const percentageLoss = emo.total > 0 ? Math.round((emo.losses / emo.total) * 100) : 0;
                      return (
                        <div key={i} className="flex justify-between items-center text-xs p-2.5 rounded-xl bg-[#0A0C10] border border-[#1E232B]">
                          <div>
                            <span className="font-bold text-slate-200 block">{emo.name}</span>
                            <span className="text-[10px] text-slate-500">{emo.total} executions logged</span>
                          </div>
                          <div className="text-right">
                            <span className={`font-mono font-bold ${percentageLoss > 50 ? "text-rose-400" : "text-slate-400"}`}>
                              {percentageLoss}% Loss Rate
                            </span>
                            <span className="block text-[9px] text-slate-500">{emo.wins} Wins / {emo.losses} Losses</span>
                          </div>
                        </div>
                      );
                    })}

                    {emotionalStats.length === 0 && (
                      <p className="text-xs text-slate-500 italic text-center py-4">Complete a trade logging session with emotions specified.</p>
                    )}
                  </div>
                </div>

              </div>
              
            </div>

          </div>
        )}

        {/* ACADEMY TAB (FX LEARNING PLATFORM WITH INTEGRATED QUIZ & EMBEDS) */}
        {activeTab === "academy" && (
          <div className="space-y-6">
            
            {/* Top Course Explorer */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {ACADEMY_COURSES.map((module) => (
                <div 
                  key={module.id}
                  onClick={() => {
                    setActiveModule(module);
                    handleSelectLesson(module.lessons[0]);
                  }}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                    activeModule.id === module.id 
                      ? "bg-blue-600/10 border-blue-500 shadow-lg shadow-blue-500/5 text-white" 
                      : "bg-[#151921] border-[#1E232B] hover:border-slate-800 text-slate-300"
                  }`}
                >
                  <div>
                    <span className="text-[9px] font-extrabold uppercase tracking-widest text-blue-400 block mb-1">Academy Course</span>
                    <h3 className="font-bold text-sm uppercase">{module.title}</h3>
                    <p className="text-xs text-[#8E9299] mt-2 line-clamp-2">{module.tagline}</p>
                  </div>

                  <div className="flex justify-between items-center mt-4 pt-3 border-t border-slate-900 text-[11px] text-[#8E9299]">
                    <span>{module.lessons.length} complete modules</span>
                    <span className="font-mono text-blue-400 flex items-center gap-0.5">
                      Enter <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Core Lesson Screen layout: 12-column template */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Column: Lesson Content & Media player (col-span-8) */}
              <div className="lg:col-span-8 bg-[#151921] rounded-2xl border border-[#1E232B] p-6 shadow-xl space-y-6">
                
                {/* Active Lesson Header info */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-4 border-b border-[#1E232B]">
                  <div>
                    <span className="text-[10px] bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider font-mono">
                      Active Lecture
                    </span>
                    <h2 className="text-lg font-black text-white mt-1 uppercase tracking-tight">{activeLesson.title}</h2>
                  </div>
                  <span className="text-xs text-[#8E9299] flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> Estimated Study time: {activeLesson.duration}
                  </span>
                </div>

                {/* Integrated YouTube Video Embed Player */}
                {activeLesson.youtubeId && (
                  <div className="relative aspect-video rounded-xl overflow-hidden border border-[#1E232B] bg-slate-950 shadow-inner group">
                    <iframe
                      src={`https://www.youtube.com/embed/${activeLesson.youtubeId}`}
                      title={activeLesson.title}
                      className="absolute inset-0 w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                )}

                {/* Conceptual study notes written in elegant layout */}
                <div className="prose prose-invert max-w-none text-slate-300">
                  <div className="whitespace-pre-line leading-relaxed text-sm bg-[#0A0C10] border border-slate-900 rounded-xl p-5 space-y-4">
                    {activeLesson.contentMarkdown}
                  </div>
                </div>

                {/* Interactive Multi-Choice Quiz section */}
                {activeLesson.quiz && activeLesson.quiz.length > 0 && (
                  <div className="bg-[#0A0C10] border border-slate-900 rounded-xl p-6 mt-6">
                    <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-900">
                      <Award className="w-5 h-5 text-yellow-500" />
                      <h4 className="font-bold text-sm text-white uppercase tracking-wide">Test Your Knowledge Module</h4>
                    </div>

                    <div className="space-y-6">
                      {activeLesson.quiz.map((q, qIdx) => {
                        const isCorrect = selectedQuizAnswers[qIdx] === q.correctAnswerIndex;
                        return (
                          <div key={qIdx} className="space-y-3">
                            <h5 className="text-xs font-bold text-slate-200">
                              {qIdx + 1}. {q.question}
                            </h5>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              {q.options.map((opt, optIdx) => (
                                <button
                                  key={optIdx}
                                  onClick={() => {
                                    if (!quizSubmitted) {
                                      setSelectedQuizAnswers((prev) => ({ ...prev, [qIdx]: optIdx }));
                                    }
                                  }}
                                  disabled={quizSubmitted}
                                  className={`p-3 text-left text-xs rounded-xl border transition-all flex items-center justify-between ${
                                    selectedQuizAnswers[qIdx] === optIdx
                                      ? "bg-blue-600/10 border-blue-500 text-white font-semibold"
                                      : "bg-[#151921] border-[#1E232B] hover:border-slate-800 text-slate-400"
                                  }`}
                                >
                                  <span>{opt}</span>
                                  {selectedQuizAnswers[qIdx] === optIdx && (
                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                                  )}
                                </button>
                              ))}
                            </div>

                            {quizSubmitted && (
                              <div className={`p-3 rounded-xl border text-[11px] leading-relaxed mt-2 ${
                                isCorrect 
                                  ? "bg-emerald-500/5 border-emerald-500/10 text-emerald-400" 
                                  : "bg-rose-500/5 border-rose-500/10 text-rose-400"
                              }`}>
                                <div className="font-bold uppercase tracking-wider mb-1 flex items-center gap-1">
                                  {isCorrect ? <CheckCircle className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                                  {isCorrect ? "Correct answer!" : "Incorrect"}
                                </div>
                                <p>{q.explanation}</p>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    <div className="mt-6 flex justify-between items-center pt-4 border-t border-slate-900">
                      <p className="text-[10px] text-slate-500">Please answer all questions before submitting your results.</p>
                      
                      {!quizSubmitted ? (
                        <button
                          onClick={() => setQuizSubmitted(true)}
                          disabled={Object.keys(selectedQuizAnswers).length < activeLesson.quiz.length}
                          className="bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-800 text-slate-950 disabled:text-slate-500 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer"
                        >
                          Submit Quiz Answers
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            setSelectedQuizAnswers({});
                            setQuizSubmitted(false);
                          }}
                          className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer"
                        >
                          Retry Quiz Module
                        </button>
                      )}
                    </div>
                  </div>
                )}

              </div>

              {/* Right Column: Lessons Index lists (col-span-4) */}
              <div className="lg:col-span-4 space-y-6">
                
                {/* Lectures List */}
                <div className="bg-[#151921] rounded-2xl p-5 border border-[#1E232B] shadow-xl">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Module Curriculum</h3>

                  <div className="space-y-2">
                    {activeModule.lessons.map((lesson) => (
                      <div 
                        key={lesson.id}
                        onClick={() => handleSelectLesson(lesson)}
                        className={`p-3 rounded-xl border transition-all cursor-pointer text-xs ${
                          activeLesson.id === lesson.id 
                            ? "bg-blue-600/10 border-blue-500 text-white font-semibold" 
                            : "bg-[#0A0C10] border-slate-900 hover:border-slate-800 text-slate-400"
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <span className="max-w-[180px] truncate block">{lesson.title}</span>
                          <span className="text-[10px] text-slate-500 font-mono shrink-0">{lesson.duration}</span>
                        </div>
                        <p className="text-[10px] text-slate-500 mt-1 line-clamp-2">{lesson.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Slides cheatsheet presentation preview */}
                <div className="bg-[#151921] rounded-2xl p-5 border border-[#1E232B] shadow-xl">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider">Concepts PDF Cheatsheet</h3>
                    <span className="text-[9px] text-slate-500 uppercase tracking-widest bg-[#0A0C10] px-2 py-0.5 rounded border border-[#1E232B]">
                      PDF.js Embedded
                    </span>
                  </div>

                  <div className="bg-[#0A0C10] border border-slate-900 rounded-xl p-4 min-h-[140px] flex items-center">
                    <p className="text-xs text-slate-300 leading-relaxed italic">
                      {activeModule.cheatsheetSlides[activePdfSlide]}
                    </p>
                  </div>

                  <div className="flex justify-between items-center mt-4">
                    <div className="flex gap-1">
                      {activeModule.cheatsheetSlides.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setActivePdfSlide(i)}
                          className={`w-5.5 h-5.5 rounded-md flex items-center justify-center text-[10px] font-mono font-bold transition-all ${
                            activePdfSlide === i 
                              ? "bg-blue-600 text-white" 
                              : "bg-[#0A0C10] hover:bg-slate-800 text-slate-500"
                          }`}
                        >
                          {i + 1}
                        </button>
                      ))}
                    </div>
                    <span className="text-[9px] text-slate-500">Page {activePdfSlide + 1} of {activeModule.cheatsheetSlides.length}</span>
                  </div>
                </div>

              </div>

            </div>

          </div>
        )}

        {/* AI COACH / ASSISTANT TAB */}
        {activeTab === "mentor" && (
          <div className="space-y-6">
            <div className="bg-[#151921] p-5 rounded-2xl border border-[#1E232B] text-center max-w-4xl mx-auto shadow-xl">
              <h2 className="text-lg font-bold text-white uppercase tracking-wide">Interactive AI Trading Coach</h2>
              <p className="text-xs text-slate-400 mt-1 max-w-xl mx-auto">
                Discuss complex Forex setups, ask about Smart Money Concepts (SMC) order flow, and double check risk metrics directly with FX-Mentor.
              </p>
            </div>

            <Mentor />
          </div>
        )}

        {/* RISK CALCULATOR TAB */}
        {activeTab === "calculator" && (
          <div className="space-y-6">
            <div className="bg-[#151921] p-5 rounded-2xl border border-[#1E232B] text-center max-w-4xl mx-auto shadow-xl">
              <h2 className="text-lg font-bold text-white uppercase tracking-wide font-sans">Risk & Capital Preservative Sizing</h2>
              <p className="text-xs text-[#8E9299] mt-1 max-w-xl mx-auto">
                Sizing trades correctly is the ultimate difference between profit and immediate default. Run your calculations before triggering orders.
              </p>
            </div>

            <RiskCalculator currentBalance={currentNetBalance} />
          </div>
        )}

      </main>

      {/* NEW/EDIT POSITION JOURNAL FORM MODAL */}
      {isNewTradeModalOpen && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#151921] border border-[#1E232B] rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden" id="trade-modal">
            
            <div className="px-6 py-4 border-b border-[#1E232B] flex justify-between items-center bg-[#0F1218]">
              <div>
                <h3 className="text-base font-bold text-white font-sans">
                  {editingTrade ? "Update Existing Trade Position" : "Register New Trade Position"}
                </h3>
                <p className="text-[11px] text-[#8E9299]">Keep your entries accurate to compute authentic performance statistics.</p>
              </div>
              <button
                onClick={() => setIsNewTradeModalOpen(false)}
                className="text-slate-400 hover:text-white text-sm bg-slate-800 p-1.5 rounded-lg transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveTrade} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                    Currency Pair / Asset
                  </label>
                  <select
                    value={formPair}
                    onChange={(e) => setFormPair(e.target.value)}
                    className="w-full bg-[#0A0C10] border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500 cursor-pointer"
                  >
                    {CURRENCY_PAIRS.map((pair) => (
                      <option key={pair} value={pair}>{pair}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                    Order Action Type
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setFormType("BUY")}
                      className={`py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                        formType === "BUY"
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                          : "bg-[#0A0C10] text-slate-400 border border-slate-800/80"
                      }`}
                    >
                      BUY (Long)
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormType("SELL")}
                      className={`py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                        formType === "SELL"
                          ? "bg-rose-500/10 text-rose-400 border border-rose-500/30"
                          : "bg-[#0A0C10] text-slate-400 border border-slate-800/80"
                      }`}
                    >
                      SELL (Short)
                    </button>
                  </div>
                </div>

              </div>

              <div className="grid grid-cols-3 gap-4">
                
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                    Entry Price
                  </label>
                  <input
                    type="number"
                    step="any"
                    required
                    value={formEntryPrice}
                    onChange={(e) => setFormEntryPrice(e.target.value)}
                    placeholder="e.g. 1.08250"
                    className="w-full bg-[#0A0C10] border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                    Lot Position Size
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formLotSize}
                    onChange={(e) => setFormLotSize(e.target.value)}
                    placeholder="e.g. 0.10"
                    className="w-full bg-[#0A0C10] border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                    Trade Status
                  </label>
                  <select
                    value={formOutcome}
                    onChange={(e) => setFormOutcome(e.target.value as any)}
                    className="w-full bg-[#0A0C10] border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500 cursor-pointer"
                  >
                    <option value="RUNNING">Active / Running</option>
                    <option value="PROFIT">Profit Out</option>
                    <option value="LOSS">Loss Out</option>
                    <option value="BREAK_EVEN">Break Even</option>
                  </select>
                </div>

              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                    Stop Loss Size (optional)
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={formStopLoss}
                    onChange={(e) => setFormStopLoss(e.target.value)}
                    placeholder="SL price level"
                    className="w-full bg-[#0A0C10] border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>
                
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                    Take Profit Target (optional)
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={formTakeProfit}
                    onChange={(e) => setFormTakeProfit(e.target.value)}
                    placeholder="TP price level"
                    className="w-full bg-[#0A0C10] border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                
                {formOutcome !== "RUNNING" && (
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                      Net Cash P/L Amount ($)
                    </label>
                    <input
                      type="number"
                      step="any"
                      required
                      value={formProfit}
                      onChange={(e) => setFormProfit(e.target.value)}
                      placeholder="e.g. 150.00 or -75.00"
                      className="w-full bg-[#0A0C10] border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
                    />
                  </div>
                )}

                {formOutcome !== "RUNNING" && (
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                      Exit Price (optional)
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={formExitPrice}
                      onChange={(e) => setFormExitPrice(e.target.value)}
                      placeholder="e.g. 1.09100"
                      className="w-full bg-[#0A0C10] border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
                    />
                  </div>
                )}

              </div>

              <div className="grid grid-cols-3 gap-4">
                
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                    Trading Strategy
                  </label>
                  <select
                    value={formStrategy}
                    onChange={(e) => setFormStrategy(e.target.value)}
                    className="w-full bg-[#0A0C10] border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500 cursor-pointer"
                  >
                    {STRATEGIES.map((strat) => (
                      <option key={strat} value={strat}>{strat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                    Mindset / Emotion State
                  </label>
                  <select
                    value={formEmotion}
                    onChange={(e) => setFormEmotion(e.target.value)}
                    className="w-full bg-[#0A0C10] border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500 cursor-pointer"
                  >
                    {EMOTIONS.map((emo) => (
                      <option key={emo} value={emo}>{emo}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                    Market Trading Session
                  </label>
                  <select
                    value={formSession}
                    onChange={(e) => setFormSession(e.target.value)}
                    className="w-full bg-[#0A0C10] border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500 cursor-pointer"
                  >
                    {SESSIONS.map((sess) => (
                      <option key={sess} value={sess}>{sess}</option>
                    ))}
                  </select>
                </div>

              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Execution Commentary Notes / Review
                </label>
                <textarea
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  placeholder="Analyze structural setup: Breakout confirmation, Order Blocks tapped, equal low sweeps, news impact, psychological state, error log..."
                  rows={3}
                  className="w-full bg-[#0A0C10] border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                ></textarea>
              </div>

              <div className="pt-4 border-t border-[#1E232B] flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsNewTradeModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-800 text-slate-300 hover:bg-[#1E232B] hover:text-white transition-all cursor-pointer"
                >
                  Discard Changes
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 transition-all cursor-pointer shadow-lg shadow-blue-600/10"
                >
                  {editingTrade ? "Update Logs Entry" : "Save to Journal"}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* Footer System Status Bar */}
      <footer className="bg-[#07090D] border-t border-[#1E232B] py-3.5 px-6 flex flex-col sm:flex-row items-center justify-between text-[#8E9299] text-[10px] font-mono gap-3 shrink-0">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Real-time Ticker Feed Enabled</span>
          </div>
          <div className="hidden sm:block text-slate-500">|</div>
          <span>Gold: Spot Price Live</span>
          <span>BTC Spot Live</span>
        </div>
        <div className="italic text-slate-500 text-center sm:text-right">
          All data is strictly persistent in local IndexedDB browser sandboxes • Last auto-save: Just now
        </div>
      </footer>

    </div>
  );
}
