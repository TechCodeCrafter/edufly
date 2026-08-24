import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Nav } from './components/Nav';
import { Footer } from './components/Footer';
import Roadmap from './pages/Roadmap';
import TopicDetail from './pages/TopicDetail';
import Projects from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';
import Interview from './pages/Interview';
import InterviewTrack from './pages/InterviewTrack';
import Dashboard from './pages/Dashboard';
import Comparisons from './pages/Comparisons';
import ComparisonDetail from './pages/ComparisonDetail';
import Leaderboard from './pages/Leaderboard';
import NotFound from './pages/NotFound';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <div className="flex min-h-dvh flex-col">
      <ScrollToTop />
      <Nav />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Roadmap />} />
          <Route path="/topic/:id" element={<TopicDetail />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/project/:id" element={<ProjectDetail />} />
          <Route path="/interview" element={<Interview />} />
          <Route path="/interview/:slug" element={<InterviewTrack />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/compare" element={<Comparisons />} />
          <Route path="/compare/:id" element={<ComparisonDetail />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
