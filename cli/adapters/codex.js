import path from 'path';
import { installProjectSkills } from '../lib/project-skills.js';

/** Codex: project .codex/skills/ (Codex auto-discovers SKILL.md here).
 *  Codex does not have a separate slash-command mechanism. */
function installCodexProject({ packageRoot, targetDir, dryRun, force }) {
  const skillsDir = path.join(targetDir, '.codex', 'skills');
  const actions = installProjectSkills({ packageRoot, skillsDir, dryRun, force });
  return {
    scope: 'project',
    skillsDir,
    actions,
  };
}

export function installCodex({ packageRoot, targetDir, dryRun, force }) {
  const project = installCodexProject({ packageRoot, targetDir, dryRun, force });

  return {
    ide: 'codex',
    project,
    action: 'project .codex/skills/',
  };
}
