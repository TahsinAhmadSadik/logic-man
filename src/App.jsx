import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { ProblemSimulatorWrapper } from './pages/ProblemSimulatorWrapper';
import { ProblemStudioPage } from './pages/ProblemStudioPage';
import { ContributorsPage } from './pages/ContributorsPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/author" element={<ProblemStudioPage />} />
        <Route path="/contributors" element={<ContributorsPage />} />
        <Route path="/problem/:id" element={<ProblemSimulatorWrapper />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}