import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import PlannerPage from './pages/PlannerPage';
import SpotsPage from './pages/SpotsPage';
import AuthPage from './pages/AuthPage';
import TripsPage from './pages/TripsPage';
import TranslatorPage from './pages/TranslatorPage';
import Chatbot from './components/Chatbot';
import './index.css';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/planner" element={<PlannerPage />} />
          <Route path="/spots" element={<SpotsPage />} />
          <Route path="/login" element={<AuthPage />} />
          <Route path="/trips" element={<TripsPage />} />
          <Route path="/translator" element={<TranslatorPage />} />
        </Routes>
        <Chatbot />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
