import { createSkillCommandAdapter } from '../lib/project-skills.js';

export const installKiro = createSkillCommandAdapter({ ide: 'kiro', ideDir: '.kiro' });
