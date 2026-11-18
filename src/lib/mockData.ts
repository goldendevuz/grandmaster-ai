import botsData from "../data/bots.json";
import puzzlesData from "../data/puzzles.json";
import openingsData from "../data/openings.json";

export interface Bot {
  id: string;
  name: string;
  title: string;
  elo: number;
  avatar: string;
  personality: string;
  depth: number;
  playstyle: string;
}

export interface Puzzle {
  id: string;
  title: string;
  fen: string;
  rating: number;
  solution: string;
  theme: string;
}

export interface Opening {
  id: string;
  name: string;
  eco: string;
  moves: string;
  description: string;
}

export const bots: Bot[] = botsData.items as Bot[];
export const puzzles: Puzzle[] = puzzlesData.items as Puzzle[];
export const openings: Opening[] = openingsData.items as Opening[];

// Formatter helper for rating and percentages
export function formatElo(elo: number): string {
  return `${elo} ELO`;
}

export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}