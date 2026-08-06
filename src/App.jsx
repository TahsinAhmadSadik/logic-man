import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ProblemSimulatorWrapper } from './pages/ProblemSimulatorWrapper';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Default route redirects to Problem 1 */}
        <Route path="/" element={<Navigate to="/problem/prob_1" replace />} />
        
        {/* Dynamic route for problem simulator */}
        <Route path="/problem/:id" element={<ProblemSimulatorWrapper />} />
        
        {/* Fallback for unknown URLs */}
        <Route path="*" element={<Navigate to="/problem/prob_1" replace />} />
      </Routes>
    </BrowserRouter>
  );
}