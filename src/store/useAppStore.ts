import { create } from "zustand";

export interface MoveRecord {
  moveNumber: number;
  white: string;
  black?: string;
  whiteEval?: number;
  blackEval?: number;
  annotation?: string;
}

export interface PlayerStats {
  gamesPlayed: number;
  wins: number;
  losses: number;
  draws: number;
  playerElo: number;
  accuracyAvg: number;
  winRateByDifficulty: Record<string, number>;
}

export interface AnalysisState {
  blunderCount: number;
  mistakeCount: number;
  inaccuracyCount: number;
  bestMove: string;
  engineRecommendation: string;
  advantageSummary: string;
}

interface AppStoreState {
  // Game state
  fen: string;
  moveHistory: MoveRecord[];
  currentTurn: "w" | "b";
  selectedSquare: string | null;
  botDifficulty: string;
  botElo: number;
  evaluationScore: number; // centipawns / 100 (e.g. +1.4 or -0.8)
  isThinking: boolean;
  capturedWhite: string[];
  capturedBlack: string[];
  isGameOver: boolean;
  gameResult: string | null;

  // Timers (in seconds)
  whiteTime: number;
  blackTime: number;
  isTimerRunning: boolean;

  // Statistics
  stats: PlayerStats;

  // Analysis
  analysis: AnalysisState;

  // Actions
  setFen: (fen: string) => void;
  setSelectedSquare: (sq: string | null) => void;
  setBotDifficulty: (difficulty: string, elo: number) => void;
  makeMove: (from: string, to: string, pieceNotation: string) => void;
  resetGame: () => void;
  setThinking: (thinking: boolean) => void;
  updateEvaluation: (score: number) => void;
  tickTimer: () => void;
  recordGameResult: (result: "win" | "loss" | "draw") => void;
}

export const INITIAL_FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

export const useAppStore = create<AppStoreState>((set) => ({
  fen: INITIAL_FEN,
  moveHistory: [],
  currentTurn: "w",
  selectedSquare: null,
  botDifficulty: "Boshlang'ich (Sardor)",
  botElo: 600,
  evaluationScore: 0.1,
  isThinking: false,
  capturedWhite: [],
  capturedBlack: [],
  isGameOver: false,
  gameResult: null,

  whiteTime: 600, // 10 minutes default
  blackTime: 600,
  isTimerRunning: false,

  stats: {
    gamesPlayed: 48,
    wins: 28,
    losses: 14,
    draws: 6,
    playerElo: 1420,
    accuracyAvg: 81.4,
    winRateByDifficulty: {
      "Oson (400-800)": 92,
      "O'rtacha (1000-1400)": 64,
      "Usta (1600-2000)": 38,
      "Grossmeyster (2400+)": 9,
    },
  },

  analysis: {
    blunderCount: 1,
    mistakeCount: 3,
    inaccuracyCount: 4,
    bestMove: "Nf3",
    engineRecommendation: "Markaziy kataklarni nazoratga oling va otni rivojlantiring.",
    advantageSummary: "Oqlar markazda kichik pozitsion ustunlikka ega (+0.3)",
  },

  setFen: (fen) => set({ fen }),
  setSelectedSquare: (selectedSquare) => set({ selectedSquare }),
  setBotDifficulty: (botDifficulty, botElo) => set({ botDifficulty, botElo }),

  makeMove: (from, to, pieceNotation) =>
    set((state) => {
      const isWhite = state.currentTurn === "w";
      const newHistory = [...state.moveHistory];

      if (isWhite) {
        newHistory.push({
          moveNumber: newHistory.length + 1,
          white: pieceNotation || `${from}-${to}`,
          whiteEval: state.evaluationScore,
        });
      } else {
        if (newHistory.length > 0) {
          const last = newHistory[newHistory.length - 1];
          last.black = pieceNotation || `${from}-${to}`;
          last.blackEval = state.evaluationScore;
        }
      }

      return {
        moveHistory: newHistory,
        currentTurn: isWhite ? "b" : "w",
        selectedSquare: null,
        isTimerRunning: true,
      };
    }),

  resetGame: () =>
    set({
      fen: INITIAL_FEN,
      moveHistory: [],
      currentTurn: "w",
      selectedSquare: null,
      evaluationScore: 0.1,
      isThinking: false,
      capturedWhite: [],
      capturedBlack: [],
      isGameOver: false,
      gameResult: null,
      whiteTime: 600,
      blackTime: 600,
      isTimerRunning: false,
    }),

  setThinking: (isThinking) => set({ isThinking }),
  updateEvaluation: (evaluationScore) => set({ evaluationScore }),

  tickTimer: () =>
    set((state) => {
      if (!state.isTimerRunning || state.isGameOver) return state;
      if (state.currentTurn === "w") {
        const nextTime = Math.max(0, state.whiteTime - 1);
        return {
          whiteTime: nextTime,
          isGameOver: nextTime === 0,
          gameResult: nextTime === 0 ? "Vaqt tugadi: Bot g'alaba qozondi!" : state.gameResult,
        };
      } else {
        const nextTime = Math.max(0, state.blackTime - 1);
        return {
          blackTime: nextTime,
          isGameOver: nextTime === 0,
          gameResult: nextTime === 0 ? "Vaqt tugadi: Siz g'alaba qozondingiz!" : state.gameResult,
        };
      }
    }),

  recordGameResult: (result) =>
    set((state) => {
      const isWin = result === "win";
      const isLoss = result === "loss";
      const isDraw = result === "draw";

      return {
        isGameOver: true,
        gameResult: isWin
          ? "Tabriklaymiz, siz g'alaba qozondingiz!"
          : isLoss
          ? "Afsuski, bot g'alaba qozondi."
          : "O'yin durang bilan yakunlandi.",
        stats: {
          ...state.stats,
          gamesPlayed: state.stats.gamesPlayed + 1,
          wins: state.stats.wins + (isWin ? 1 : 0),
          losses: state.stats.losses + (isLoss ? 1 : 0),
          draws: state.stats.draws + (isDraw ? 1 : 0),
          playerElo: state.stats.playerElo + (isWin ? 15 : isLoss ? -12 : 2),
        },
      };
    }),
}));