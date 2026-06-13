// Tests for error handling consistency (BS-ERROR-001)
// Using Node.js built-in test runner (node --test)
import { describe, it } from 'node:test';
import assert from 'node:assert';
import { needsReinstall, installIde, installIdes } from '../../../cli/lib/ide-install.js';
import { resolveAdapter, isAdapterInstalled } from '../../../cli/lib/adapter-registry.js';

const KNOWN_IDES = ['cursor', 'opencode', 'claude', 'codex', 'gemini', 'kiro', 'qoder'];
const BASE_OPTS = {
  packageRoot: '/tmp/openmole-test',
  targetDir: '/tmp/openmole-test-target',
  dryRun: true,
  force: false,
  global: false,
};

describe('resolveAdapter error handling', () => {
  it('throws for unknown IDE with err.message containing IDE name', () => {
    assert.throws(
      () => resolveAdapter('nonexistent-ide'),
      { message: /Unknown IDE.*nonexistent-ide/ },
    );
  });

  it('throws for empty string', () => {
    assert.throws(
      () => resolveAdapter(''),
      { message: /Unknown IDE/ },
    );
  });

  it('does not throw for any known IDE', () => {
    for (const ide of KNOWN_IDES) {
      assert.doesNotThrow(() => resolveAdapter(ide));
    }
  });
});

describe('needsReinstall error handling', () => {
  it('throws for unknown IDE (fail-fast replaces silent return false)', () => {
    assert.throws(
      () => needsReinstall('/tmp', 'nonexistent-ide', false),
      { message: /Unknown IDE/ },
    );
  });

  it('does not throw for known IDEs', () => {
    for (const ide of KNOWN_IDES) {
      assert.doesNotThrow(() => needsReinstall('/tmp', ide, false));
    }
  });

  it('returns true when force=true (no throw)', () => {
    // Force flag bypasses all checks, including adapter resolution in current impl
    assert.equal(needsReinstall('/tmp', 'cursor', true), true);
  });
});

describe('installIde error handling', () => {
  it('throws for unknown IDE (replaces old console.warn + skip)', () => {
    assert.throws(
      () => installIde('nonexistent-ide', BASE_OPTS),
      { message: /Unknown IDE/ },
    );
  });

  it('does not throw for known IDEs (dryRun mode)', () => {
    for (const ide of KNOWN_IDES) {
      assert.doesNotThrow(() => installIde(ide, BASE_OPTS));
    }
  });

  it('throws for unknown IDE even in dryRun mode (behavioral consistency)', () => {
    const dryOpts = { ...BASE_OPTS, dryRun: true };
    const nonDryOpts = { ...BASE_OPTS, dryRun: false };
    assert.throws(() => installIde('bad-ide', dryOpts), { message: /Unknown IDE/ });
    assert.throws(() => installIde('bad-ide', nonDryOpts), { message: /Unknown IDE/ });
  });
});

describe('installIdes error handling', () => {
  it('returns empty array for empty IDE list (no throw)', () => {
    const results = installIdes([], BASE_OPTS);
    assert.deepStrictEqual(results, []);
  });

  it('throws at first unknown IDE (fail-fast, does not continue silently)', () => {
    assert.throws(
      () => installIdes(['cursor', 'unknown-ide', 'kiro'], BASE_OPTS),
      { message: /Unknown IDE/ },
    );
  });

  it('processes all known IDEs without error (dryRun)', () => {
    const results = installIdes(KNOWN_IDES, BASE_OPTS);
    assert.equal(results.length, 7);
    for (const r of results) {
      assert.ok(r, 'each install result should be defined');
    }
  });
});

describe('adapter-specific error throwing (top-level)', () => {
  // These tests verify adapters throw on missing required arguments
  // rather than silently failing

  it('openCode adapter throws without targetDir (non-global)', () => {
    assert.throws(
      () => installIde('opencode', {
        packageRoot: '/tmp',
        targetDir: null,
        global: false,
        dryRun: true,
      }),
      { message: 'targetDir required for project-level OpenCode config' },
    );
  });

  it('openCode adapter does not throw with targetDir', () => {
    assert.doesNotThrow(() =>
      installIde('opencode', {
        packageRoot: '/tmp',
        targetDir: '/tmp/target',
        global: false,
        dryRun: true,
      }),
    );
  });

  it('openCode adapter does not throw with global=true and no targetDir', () => {
    assert.doesNotThrow(() =>
      installIde('opencode', {
        packageRoot: '/tmp',
        targetDir: null,
        global: true,
        dryRun: true,
      }),
    );
  });
});

describe('dry-run error consistency', () => {
  it('dryRun=true and dryRun=false both throw for invalid args', () => {
    const dryOpts = {
      packageRoot: '/tmp',
      targetDir: null,
      global: false,
      dryRun: true,
    };
    const nonDryOpts = {
      packageRoot: '/tmp',
      targetDir: null,
      global: false,
      dryRun: false,
    };
    assert.throws(() => installIde('opencode', dryOpts), { message: 'targetDir required for project-level OpenCode config' });
    assert.throws(() => installIde('opencode', nonDryOpts), { message: 'targetDir required for project-level OpenCode config' });
  });
});
