/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { DollarSign, Shield, Percent, HelpCircle } from "lucide-react";
import { CURRENCY_PAIRS } from "../data";

export default function RiskCalculator({ currentBalance }: { currentBalance: number }) {
  const [balance, setBalance] = useState<number>(currentBalance || 10000);
  const [riskPercent, setRiskPercent] = useState<number>(1);
  const [stopLossPips, setStopLossPips] = useState<number>(20);
  const [selectedPair, setSelectedPair] = useState<string>("EUR/USD");
  const [pipValue, setPipValue] = useState<number>(10); // Default standard lot pip value is $10 for EUR/USD

  // Update balance if prop changes
  useEffect(() => {
    if (currentBalance) {
      setBalance(currentBalance);
    }
  }, [currentBalance]);

  // Handle standard pip calculations based on common pairs
  useEffect(() => {
    if (selectedPair.includes("JPY")) {
      setPipValue(6.5); // Approx JPY pip value in USD
    } else if (selectedPair.includes("CAD")) {
      setPipValue(7.4); // Approx CAD pip value in USD
    } else if (selectedPair.includes("CHF")) {
      setPipValue(11.1); // Approx CHF pip value in USD
    } else if (selectedPair.includes("GBP")) {
      setPipValue(10.0);
    } else {
      setPipValue(10.0); // Default standard USD majors
    }
  }, [selectedPair]);

  // Calculations
  const riskAmount = (balance * riskPercent) / 100;
  
  // Lot size formula: Risk Amount / (Stop Loss in Pips * Pip Value per standard lot)
  // For standard majors, pip value is ~$10 for 1.0 standard lot.
  const calculatedStandardLot = riskAmount / (stopLossPips * pipValue);
  const calculatedMiniLot = calculatedStandardLot * 10;
  const calculatedMicroLot = calculatedStandardLot * 100;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl max-w-4xl mx-auto" id="risk-calculator-section">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20" id="calc-header-icon">
          <Shield className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white font-sans tracking-tight">Professional Position Sizing Calculator</h2>
          <p className="text-xs text-slate-400">Calculate exact lot sizes to stay disciplined and protect your capital.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Input Form */}
        <div className="space-y-5" id="calculator-inputs">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Account Balance
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm">$</span>
              <input
                type="number"
                value={balance}
                onChange={(e) => setBalance(Math.max(0, Number(e.target.value)))}
                className="w-full pl-8 pr-4 py-3 bg-slate-950/80 border border-slate-800 rounded-xl text-white font-mono text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                placeholder="10000"
              />
            </div>
            <div className="flex gap-2 mt-2">
              {[1000, 5000, 10000, 25000, 50000, 100000].map((preset) => (
                <button
                  key={preset}
                  onClick={() => setBalance(preset)}
                  className="text-[10px] font-mono font-medium px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded transition-colors"
                >
                  ${preset.toLocaleString()}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Risk Percentage (%)
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  value={riskPercent}
                  onChange={(e) => setRiskPercent(Math.max(0.1, Math.min(100, Number(e.target.value))))}
                  className="w-full pl-4 pr-8 py-3 bg-slate-950/80 border border-slate-800 rounded-xl text-white font-mono text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                  placeholder="1.0"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm">%</span>
              </div>
              <div className="flex gap-1.5 mt-2">
                {[0.5, 1, 2, 3].map((pct) => (
                  <button
                    key={pct}
                    onClick={() => setRiskPercent(pct)}
                    className="text-[10px] font-mono font-medium flex-1 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded transition-colors text-center"
                  >
                    {pct}%
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Stop Loss (Pips)
              </label>
              <input
                type="number"
                value={stopLossPips}
                onChange={(e) => setStopLossPips(Math.max(1, Number(e.target.value)))}
                className="w-full px-4 py-3 bg-slate-950/80 border border-slate-800 rounded-xl text-white font-mono text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                placeholder="20"
              />
              <div className="flex gap-1.5 mt-2">
                {[5, 10, 15, 20, 30, 50].map((pips) => (
                  <button
                    key={pips}
                    onClick={() => setStopLossPips(pips)}
                    className="text-[10px] font-mono font-medium flex-1 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded transition-colors text-center"
                  >
                    {pips}p
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Currency Pair
            </label>
            <select
              value={selectedPair}
              onChange={(e) => setSelectedPair(e.target.value)}
              className="w-full px-4 py-3 bg-slate-950/80 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500 transition-colors cursor-pointer"
            >
              {CURRENCY_PAIRS.map((pair) => (
                <option key={pair} value={pair}>
                  {pair}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Output Results */}
        <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-6 flex flex-col justify-between space-y-6" id="calculator-outputs-panel">
          <div>
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-emerald-400" />
              Calculated Risk Profile
            </h3>

            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-slate-900">
                <span className="text-sm text-slate-400">Cash Risk Amount:</span>
                <span className="text-lg font-bold font-mono text-rose-400">
                  ${riskAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-900">
                <span className="text-sm text-slate-400">Pip Value (approx / standard lot):</span>
                <span className="text-sm font-semibold font-mono text-slate-200">
                  ${pipValue.toFixed(2)} USD
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-900">
                <span className="text-sm text-slate-400">Total Stop Loss Size:</span>
                <span className="text-sm font-semibold font-mono text-emerald-400">
                  {stopLossPips} Pips
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-3 pt-4">
            <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">Standard Lots</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">100,000 units of currency</span>
              </div>
              <span className="text-2xl font-black font-mono text-white">
                {calculatedStandardLot.toFixed(2)}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Mini Lots</span>
                  <span className="text-[9px] text-slate-500 block">10,000 units</span>
                </div>
                <span className="text-base font-bold font-mono text-slate-200">
                  {calculatedMiniLot.toFixed(1)}
                </span>
              </div>

              <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Micro Lots</span>
                  <span className="text-[9px] text-slate-500 block">1,000 units</span>
                </div>
                <span className="text-base font-bold font-mono text-slate-200">
                  {calculatedMicroLot.toFixed(1)}
                </span>
              </div>
            </div>
          </div>

          <div className="text-[10px] text-slate-500 text-center flex items-center justify-center gap-1.5 pt-2">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Formulas account for direct exchange rates of major pairs. Leverage settings are default to broker values.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
