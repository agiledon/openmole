import fs from 'fs';
import path from 'path';

export const GITIGNORE_MARKER_START = '# >>> openmole (managed by openmole init/update — do not edit) >>>';
export const GITIGNORE_MARKER_END = '# <<< openmole <<<';

export function loadGitignoreSnippet(packageRoot) {
  const snippetPath = path.join(packageRoot, 'templates', 'openmole-gitignore.snippet');
  if (!fs.existsSync(snippetPath)) {
    throw new Error(`Missing gitignore template: ${snippetPath}`);
  }
  return fs.readFileSync(snippetPath, 'utf8').trimEnd();
}

export function buildGitignoreBlock(snippet) {
  return `${GITIGNORE_MARKER_START}\n${snippet}\n${GITIGNORE_MARKER_END}\n`;
}

function replaceManagedBlock(content, block) {
  const start = content.indexOf(GITIGNORE_MARKER_START);
  const end = content.indexOf(GITIGNORE_MARKER_END);
  if (start === -1 || end === -1) return null;
  const after = content.slice(end + GITIGNORE_MARKER_END.length).replace(/^\n?/, '');
  const before = content.slice(0, start);
  return `${before}${block}${after}`;
}

/** Merge OpenMole gitignore snippet into target project .gitignore (idempotent). */
export function mergeGitignoreSnippet({ packageRoot, targetDir, dryRun }) {
  const gitignorePath = path.join(targetDir, '.gitignore');
  const snippet = loadGitignoreSnippet(packageRoot);
  const block = buildGitignoreBlock(snippet);
  const action = `merge OpenMole snippet into ${gitignorePath}`;

  const existing = fs.existsSync(gitignorePath) ? fs.readFileSync(gitignorePath, 'utf8') : '';
  const replaced = replaceManagedBlock(existing, block);
  const next = replaced ?? (existing ? `${existing.replace(/\n?$/, '')}\n\n${block}` : block);

  if (next === existing) {
    return { action, gitignorePath, changed: false };
  }

  if (!dryRun) {
    fs.writeFileSync(gitignorePath, next, 'utf8');
  }

  return { action, gitignorePath, changed: true };
}
