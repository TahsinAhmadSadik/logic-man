import prob1 from './prob_1.json';
import prob2 from './prob_2.json';
import prob3 from './prob_3.json';
import prob4 from './prob_4.json';
import prob81 from './prob_81.json';
import prob82 from './prob_82.json';
import prob83 from './prob_83.json';
import prob84 from './prob_84.json';
import prob85 from './prob_85.json';
import prob86 from './prob_86.json';
import prob87 from './prob_87.json';
import prob88 from './prob_88.json';
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
  },
  {
    id: prob4.id,
    numId: prob4.numId,
    title: prob4.title,
    difficulty: prob4.difficulty,
    category: prob4.category || 'debug',
    tags: prob4.tags || ['7404'],
    description: prob4.description
  },
  {
    id: prob81.id,
    numId: prob81.numId,
    title: prob81.title,
    difficulty: prob81.difficulty,
    category: prob81.category || 'design',
    tags: prob81.tags || [],
    description: prob81.description
  },
  {
    id: prob82.id,
    numId: prob82.numId,
    title: prob82.title,
    difficulty: prob82.difficulty,
    category: prob82.category || 'design',
    tags: prob82.tags || [],
    description: prob82.description
  },
  {
    id: prob83.id,
    numId: prob83.numId,
    title: prob83.title,
    difficulty: prob83.difficulty,
    category: prob83.category || 'design',
    tags: prob83.tags || [],
    description: prob83.description
  },
  {
    id: prob84.id,
    numId: prob84.numId,
    title: prob84.title,
    difficulty: prob84.difficulty,
    category: prob84.category || 'design',
    tags: prob84.tags || [],
    description: prob84.description
  },
  {
    id: prob85.id,
    numId: prob85.numId,
    title: prob85.title,
    difficulty: prob85.difficulty,
    category: prob85.category || 'design',
    tags: prob85.tags || [],
    description: prob85.description
  },
  {
    id: prob86.id,
    numId: prob86.numId,
    title: prob86.title,
    difficulty: prob86.difficulty,
    category: prob86.category || 'design',
    tags: prob86.tags || [],
    description: prob86.description
  },
  {
    id: prob87.id,
    numId: prob87.numId,
    title: prob87.title,
    difficulty: prob87.difficulty,
    category: prob87.category || 'design',
    tags: prob87.tags || [],
    description: prob87.description
  },
  {
    id: prob88.id,
    numId: prob88.numId,
    title: prob88.title,
    difficulty: prob88.difficulty,
    category: prob88.category || 'design',
    tags: prob88.tags || [],
    description: prob88.description
  }
];

export const PROBLEMS_MAP = {
  prob_1: prob1,
  prob_2: prob2,
  prob_3: prob3,
  prob_4: prob4,
  prob_81: prob81,
  prob_82: prob82,
  prob_83: prob83,
  prob_84: prob84,
  prob_85: prob85,
  prob_86: prob86,
  prob_87: prob87,
  prob_88: prob88,
  '1': prob1,
  '2': prob2,
  '3': prob3,
  '4': prob4,
  '81': prob81,
  '82': prob82,
  '83': prob83,
  '84': prob84,
  '85': prob85,
  '86': prob86,
  '87': prob87,
  '88': prob88,
  free: freeSandbox,
  sandbox: freeSandbox,
  '0': freeSandbox
};

export const getProblemById = (id) => PROBLEMS_MAP[id] || null;


// add import
// add into Problem Index
// add into Problem map twice