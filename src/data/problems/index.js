import prob1 from './prob_1.json';
import prob2 from './prob_2.json';
import prob3 from './prob_3.json';
import prob4 from './prob_4.json';
import prob21 from './prob_21.json';
import prob22 from './prob_22.json';
import prob23 from './prob_23.json';
import prob24 from './prob_24.json';
import prob25 from './prob_25.json';
import prob31 from './prob_31.json';
import prob32 from './prob_32.json';
import prob33 from './prob_33.json';
import prob34 from './prob_34.json';
import prob39 from './prob_39.json';
import prob81 from './prob_81.json';
import prob82 from './prob_82.json';
import prob83 from './prob_83.json';
import prob84 from './prob_84.json';
import prob85 from './prob_85.json';
import prob86 from './prob_86.json';
import prob87 from './prob_87.json';
import prob88 from './prob_88.json';
import freeSandbox from './free_sandbox.json';

// Helper to sanitize category string so filters match 'design' or 'debug'
const getCategory = (prob) => {
  if (prob.category?.toLowerCase().includes('debug')) return 'debug';
  return 'design';
};

export const PROBLEMS_INDEX = [
  {
    id: prob1.id,
    numId: prob1.numId,
    title: prob1.title,
    difficulty: prob1.difficulty,
    category: getCategory(prob1),
    tags: prob1.tags || ['7404'],
    description: prob1.description
  },
  {
    id: prob2.id,
    numId: prob2.numId,
    title: prob2.title,
    difficulty: prob2.difficulty,
    category: getCategory(prob2),
    tags: prob2.tags || ['7408'],
    description: prob2.description
  },
  {
    id: prob3.id,
    numId: prob3.numId,
    title: prob3.title,
    difficulty: prob3.difficulty,
    category: getCategory(prob3),
    tags: prob3.tags || ['7486', '7408'],
    description: prob3.description
  },
  {
    id: prob4.id,
    numId: prob4.numId,
    title: prob4.title,
    difficulty: prob4.difficulty,
    category: getCategory(prob4),
    tags: prob4.tags || ['7404'],
    description: prob4.description
  },
  {
    id: prob21.id,
    numId: prob21.numId,
    title: prob21.title,
    difficulty: prob21.difficulty,
    category: getCategory(prob21),
    tags: prob21.tags || [],
    description: prob21.description
  },
  {
    id: prob22.id,
    numId: prob22.numId,
    title: prob22.title,
    difficulty: prob22.difficulty,
    category: getCategory(prob22),
    tags: prob22.tags || [],
    description: prob22.description
  },
  {
    id: prob23.id,
    numId: prob23.numId,
    title: prob23.title,
    difficulty: prob23.difficulty,
    category: getCategory(prob23),
    tags: prob23.tags || [],
    description: prob23.description
  },
  {
    id: prob24.id,
    numId: prob24.numId,
    title: prob24.title,
    difficulty: prob24.difficulty,
    category: getCategory(prob24),
    tags: prob24.tags || [],
    description: prob24.description
  },
  {
    id: prob25.id,
    numId: prob25.numId,
    title: prob25.title,
    difficulty: prob25.difficulty,
    category: getCategory(prob25),
    tags: prob25.tags || [],
    description: prob25.description
  },
  {
    id: prob31.id,
    numId: prob31.numId,
    title: prob31.title,
    difficulty: prob31.difficulty,
    category: getCategory(prob31),
    tags: prob31.tags || [],
    description: prob31.description
  },
  {
    id: prob32.id,
    numId: prob32.numId,
    title: prob32.title,
    difficulty: prob32.difficulty,
    category: getCategory(prob32),
    tags: prob32.tags || [],
    description: prob32.description
  },
  {
    id: prob33.id,
    numId: prob33.numId,
    title: prob33.title,
    difficulty: prob33.difficulty,
    category: getCategory(prob33),
    tags: prob33.tags || [],
    description: prob33.description
  },
  {
    id: prob34.id,
    numId: prob34.numId,
    title: prob34.title,
    difficulty: prob34.difficulty,
    category: getCategory(prob34),
    tags: prob34.tags || [],
    description: prob34.description
  },
  {
    id: prob39.id,
    numId: prob39.numId,
    title: prob39.title,
    difficulty: prob39.difficulty,
    category: getCategory(prob39),
    tags: prob39.tags || [],
    description: prob39.description
  },
  {
    id: prob81.id,
    numId: prob81.numId,
    title: prob81.title,
    difficulty: prob81.difficulty,
    category: getCategory(prob81),
    tags: prob81.tags || [],
    description: prob81.description
  },
  {
    id: prob82.id,
    numId: prob82.numId,
    title: prob82.title,
    difficulty: prob82.difficulty,
    category: getCategory(prob82),
    tags: prob82.tags || [],
    description: prob82.description
  },
  {
    id: prob83.id,
    numId: prob83.numId,
    title: prob83.title,
    difficulty: prob83.difficulty,
    category: getCategory(prob83),
    tags: prob83.tags || [],
    description: prob83.description
  },
  {
    id: prob84.id,
    numId: prob84.numId,
    title: prob84.title,
    difficulty: prob84.difficulty,
    category: getCategory(prob84),
    tags: prob84.tags || [],
    description: prob84.description
  },
  {
    id: prob85.id,
    numId: prob85.numId,
    title: prob85.title,
    difficulty: prob85.difficulty,
    category: getCategory(prob85),
    tags: prob85.tags || [],
    description: prob85.description
  },
  {
    id: prob86.id,
    numId: prob86.numId,
    title: prob86.title,
    difficulty: prob86.difficulty,
    category: getCategory(prob86),
    tags: prob86.tags || [],
    description: prob86.description
  },
  {
    id: prob87.id,
    numId: prob87.numId,
    title: prob87.title,
    difficulty: prob87.difficulty,
    category: getCategory(prob87),
    tags: prob87.tags || [],
    description: prob87.description
  },
  {
    id: prob88.id,
    numId: prob88.numId,
    title: prob88.title,
    difficulty: prob88.difficulty,
    category: getCategory(prob88),
    tags: prob88.tags || [],
    description: prob88.description
  }
];

export const PROBLEMS_MAP = {
  prob_1: prob1,
  prob_2: prob2,
  prob_3: prob3,
  prob_4: prob4,
  prob_21: prob21,
  prob_22: prob22,
  prob_23: prob23,
  prob_24: prob24,
  prob_25: prob25,
  prob_31: prob31,
  prob_32: prob32,
  prob_33: prob33,
  prob_34: prob34,
  prob_39: prob39,
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
  '21': prob21,
  '22': prob22,
  '23': prob23,
  '24': prob24,
  '25': prob25,
  '31': prob31,
  '32': prob32,
  '33': prob33,
  '34': prob34,
  '39': prob39,
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