import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import PlannerPage from './pages/PlannerPage';
import SpotsPage from './pages/SpotsPage';
import './index.css';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/planner" element={<PlannerPage />} />
        <Route path="/spots" element={<SpotsPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
