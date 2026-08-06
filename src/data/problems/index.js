import prob1 from './prob_1.json';
import prob2 from './prob_2.json';
import prob3 from './prob_3.json';

export const PROBLEMS_INDEX = [
  { id: 'prob_1', numId: 1, title: prob1.title, difficulty: prob1.difficulty, tags: prob1.tags },
  { id: 'prob_2', numId: 2, title: prob2.title, difficulty: prob2.difficulty, tags: prob2.tags },
  { id: 'prob_3', numId: 3, title: prob3.title, difficulty: prob3.difficulty, tags: prob3.tags }
];

export const PROBLEMS_MAP = {
  prob_1: prob1,
  prob_2: prob2,
  prob_3: prob3,
  '1': prob1,
  '2': prob2,
  '3': prob3
};

export const getProblemById = (id) => PROBLEMS_MAP[id] || null;