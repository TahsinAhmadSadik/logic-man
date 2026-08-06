import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { ProblemSimulatorWrapper } from './pages/ProblemSimulatorWrapper';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Homepage with problem list & search */}
        <Route path="/" element={<HomePage />} />
        
        {/* Dynamic simulator route */}
        <Route path="/problem/:id" element={<ProblemSimulatorWrapper />} />
        
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}