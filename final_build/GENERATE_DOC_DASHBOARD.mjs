#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = '/Users/abelsanchez/CODEX/NEWGAME/final_build';
const manifestPath = path.join(root, 'FINAL_BUILD_MANIFEST.json');
const outMd = path.join(root, 'DOC_DASHBOARD.md');

function readJSON(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function readText(file) {
  return fs.readFileSync(file, 'utf8');
}

function write(file, data) {
  fs.writeFileSync(file, data, 'utf8');
}

try {
  const manifest = readJSON(manifestPath);
  const lines = [];
  lines.push('# Documentation Dashboard — NEWGAME');
  lines.push('');
  lines.push(`Updated: ${new Date().toISOString()}`);
  lines.push('');
  lines.push('## File inventory');
  manifest.artifacts.forEach((entry, idx) => {
    const exists = fs.existsSync(entry.path) ? 'PASS' : 'MISSING';
    lines.push(`${idx + 1}. ${entry.path} — ${exists} (${entry.category})`);
  });
  const missingCount = manifest.artifacts.filter((entry) => !fs.existsSync(entry.path)).length;
  const gapsPath = path.join(root, 'CURRENT_GAPS.txt');
  const gaps = fs.existsSync(gapsPath) ? readText(gapsPath).trim().split('\n').filter(Boolean).length : 0;
  lines.push('');
  lines.push('## Health');
  lines.push(`- Total artifacts: ${manifest.artifacts.length}`);
  lines.push(`- Missing artifacts: ${missingCount}`);
  lines.push(`- CURRENT_GAPS lines: ${gaps}`);
  write(outMd, `${lines.join('\n')}\n`);
  console.log(`Generated ${outMd}`);
} catch (err) {
  console.error(err.message);
  process.exit(1);
}
