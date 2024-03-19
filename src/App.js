import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import AdminView from './AdminView';
import UserView from './UserView';

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<UserView />} />
          <Route path="/banhammer" element={<AdminView />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
