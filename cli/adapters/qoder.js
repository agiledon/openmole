import { createSkillCommandAdapter } from '../lib/project-skills.js';

export const installQoder = createSkillCommandAdapter({ ide: 'qoder', ideDir: '.qoder' });
