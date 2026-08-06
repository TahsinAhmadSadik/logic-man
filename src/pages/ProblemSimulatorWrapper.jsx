import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSimulatorStore } from '../store/useSimulatorStore';
import { getProblemById } from '../data/problems';
import { HoleCanvas } from '../components/HoleCanvas';

export const ProblemSimulatorWrapper = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { loadProblem } = useSimulatorStore();

  useEffect(() => {
    const problemData = getProblemById(id || 'prob_1');
    
    if (problemData) {
      loadProblem(problemData);
    } else {
      // If problem ID doesn't exist, fallback or redirect
      alert(`Problem "${id}" not found! Redirecting to Problem #1.`);
      navigate('/problem/prob_1', { replace: true });
    }
  }, [id, loadProblem, navigate]);

  return <HoleCanvas />;
};