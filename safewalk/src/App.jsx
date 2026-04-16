import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import SOSButton from './components/SOSButton';
import LandingPage from './pages/LandingPage';
import SafetyMap from './pages/SafetyMap';
import RouteFinder from './pages/RouteFinder';
import ReviewForm from './pages/ReviewForm';
import Dashboard from './pages/Dashboard';
import './App.css';

export default function App() {
  return (
    <Router>
      <Navbar />
      <main className="app-main">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/map" element={<SafetyMap />} />
          <Route path="/route" element={<RouteFinder />} />
          <Route path="/review" element={<ReviewForm />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </main>
      <SOSButton />
    </Router>
  );
}
