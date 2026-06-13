// Tests for adapter registry — dispatch from IDE name to adapter functions
// Using Node.js built-in test runner (node --test)
import { describe, it } from 'node:test';
import assert from 'node:assert';
import { ADAPTERS, resolveAdapter, isAdapterInstalled } from '../../../cli/lib/adapter-registry.js';
import { installCursor } from '../../../cli/adapters/cursor.js';
import { installOpenCode } from '../../../cli/adapters/opencode.js';
import { installClaudeCode } from '../../../cli/adapters/claude-code.js';
import { installCodex } from '../../../cli/adapters/codex.js';
import { installGeminiCli } from '../../../cli/adapters/gemini-cli.js';
import { installKiro } from '../../../cli/adapters/kiro.js';
import { installQoder } from '../../../cli/adapters/qoder.js';

const KNOWN_IDES = ['cursor', 'opencode', 'claude', 'codex', 'gemini', 'kiro', 'qoder'];

describe('adapter-registry dispatch', () => {
  it('all 7 IDEs are registered in ADAPTERS', () => {
    for (const ide of KNOWN_IDES) {
      const entry = ADAPTERS[ide];
      assert.ok(entry, `missing registry entry for ${ide}`);
      assert.equal(typeof entry.install, 'function', `${ide} install is not a function`);
    }
  });

  it('ADAPTERS has exactly 7 entries', () => {
    assert.equal(Object.keys(ADAPTERS).length, 7);
  });

  it('resolveAdapter returns correct entry for each known IDE', () => {
    for (const ide of KNOWN_IDES) {
      const adapter = resolveAdapter(ide);
      assert.ok(adapter);
      assert.equal(typeof adapter.install, 'function');
    }
  });

  it('resolveAdapter throws for unknown IDE', () => {
    assert.throws(
      () => resolveAdapter('nonexistent-ide'),
      /Unknown IDE/,
    );
    assert.throws(
      () => resolveAdapter(''),
      /Unknown IDE/,
    );
  });

  it('resolveAdapter install references are correct functions', () => {
    assert.equal(resolveAdapter('cursor').install, installCursor);
    assert.equal(resolveAdapter('opencode').install, installOpenCode);
    assert.equal(resolveAdapter('claude').install, installClaudeCode);
    assert.equal(resolveAdapter('codex').install, installCodex);
    assert.equal(resolveAdapter('gemini').install, installGeminiCli);
    assert.equal(resolveAdapter('kiro').install, installKiro);
    assert.equal(resolveAdapter('qoder').install, installQoder);
  });

  it('installIdes: all IDEs dispatch without error (dryRun)', () => {
    const opts = { packageRoot: '/tmp', targetDir: '/tmp/dry', dryRun: true, force: false, global: false };
    const results = [];
    for (const ide of KNOWN_IDES) {
      results.push(resolveAdapter(ide).install(opts));
    }
    assert.equal(results.length, 7);
    for (const r of results) {
      assert.ok(r, 'each install should return a result value');
    }
  });
});

describe('isAdapterInstalled', () => {
  it('returns true for adapter without checkPath', () => {
    assert.equal(isAdapterInstalled('/tmp', {}), true);
    assert.equal(isAdapterInstalled('/tmp', { checkPath: undefined }), true);
    assert.equal(isAdapterInstalled('/tmp', ADAPTERS.opencode), true);
    assert.equal(isAdapterInstalled('/tmp', ADAPTERS.claude), true);
  });

  it('returns true when checkPath file exists', () => {
    // Check against the actual BDR project — its own cursor skill should exist
    // since BDR is installed in its own workspace
    const projectRoot = new URL('../../../', import.meta.url).pathname;
    assert.equal(isAdapterInstalled(projectRoot, ADAPTERS.cursor), true);
  });

  it('returns false when checkPath file does not exist', () => {
    assert.equal(isAdapterInstalled('/tmp/nonexistent-dir-xyz', ADAPTERS.cursor), false);
  });
});

describe('checkPath coverage', () => {
  it('checkPath is defined for adapters with filesystem markers', () => {
    // These have filesystem markers
    ['cursor', 'codex', 'gemini', 'kiro', 'qoder'].forEach((ide) => {
      assert.ok(Array.isArray(ADAPTERS[ide].checkPath), `${ide} should have checkPath`);
    });
  });

  it('checkPath is undefined for adapters without filesystem markers', () => {
    assert.equal(ADAPTERS.opencode.checkPath, undefined);
    assert.equal(ADAPTERS.claude.checkPath, undefined);
  });
});
