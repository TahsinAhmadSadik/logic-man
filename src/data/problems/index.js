import prob1 from './prob_1.json';
import prob2 from './prob_2.json';
import prob3 from './prob_3.json';
import prob4 from './prob_4.json';
import prob21 from './prob_21.json';
import prob22 from './prob_22.json';
import prob23 from './prob_23.json';
import prob24 from './prob_24.json';
import prob25 from './prob_25.json';
import prob26 from './prob_26.json';
import prob27 from './prob_27.json';
import prob28 from './prob_28.json';
import prob29 from './prob_29.json';
import prob30 from './prob_30.json';
import prob31 from './prob_31.json';
import prob32 from './prob_32.json';
import prob33 from './prob_33.json';
import prob34 from './prob_34.json';
import prob39 from './prob_39.json';
import prob51 from './prob_51.json';
import prob52 from './prob_52.json';
import prob53 from './prob_53.json';
import prob54 from './prob_54.json';
import prob55 from './prob_55.json';
import prob56 from './prob_56.json';
import prob57 from './prob_57.json';
import prob58 from './prob_58.json';
// import prob59 from './prob_59.json';
// import prob60 from './prob_60.json';
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
    id: prob26.id,
    numId: prob26.numId,
    title: prob26.title,
    difficulty: prob26.difficulty,
    category: getCategory(prob26),
    tags: prob26.tags || [],
    description: prob26.description
  },
  {
    id: prob27.id,
    numId: prob27.numId,
    title: prob27.title,
    difficulty: prob27.difficulty,
    category: getCategory(prob27),
    tags: prob27.tags || [],
    description: prob27.description
  },
  {
    id: prob28.id,
    numId: prob28.numId,
    title: prob28.title,
    difficulty: prob28.difficulty,
    category: getCategory(prob28),
    tags: prob28.tags || [],
    description: prob28.description
  },
  {
    id: prob29.id,
    numId: prob29.numId,
    title: prob29.title,
    difficulty: prob29.difficulty,
    category: getCategory(prob29),
    tags: prob29.tags || [],
    description: prob29.description
  },
  {
    id: prob30.id,
    numId: prob30.numId,
    title: prob30.title,
    difficulty: prob30.difficulty,
    category: getCategory(prob30),
    tags: prob30.tags || [],
    description: prob30.description
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
    id: prob51.id,
    numId: prob51.numId,
    title: prob51.title,
    difficulty: prob51.difficulty,
    category: getCategory(prob51),
    tags: prob51.tags || [],
    description: prob51.description
  },
  {
    id: prob52.id,
    numId: prob52.numId,
    title: prob52.title,
    difficulty: prob52.difficulty,
    category: getCategory(prob52),
    tags: prob52.tags || [],
    description: prob52.description
  },
  {
    id: prob53.id,
    numId: prob53.numId,
    title: prob53.title,
    difficulty: prob53.difficulty,
    category: getCategory(prob53),
    tags: prob53.tags || [],
    description: prob53.description
  },
  {
    id: prob54.id,
    numId: prob54.numId,
    title: prob54.title,
    difficulty: prob54.difficulty,
    category: getCategory(prob54),
    tags: prob54.tags || [],
    description: prob54.description
  },
  {
    id: prob55.id,
    numId: prob55.numId,
    title: prob55.title,
    difficulty: prob55.difficulty,
    category: getCategory(prob55),
    tags: prob55.tags || [],
    description: prob55.description
  },
  {
    id: prob56.id,
    numId: prob56.numId,
    title: prob56.title,
    difficulty: prob56.difficulty,
    category: getCategory(prob56),
    tags: prob56.tags || [],
    description: prob56.description
  },
  {
    id: prob57.id,
    numId: prob57.numId,
    title: prob57.title,
    difficulty: prob57.difficulty,
    category: getCategory(prob57),
    tags: prob57.tags || [],
    description: prob57.description
  },
  {
    id: prob58.id,
    numId: prob58.numId,
    title: prob58.title,
    difficulty: prob58.difficulty,
    category: getCategory(prob58),
    tags: prob58.tags || [],
    description: prob58.description
  },
  // {
  //   id: prob59.id,
  //   numId: prob59.numId,
  //   title: prob59.title,
  //   difficulty: prob59.difficulty,
  //   category: getCategory(prob59),
  //   tags: prob59.tags || [],
  //   description: prob59.description
  // },
  // {
  //   id: prob60.id,
  //   numId: prob60.numId,
  //   title: prob60.title,
  //   difficulty: prob60.difficulty,
  //   category: getCategory(prob60),
  //   tags: prob60.tags || [],
  //   description: prob60.description
  // },
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
  prob_26: prob26,
  prob_27: prob27,
  prob_28: prob28,
  prob_29: prob29,
  prob_30: prob30,
  prob_31: prob31,
  prob_32: prob32,
  prob_33: prob33,
  prob_34: prob34,
  prob_39: prob39,
  prob_51: prob51,
  prob_52: prob52,
  prob_53: prob53,
  prob_54: prob54,
  prob_55: prob55,
  prob_56: prob56,
  prob_57: prob57,
  prob_58: prob58,
  // prob_59: prob59,
  // prob_60: prob60,
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
  '26': prob26,
  '27': prob27,
  '28': prob28,
  '29': prob29,
  '30': prob30,
  '31': prob31,
  '32': prob32,
  '33': prob33,
  '34': prob34,
  '39': prob39,
  '51': prob51,
  '52': prob52,
  '53': prob53,
  '54': prob54,
  '55': prob55,
  '56': prob56,
  '57': prob57,
  '58': prob58,
  // '59': prob59,
  // '60': prob60,
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