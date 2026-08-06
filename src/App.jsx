import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { ProblemSimulatorWrapper } from './pages/ProblemSimulatorWrapper';
import { ProblemStudioPage } from './pages/ProblemStudioPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/problem/:id" element={<ProblemSimulatorWrapper />} />
        <Route path="/author" element={<ProblemStudioPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}