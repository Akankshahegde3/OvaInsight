import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './index.css';
import Sidebar       from './components/Sidebar';
import Login         from './pages/Login';
import Dashboard     from './pages/Dashboard';
import Assessment    from './pages/Assessment';
import Results       from './pages/Results';
import Chatbot       from './pages/Chatbot';
import PeriodTracker from './pages/PeriodTracker';
import Schemes       from './pages/Schemes';
import Exercises     from './pages/Exercises';
import History       from './pages/History';

function Layout({ user, onLogout, result, onResult, history, onAddHistory }) {
  return (
    <div className="shell">
      <Sidebar user={user} onLogout={onLogout} />
      <div className="content">
        <Routes>
          <Route path="/"          element={<Dashboard  result={result} user={user} />} />
          <Route path="/assess"    element={<Assessment onResult={onResult} onAddHistory={onAddHistory} />} />
          <Route path="/results"   element={<Results    result={result} />} />
          <Route path="/tracker"   element={<PeriodTracker />} />
          <Route path="/chatbot"   element={<Chatbot    result={result} />} />
          <Route path="/schemes"   element={<Schemes    result={result} />} />
          <Route path="/exercises" element={<Exercises />} />
          <Route path="/history"   element={<History    history={history} />} />
          <Route path="*"          element={<Navigate to="/" />} />
        </Routes>
      </div>
    </div>
  );
}

export default function App() {
  const [user,    setUser]    = useState(() => localStorage.getItem('ova_user') || null);
  const [result,  setResult]  = useState(() => { try { return JSON.parse(localStorage.getItem('ova_result')); } catch { return null; } });
  const [history, setHistory] = useState(() => { try { return JSON.parse(localStorage.getItem('ova_history')) || []; } catch { return []; } });

  const handleLogin  = (u) => { localStorage.setItem('ova_user', u); setUser(u); };
  const handleLogout = () => { localStorage.removeItem('ova_user'); localStorage.removeItem('ova_result'); setUser(null); setResult(null); };

  const handleResult = (r) => {
    const stamped = { ...r, date: new Date().toISOString() };
    setResult(stamped);
    localStorage.setItem('ova_result', JSON.stringify(stamped));
  };

  const handleAddHistory = (entry) => {
    const updated = [entry, ...history].slice(0, 20);
    setHistory(updated);
    localStorage.setItem('ova_history', JSON.stringify(updated));
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={user ? <Navigate to="/" /> : <Login onLogin={handleLogin} />} />
        <Route path="/*" element={
          user
            ? <Layout user={user} onLogout={handleLogout} result={result} onResult={handleResult}
                history={history} onAddHistory={handleAddHistory} />
            : <Navigate to="/login" />
        } />
      </Routes>
    </BrowserRouter>
  );
}
