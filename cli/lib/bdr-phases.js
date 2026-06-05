/** BDR command (slash) name → skill directory name */
export const BDR_PHASES = [
  { command: 'bdr-explore', skill: 'bdr-explore-to-change' },
  { command: 'bdr-analyze', skill: 'bdr-analyze-change' },
  { command: 'bdr-plan', skill: 'bdr-plan-change' },
  { command: 'bdr-apply', skill: 'bdr-apply-change' },
  { command: 'bdr-archive', skill: 'bdr-archive-change' },
];

export const BDR_SKILL_NAMES = BDR_PHASES.map((p) => p.skill);
export const BDR_COMMAND_NAMES = BDR_PHASES.map((p) => p.command);
