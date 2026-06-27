/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CourseModule, Trade } from "./types";

export const CURRENCY_PAIRS = [
  "EUR/USD", "GBP/USD", "USD/JPY", "AUD/USD", "USD/CAD", "USD/CHF", "NZD/USD",
  "EUR/GBP", "EUR/JPY", "GBP/JPY", "EUR/CHF", "AUD/JPY", "Gold (XAU/USD)", "Silver (XAG/USD)", "Bitcoin (BTC/USD)"
];

export const STRATEGIES = [
  "Smart Money Concepts (SMC)",
  "Price Action & Candlesticks",
  "Support & Resistance / Supply & Demand",
  "Moving Average Crossover / Trend Following",
  "Breakout / Liquidity Sweep",
  "Fibonacci Retracement",
  "Chart Patterns (Double Top, Head & Shoulders)",
  "News Trading / Fundamental"
];

export const EMOTIONS = [
  "Patient (Disciplined)",
  "Greedy (FOMO / Oversized)",
  "Fearful (Early Exit / Hesitant)",
  "Confident (In Zone)",
  "Frustrated (Revenge Trade)",
  "Neutral (System Executed)",
  "Anxious (Over-monitoring)"
];

export const SESSIONS = [
  "London Session",
  "New York Session",
  "Asian Session",
  "London / New York Overlap",
  "Sydney Session"
];

// Curated Educational Content
export const ACADEMY_COURSES: CourseModule[] = [
  {
    id: "m1",
    title: "Forex Basics & Essentials",
    tagline: "Master the foundation of the largest financial market in the world.",
    cheatsheetPdfTitle: "Forex_Basics_Quick_Reference.pdf",
    cheatsheetSlides: [
      "Slide 1: What is Forex? Forex stands for Foreign Exchange. It is the global marketplace for exchanging national currencies against one another. Over $7.5 Trillion is traded daily, making it highly liquid.",
      "Slide 2: Base vs Quote Currency. In a pair like EUR/USD, EUR is the Base currency, and USD is the Quote currency. If EUR/USD is trading at 1.1200, it means 1 Euro costs 1.1200 US Dollars.",
      "Slide 3: Pips & Lot Sizes. A Pip (Percentage in Point) is the 4th decimal place (0.0001). For JPY pairs, it is the 2nd (0.01). A Lot size of 1.0 (Standard) is 100,000 units. 0.10 (Mini) is 10,000 units. 0.01 (Micro) is 1,000 units.",
      "Slide 4: Bid, Ask & Spread. The Bid is the price you sell at, and the Ask is the price you buy at. The difference between them is the Spread, which is the broker's transaction cost."
    ],
    lessons: [
      {
        id: "l1_1",
        title: "Introduction to Forex Trading",
        duration: "8 mins",
        description: "Understand what Forex is, how pairs work, and who participates in this market.",
        youtubeId: "Y7S_vWe394Y", // High quality general forex introduction video
        contentMarkdown: `### Welcome to the Forex Market!
The Foreign Exchange (Forex or FX) market is where national currencies are bought and sold. It is decentralized, open 24 hours a day, 5 days a week, and is governed by central banks, institutional banks, corporations, and retail traders.

#### Understanding Currency Pairs
Currencies are always traded in pairs because you are simultaneously buying one and selling another.
* **EUR/USD (Euro / US Dollar)**: The most heavily traded pair.
* **GBP/USD (Great British Pound / US Dollar)**
* **USD/JPY (US Dollar / Japanese Yen)**

#### Key Market Participants
1. **Central Banks**: Control interest rates and supply (e.g., Federal Reserve, ECB).
2. **Commercial & Investment Banks**: The interbank market which dictates market liquidity.
3. **Retail Traders**: Independent individuals like you, using online broker platforms.`,
        quiz: [
          {
            question: "What is the base currency in the pair GBP/USD?",
            options: ["GBP (British Pound)", "USD (US Dollar)", "Both are base currencies", "Depends on the broker"],
            correctAnswerIndex: 0,
            explanation: "In any currency pair, the first currency listed is the Base currency, and the second is the Quote currency."
          },
          {
            question: "How many days a week is the Forex market open?",
            options: ["7 days a week", "5 days a week", "3 days a week", "Only on weekends"],
            correctAnswerIndex: 1,
            explanation: "The Forex market is open 24 hours a day, 5 days a week (from Sunday afternoon to Friday afternoon, EST)."
          }
        ]
      },
      {
        id: "l1_2",
        title: "Pips, Lots, and Leverage",
        duration: "10 mins",
        description: "Learn how price movements and position sizes are calculated to manage capital safely.",
        youtubeId: "vBAsM8uLp-w",
        contentMarkdown: `### The Mechanics of Forex Math
To make money in Forex, you need to understand how profits and losses are measured and sized.

#### What is a Pip?
A **Pip** stands for "Percentage in Point" and is the standard unit of measurement for price changes.
* For most pairs, 1 Pip is **0.0001** (the fourth decimal place). For example, if EUR/USD rises from 1.0950 to 1.0951, it moved 1 Pip.
* For Japanese Yen pairs, 1 Pip is **0.01** (the second decimal place). If USD/JPY rises from 151.20 to 151.25, it moved 5 Pips.

#### What is a Lot?
Lots represent the size of your trade volume:
* **Standard Lot (1.0)**: 100,000 units of the base currency (approx. $10 per pip on EUR/USD).
* **Mini Lot (0.1)**: 10,000 units of the base currency (approx. $1 per pip on EUR/USD).
* **Micro Lot (0.01)**: 1,000 units of the base currency (approx. $0.10 per pip on EUR/USD).

#### Leverage & Margin
Leverage allows you to control large contract sizes with a small deposit (Margin). For example, with 1:100 leverage, you can trade $100,000 (1 Standard Lot) with just $1,000 of account capital. Leverage is a double-edged sword—it amplifies both profits and losses!`,
        quiz: [
          {
            question: "If EUR/USD moves from 1.1000 to 1.1050, how many pips did it move?",
            options: ["5 pips", "50 pips", "500 pips", "0.5 pips"],
            correctAnswerIndex: 1,
            explanation: "The fourth decimal place is the pip. 1.1050 minus 1.1000 is 0.0050, which equals 50 pips."
          }
        ]
      }
    ]
  },
  {
    id: "m2",
    title: "Technical Analysis & Price Action",
    tagline: "Learn to read charts like a map to spot high-probability entries.",
    cheatsheetPdfTitle: "Technical_Analysis_Cheatsheet.pdf",
    cheatsheetSlides: [
      "Slide 1: Candlestick Anatomy. Every candle tells a story. It has a Body (Open to Close range) and Wicks (High/Low extremities). A long bottom wick indicates strong buying rejection.",
      "Slide 2: Support & Resistance. Support is a floor where buyers tend to step in and push prices up. Resistance is a ceiling where sellers tend to dump supply and push prices down.",
      "Slide 3: Market Structure. In an uptrend, price makes Higher Highs (HH) and Higher Lows (HL). In a downtrend, price makes Lower Highs (LH) and Lower Lows (LL). Structuring breaks are vital triggers.",
      "Slide 4: Key Chart Patterns. Patterns like Double Tops/Bottoms reveal market reversals. Head and Shoulders show trend exhaustion, while flags and wedges show continuation dynamics."
    ],
    lessons: [
      {
        id: "l2_1",
        title: "Anatomy of Candlesticks & Market Structure",
        duration: "12 mins",
        description: "Understand the visual signals on your chart and how trend direction is formed.",
        youtubeId: "zXN9Yre5pks",
        contentMarkdown: `### Reading Price Action Directly
Instead of relying on lagging indicators, successful traders analyze raw price action.

#### Understanding Candlesticks
Each candlestick represents price activity over a specific timeframe (e.g., 1 hour, 4 hours, daily):
* **Green (Bullish) Candle**: Closes higher than it opened.
* **Red (Bearish) Candle**: Closes lower than it opened.
* **Wicks (Shadows)**: The thin lines extending from the body represent price extremes (High and Low) reached during that period.

#### Market Structure: The Trend is Your Friend
The market moves in waves rather than a straight line:
1. **Bullish Trend**: Characterized by successive **Higher Highs (HH)** and **Higher Lows (HL)**.
2. **Bearish Trend**: Characterized by successive **Lower Highs (LH)** and **Lower Lows (LL)**.
3. **Sideways/Consolidation**: Price is trapped inside a horizontal range between support and resistance.

A trend is considered active until a **Break of Structure (BOS)** occurs—where the last key structural low or high is cleanly violated by a closing candle.`,
        quiz: [
          {
            question: "What does a long wick at the bottom of a candlestick suggest?",
            options: ["Sellers are completely in control", "Price rejection of lower levels (Buying interest)", "The market is closing soon", "High spreads from the broker"],
            correctAnswerIndex: 1,
            explanation: "A long bottom wick means price went low but was rejected and driven back up by strong buying interest before the candle closed."
          }
        ]
      },
      {
        id: "l2_2",
        title: "Smart Money Concepts (SMC) & Liquidity",
        duration: "15 mins",
        description: "Explore advanced institutional concepts, Order Blocks, and Fair Value Gaps (FVG).",
        youtubeId: "bO2tXQ-HkSg",
        contentMarkdown: `### Trading Like the Institutions
Retail strategies often fail because banks and major financial institutions move the markets. Smart Money Concepts (SMC) helps you track institutional footpaths.

#### Liquidity Pools & Sweeps
Institutions need massive volume to fill their orders. They look for areas where retail stop-losses accumulate:
* **Below Equal Lows (Double Bottoms)**: Buyers place their sell-stops here. Banks push the price down to 'sweep' this liquidity and fill buy orders cheap.
* **Above Equal Highs (Double Tops)**: Sellers place their buy-stops here. Banks sweep this high liquidity before pushing the price downward.

#### Order Blocks (OB)
An **Order Block** is the last opposite-color candle before a rapid, impulsive breakout. It represents where institutions left massive unfilled buy or sell limit orders. Price often revisits these blocks to tap in and continue the trend.

#### Fair Value Gaps (FVG)
A **Fair Value Gap** (or imbalance) is a 3-candle sequence where the wicks of candle 1 and candle 3 do not touch, leaving an open void in candle 2. The market views this as an inefficiency and tends to retrace to 'fill' this gap like water filling a hole before resuming its trend.`,
        quiz: [
          {
            question: "What is a Fair Value Gap (FVG)?",
            options: ["A gap between trading sessions on Sunday", "A price imbalance where buying or selling was highly aggressive, leaving a 3-candle imbalance", "An indicator used to trade news", "A spread change during high impact news"],
            correctAnswerIndex: 1,
            explanation: "An FVG is an imbalance of buying/selling pressure represented by a clear gap between the first and third candle's wicks in a sequence."
          }
        ]
      }
    ]
  },
  {
    id: "m3",
    title: "Risk Management & Trading Psychology",
    tagline: "The absolute differentiator between winning and losing traders.",
    cheatsheetPdfTitle: "Risk_Management_Blueprint.pdf",
    cheatsheetSlides: [
      "Slide 1: The Golden Rule of 1%. Never risk more than 1% to 2% of your total account balance on a single trade. This protects you from catastrophic streaks of losses.",
      "Slide 2: Risk-to-Reward Ratio (R:R). Always target a minimum R:R of 1:2. If you lose $100 when wrong, you must aim to make at least $200 when right. This ensures profitability even with a 40% win rate.",
      "Slide 3: Winning Math. With a 1:3 R:R ratio, you only need to win 30% of your trades to be highly profitable. Let the statistics work for you, not your emotions.",
      "Slide 4: Emotional Traps. The two greatest killers in Forex are FOMO (Fear Of Missing Out) which causes premature entries, and Revenge Trading (trying to win back losses by sizing up) which blows accounts."
    ],
    lessons: [
      {
        id: "l3_1",
        title: "Position Sizing and Math of Risk",
        duration: "10 mins",
        description: "Master the exact formulas to calculate position sizes and keep your losses contained.",
        youtubeId: "F1WnC7u7m1Y",
        contentMarkdown: `### The Math of Surviving and Thriving
Many beginners focus 95% of their attention on 'where to enter'. Professional traders focus 95% of their attention on 'how much to risk'.

#### The 1% Rule
Never risk more than **1% to 2%** of your total capital on a single trade. If you have a $10,000 account, your maximum loss on any single trade should be $100.
Even if you face a terrible streak of 10 losses in a row, you still retain 90% of your capital. If you risk 10% per trade, you would lose everything!

#### Risk-to-Reward (R:R) Ratio
Your Risk-to-Reward ratio is the relationship between the amount you risk (Stop Loss) and the amount you target (Take Profit).
* If you risk $100 to make $300, your R:R is **1:3**.
* **Why this is powerful**: Let's look at the math over 10 trades with a 1:3 R:R.
  * You win 4 trades: $300 x 4 = +$1,200
  * You lose 6 trades: $100 x 6 = -$600
  * **Net Profit**: +$600 (even though you lost 60% of your trades!)`,
        quiz: [
          {
            question: "With a 1:3 Risk-to-Reward ratio, what win rate do you need to break even?",
            options: ["50%", "33%", "25%", "20%"],
            correctAnswerIndex: 2,
            explanation: "At 1:3 R:R, you win 3 units for every 1 unit lost. A 25% win rate (e.g., 1 win of $300 and 3 losses of $100) results in exactly $0 net ($300 - $300), which is breaven."
          }
        ]
      }
    ]
  }
];

// Seed/Mock Trades to initialize the application beautifully if none exist
export const SEED_TRADES: Trade[] = [
  {
    id: "t1",
    pair: "EUR/USD",
    type: "BUY",
    entryPrice: 1.08520,
    exitPrice: 1.09220,
    lotSize: 0.5,
    stopLoss: 1.08220,
    takeProfit: 1.09420,
    entryTime: "2026-06-15T14:30:00.000Z",
    exitTime: "2026-06-16T10:15:00.000Z",
    outcome: "PROFIT",
    profitAmount: 350.00,
    strategy: "Smart Money Concepts (SMC)",
    emotion: "Patient (Disciplined)",
    session: "London / New York Overlap",
    notes: "Tapped perfectly into 15m bullish order block. Checked all liquidity sweeps. Disciplined execution.",
    riskReward: 2.3
  },
  {
    id: "t2",
    pair: "GBP/USD",
    type: "SELL",
    entryPrice: 1.26450,
    exitPrice: 1.26120,
    lotSize: 0.3,
    stopLoss: 1.26750,
    takeProfit: 1.25850,
    entryTime: "2026-06-18T08:15:00.000Z",
    exitTime: "2026-06-18T16:45:00.000Z",
    outcome: "PROFIT",
    profitAmount: 99.00,
    strategy: "Price Action & Candlesticks",
    emotion: "Neutral (System Executed)",
    session: "London Session",
    notes: "Inverted pin bar at horizontal resistance. Stop loss held perfectly and targets were reached.",
    riskReward: 1.1
  },
  {
    id: "t3",
    pair: "USD/JPY",
    type: "BUY",
    entryPrice: 154.200,
    exitPrice: 153.800,
    lotSize: 0.4,
    stopLoss: 153.800,
    takeProfit: 155.000,
    entryTime: "2026-06-20T19:30:00.000Z",
    exitTime: "2026-06-21T02:00:00.000Z",
    outcome: "LOSS",
    profitAmount: -103.89,
    strategy: "Moving Average Crossover / Trend Following",
    emotion: "Greedy (FOMO / Oversized)",
    session: "Asian Session",
    notes: "Entered late on momentum without waiting for a retest. Sized too high. Lesson: patience pays.",
    riskReward: 2.0
  },
  {
    id: "t4",
    pair: "Gold (XAU/USD)",
    type: "SELL",
    entryPrice: 2320.50,
    exitPrice: 2328.00,
    lotSize: 0.1,
    stopLoss: 2328.00,
    takeProfit: 2305.00,
    entryTime: "2026-06-24T13:45:00.000Z",
    exitTime: "2026-06-24T14:10:00.000Z",
    outcome: "LOSS",
    profitAmount: -75.00,
    strategy: "Support & Resistance / Supply & Demand",
    emotion: "Frustrated (Revenge Trade)",
    session: "New York Session",
    notes: "Traded high impact CPI news volatility. Stopped out in seconds. Avoid trading news directly.",
    riskReward: 2.0
  },
  {
    id: "t5",
    pair: "GBP/JPY",
    type: "BUY",
    entryPrice: 198.500,
    exitPrice: 199.700,
    lotSize: 0.25,
    stopLoss: 197.900,
    takeProfit: 199.700,
    entryTime: "2026-06-25T09:00:00.000Z",
    exitTime: "2026-06-25T17:00:00.000Z",
    outcome: "PROFIT",
    profitAmount: 220.00,
    strategy: "Breakout / Liquidity Sweep",
    emotion: "Confident (In Zone)",
    session: "London Session",
    notes: "Sweep of Asian session highs followed by strong consolidation break. Position sizing was perfect.",
    riskReward: 2.0
  }
];
