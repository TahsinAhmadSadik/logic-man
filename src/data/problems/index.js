import prob1 from './prob_1.json';
import prob2 from './prob_2.json';
import prob3 from './prob_3.json';
import freeSandbox from './free_sandbox.json';

export const PROBLEMS_INDEX = [
  {
    id: prob1.id,
    numId: prob1.numId,
    title: prob1.title,
    difficulty: prob1.difficulty,
    category: prob1.category || 'design',
    tags: prob1.tags || ['7404'],
    description: prob1.description
  },
  {
    id: prob2.id,
    numId: prob2.numId,
    title: prob2.title,
    difficulty: prob2.difficulty,
    category: prob2.category || 'design',
    tags: prob2.tags || ['7408'],
    description: prob2.description
  },
  {
    id: prob3.id,
    numId: prob3.numId,
    title: prob3.title,
    difficulty: prob3.difficulty,
    category: prob3.category || 'debug',
    tags: prob3.tags || ['7486', '7408'],
    description: prob3.description
  }
];

export const PROBLEMS_MAP = {
  prob_1: prob1,
  prob_2: prob2,
  prob_3: prob3,
  '1': prob1,
  '2': prob2,
  '3': prob3,
  free: freeSandbox,
  sandbox: freeSandbox,
  '0': freeSandbox
};

export const getProblemById = (id) => PROBLEMS_MAP[id] || null;