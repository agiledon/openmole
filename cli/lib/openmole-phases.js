/** OpenMole command (slash) name → skill directory name */
export const OPENMOLE_PHASES = [
  { command: 'mole-explore', skill: 'openmole-explore' },
  { command: 'mole-verify', skill: 'openmole-verify' },
  { command: 'mole-plan', skill: 'openmole-plan' },
  { command: 'mole-apply', skill: 'openmole-apply' },
  { command: 'mole-archive', skill: 'openmole-archive' },
];

export const OPENMOLE_SKILL_NAMES = OPENMOLE_PHASES.map((p) => p.skill);
export const OPENMOLE_COMMAND_NAMES = OPENMOLE_PHASES.map((p) => p.command);
