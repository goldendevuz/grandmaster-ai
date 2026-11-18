import { useState, useMemo } from "react";
import { useAppStore } from "../../store/useAppStore";

// Representation of chess pieces with high quality Unicode symbols & styling
const PIECE_UNICODE: Record<string, string> = {
  P: "♙",
  N: "♘",
  B: "♗",
  R: "♖",
  Q: "♕",
  K: "♔",
  p: "♟",
  n: "♞",
  b: "♝",
  r: "♜",
  q: "♛",
  k: "♚",
};

interface ChessBoardViewProps {
  interactive?: boolean;
  onSquareClickOverride?: (sq: string) => void;
  highlightedSquares?: string[];
  theme?: "wood" | "emerald" | "slate";
}

export default function ChessBoardView({
  interactive = true,
  onSquareClickOverride,
  highlightedSquares = [],
  theme = "emerald",
}: ChessBoardViewProps) {
  const { fen, selectedSquare, setSelectedSquare, makeMove, currentTurn, isThinking } = useAppStore();
  const [lastMoveSquares, setLastMoveSquares] = useState<string[]>([]);

  // Parse FEN into an 8x8 matrix
  const boardMatrix = useMemo(() => {
    const rows = fen.split(" ")[0].split("/");
    const matrix: (string | null)[][] = [];

    for (let r = 0; r < 8; r++) {
      const rowArr: (string | null)[] = [];
      const fenRow = rows[r] || "8";
      for (const ch of fenRow) {
        if (/\d/.test(ch)) {
          const emptyCount = parseInt(ch, 10);
          for (let e = 0; e < emptyCount; e++) {
            rowArr.push(null);
          }
        } else {
          rowArr.push(ch);
        }
      }
      matrix.push(rowArr);
    }
    return matrix;
  }, [fen]);

  const files = ["a", "b", "c", "d", "e", "f", "g", "h"];
  const ranks = ["8", "7", "6", "5", "4", "3", "2", "1"];

  const handleSquareClick = (squareKey: string, piece: string | null) => {
    if (!interactive || isThinking) return;

    if (onSquareClickOverride) {
      onSquareClickOverride(squareKey);
      return;
    }

    if (!selectedSquare) {
      // White pieces are uppercase
      if (piece && currentTurn === "w" && piece === piece.toUpperCase()) {
        setSelectedSquare(squareKey);
      }
    } else {
      if (selectedSquare === squareKey) {
        setSelectedSquare(null);
      } else {
        // Simple move simulation
        const isTargetFriendly = piece && piece === piece.toUpperCase();
        if (isTargetFriendly) {
          setSelectedSquare(squareKey);
        } else {
          // Commit move
          setLastMoveSquares([selectedSquare, squareKey]);
          makeMove(selectedSquare, squareKey, `${selectedSquare.toUpperCase()}→${squareKey.toUpperCase()}`);
          setSelectedSquare(null);
        }
      }
    }
  };

  // Color schemes
  const boardThemes = {
    emerald: {
      light: "bg-[#e2e8f0]",
      dark: "bg-[#059669]",
      selected: "ring-4 ring-amber-400 bg-amber-400/40",
      highlight: "bg-emerald-300/60",
    },
    wood: {
      light: "bg-[#f5e6cb]",
      dark: "bg-[#b8860b]",
      selected: "ring-4 ring-amber-400 bg-amber-500/40",
      highlight: "bg-amber-200/50",
    },
    slate: {
      light: "bg-slate-300",
      dark: "bg-slate-700",
      selected: "ring-4 ring-emerald-400 bg-emerald-500/40",
      highlight: "bg-slate-500/60",
    },
  };

  const currentColors = boardThemes[theme];

  return (
    <div className="relative p-2.5 sm:p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl max-w-xl mx-auto select-none">
      <div className="grid grid-cols-8 border-2 border-slate-700/80 rounded-xl overflow-hidden aspect-square shadow-inner">
        {ranks.map((rank, rIdx) =>
          files.map((file, fIdx) => {
            const squareKey = `${file}${rank}`;
            const piece = boardMatrix[rIdx]?.[fIdx] ?? null;
            const isDark = (rIdx + fIdx) % 2 === 1;
            const isSelected = selectedSquare === squareKey;
            const isHighlighted = highlightedSquares.includes(squareKey) || lastMoveSquares.includes(squareKey);
            const isWhitePiece = piece && piece === piece.toUpperCase();

            return (
              <button
                key={squareKey}
                onClick={() => handleSquareClick(squareKey, piece)}
                className={`relative flex items-center justify-center transition-all duration-150 focus:outline-none ${
                  isDark ? currentColors.dark : currentColors.light
                } ${isSelected ? currentColors.selected : ""} ${
                  isHighlighted ? currentColors.highlight : ""
                } hover:opacity-95`}
                title={`${squareKey.toUpperCase()}${piece ? ` (${piece})` : ""}`}
              >
                {/* Board coordinate labels on edges */}
                {fIdx === 0 && (
                  <span
                    className={`absolute top-0.5 left-1 text-[9px] sm:text-[11px] font-bold ${
                      isDark ? "text-emerald-100/70" : "text-slate-600/70"
                    }`}
                  >
                    {rank}
                  </span>
                )}
                {rIdx === 7 && (
                  <span
                    className={`absolute bottom-0.5 right-1 text-[9px] sm:text-[11px] font-bold ${
                      isDark ? "text-emerald-100/70" : "text-slate-600/70"
                    }`}
                  >
                    {file}
                  </span>
                )}

                {/* Move Hint Dot */}
                {isSelected && (
                  <span className="absolute w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-amber-400/70 pointer-events-none" />
                )}

                {/* Piece representation */}
                {piece && (
                  <span
                    className={`text-2xl sm:text-4xl md:text-5xl font-normal leading-none transform transition-transform active:scale-95 ${
                      isWhitePiece
                        ? "text-white drop-shadow-[0_2px_3px_rgba(0,0,0,0.8)] filter"
                        : "text-slate-950 drop-shadow-[0_1px_1px_rgba(255,255,255,0.4)]"
                    }`}
                  >
                    {PIECE_UNICODE[piece] || piece}
                  </span>
                )}
              </button>
            );
          })
        )}
      </div>

      {/* Thinking state overlay */}
      {isThinking && (
        <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center rounded-2xl">
          <div className="bg-slate-900 border border-emerald-500/40 px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3">
            <div className="w-5 h-5 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
            <span className="text-sm font-bold text-emerald-400">Sun'iy intellekt hisoblamoqda...</span>
          </div>
        </div>
      )}
    </div>
  );
}