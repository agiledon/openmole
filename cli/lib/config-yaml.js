import fs from 'fs';

const DEFAULT_CONFIG = {
  current_change: null,
  installed_ides: [],
  init_version: null,
  init_at: null,
};

function parseScalar(raw) {
  const v = raw.trim();
  if (v === 'null' || v === '') return null;
  if (v === '[]') return [];
  if (v.startsWith('[') && v.endsWith(']')) {
    const inner = v.slice(1, -1).trim();
    if (!inner) return [];
    return inner.split(',').map((s) => s.trim().replace(/^['"]|['"]$/g, ''));
  }
  return v.replace(/^['"]|['"]$/g, '');
}

/** Minimal YAML reader for bdr/config.yaml (known keys only). */
export function readConfig(content) {
  const config = { ...DEFAULT_CONFIG };
  let inInstalledIdes = false;

  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    if (trimmed.startsWith('installed_ides:')) {
      const rest = trimmed.slice('installed_ides:'.length).trim();
      if (rest.startsWith('[')) {
        config.installed_ides = parseScalar(rest);
        inInstalledIdes = false;
      } else {
        config.installed_ides = [];
        inInstalledIdes = true;
      }
      continue;
    }

    if (inInstalledIdes) {
      const m = trimmed.match(/^- (.+)$/);
      if (m) {
        config.installed_ides.push(parseScalar(m[1]));
        continue;
      }
      inInstalledIdes = false;
    }

    const kv = trimmed.match(/^(\w+):\s*(.*)$/);
    if (!kv) continue;
    const [, key, raw] = kv;
    if (key in DEFAULT_CONFIG) {
      config[key] = parseScalar(raw);
    }
  }

  return config;
}

export function readConfigFile(filePath) {
  if (!fs.existsSync(filePath)) return null;
  return readConfig(fs.readFileSync(filePath, 'utf8'));
}

export function serializeConfig(config) {
  const lines = [
    '# BDR workspace config (managed by bdr init)',
    `current_change: ${formatScalar(config.current_change)}`,
  ];

  const ides = config.installed_ides || [];
  if (ides.length === 0) {
    lines.push('installed_ides: []');
  } else {
    lines.push('installed_ides:');
    for (const ide of ides) {
      lines.push(`  - ${ide}`);
    }
  }

  lines.push(`init_version: ${formatScalar(config.init_version)}`);
  lines.push(`init_at: ${formatScalar(config.init_at)}`);
  lines.push('');
  return lines.join('\n');
}

function formatScalar(value) {
  if (value === null || value === undefined) return 'null';
  if (typeof value === 'string') return `"${value}"`;
  return String(value);
}

export function writeConfigFile(filePath, config) {
  fs.writeFileSync(filePath, serializeConfig(config), 'utf8');
}

export function mergeInstalledIdes(existing, added) {
  const set = new Set([...(existing || []), ...(added || [])]);
  return [...set];
}

export { DEFAULT_CONFIG };
