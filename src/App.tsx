import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import VoterRegistration from './modules/identity-idp';
import VotingClient from './modules/voting-client';
import PublicBulletinBoard from './modules/ledger/PublicBulletinBoard';
import TallyingCenter from './modules/trustee/TallyingCenter';
import { Shield } from 'lucide-react';

function Navigation() {
  const location = useLocation();
  
  const navItems = [
    { path: '/', label: 'Phase 1: Registration' },
    { path: '/vote', label: 'Phase 2: Voting Client' },
    { path: '/pbb', label: 'Phase 3: Bulletin Board' },
    { path: '/tally', label: 'Phase 4 & 5: Tallying' },
  ];

  return (
    <nav className="bg-slate-900 text-white p-4 shadow-md">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 font-bold text-xl">
          <Shield className="text-blue-400" />
          <span>E2E-V Secure Voting</span>
        </div>
        <div className="flex flex-wrap justify-center gap-2">
          {navItems.map(item => (
            <Link 
              key={item.path} 
              to={item.path}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                location.pathname === item.path 
                  ? 'bg-blue-600 text-white' 
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-50 font-sans">
        <Navigation />
        <main className="p-4 md:p-8">
          <Routes>
            <Route path="/" element={<VoterRegistration />} />
            <Route path="/vote" element={<VotingClient />} />
            <Route path="/pbb" element={<PublicBulletinBoard />} />
            <Route path="/tally" element={<TallyingCenter />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

