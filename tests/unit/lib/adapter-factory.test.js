// Tests for createSkillCommandAdapter factory (BS-DUPLICATION-001)
import { describe, it } from 'node:test';
import assert from 'node:assert';
import { createSkillCommandAdapter } from '../../../cli/lib/project-skills.js';

const BASE_OPTS = {
  packageRoot: '/tmp/openmole-test',
  targetDir: '/tmp/openmole-target',
  dryRun: true,
  force: false,
};

describe('createSkillCommandAdapter — basic (kiro/qoder pattern)', () => {
  const installKiro = createSkillCommandAdapter({ ide: 'kiro', ideDir: '.kiro' });

  it('returns a function', () => {
    assert.equal(typeof installKiro, 'function');
  });

  it('returns expected result shape for dryRun', () => {
    const result = installKiro(BASE_OPTS);
    assert.equal(result.ide, 'kiro');
    assert.equal(result.scope, 'project');
    assert.ok(Array.isArray(result.actions));
    assert.ok(result.actions.length > 0, 'should have skill + command copy actions');
    assert.ok(result.action.includes('.kiro/'));
    assert.ok(result.action.includes('skills, commands'));
  });
});

describe('createSkillCommandAdapter — with symlink extra (gemini pattern)', () => {
  const installGemini = createSkillCommandAdapter({
    ide: 'gemini',
    ideDir: '.gemini',
    extras: {
      symlink: { source: '/tmp/openmole-test', dest: ['extensions', 'openmole'] },
      actionSuffix: ', extension symlink',
    },
  });

  it('returns a function', () => {
    assert.equal(typeof installGemini, 'function');
  });

  it('result action includes extension symlink suffix', () => {
    const result = installGemini(BASE_OPTS);
    assert.ok(result.action.includes('.gemini/'));
    assert.ok(result.action.includes('extension symlink'));
    assert.equal(result.ide, 'gemini');
  });

  it('returns extensionLink field for symlink extras', () => {
    const result = installGemini(BASE_OPTS);
    assert.ok(result.extensionLink, 'should have extensionLink field');
  });
});

describe('createSkillCommandAdapter — produces distinct adapters', () => {
  const installKiro = createSkillCommandAdapter({ ide: 'kiro', ideDir: '.kiro' });
  const installQoder = createSkillCommandAdapter({ ide: 'qoder', ideDir: '.qoder' });

  it('different IDEs produce different results', () => {
    const kiroResult = installKiro(BASE_OPTS);
    const qoderResult = installQoder(BASE_OPTS);
    assert.equal(kiroResult.ide, 'kiro');
    assert.equal(qoderResult.ide, 'qoder');
    assert.ok(kiroResult.action.includes('.kiro/'));
    assert.ok(qoderResult.action.includes('.qoder/'));
  });

  it('both produce same structure', () => {
    const kiroResult = installKiro(BASE_OPTS);
    const qoderResult = installQoder(BASE_OPTS);
    assert.deepStrictEqual(Object.keys(kiroResult).sort(), Object.keys(qoderResult).sort());
    assert.equal(kiroResult.scope, qoderResult.scope);
  });
});
