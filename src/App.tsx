import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import PlayPage from "./pages/PlayPage";
import BotsPage from "./pages/BotsPage";
import AnalysisPage from "./pages/AnalysisPage";
import StatsPage from "./pages/StatsPage";
import PuzzlesPage from "./pages/PuzzlesPage";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans antialiased selection:bg-emerald-500 selection:text-slate-950">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/play" element={<PlayPage />} />
          <Route path="/bots" element={<BotsPage />} />
          <Route path="/analysis" element={<AnalysisPage />} />
          <Route path="/stats" element={<StatsPage />} />
          <Route path="/puzzles" element={<PuzzlesPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}