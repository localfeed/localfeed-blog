#!/usr/bin/env node
/**
 * Publish script: validate → commit → push
 * Usage: node scripts/publish.mjs
 */
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');

function parseFrontmatter(raw) {
  const match = raw.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return {};
  const fm = {};
  for (const line of match[1].split('\n')) {
    const ci = line.indexOf(':');
    if (ci === -1) continue;
    const key = line.slice(0, ci).trim();
    const val = line.slice(ci + 1).trim().replace(/^["']|["']$/g, '');
    fm[key] = val;
  }
  return fm;
}

const blogDir = path.join(ROOT, 'src/content/blog');
const files = fs.readdirSync(blogDir).filter(f => f.endsWith('.md'));

let publishedCount = 0;
let warnings = 0;

for (const file of files) {
  const raw = fs.readFileSync(path.join(blogDir, file), 'utf8');
  const fm = parseFrontmatter(raw);
  if (fm.status !== 'published') continue;
  publishedCount++;
  const required = ['title', 'description', 'targetKeyword', 'date', 'slug'];
  for (const field of required) {
    if (!fm[field]) {
      console.warn(`  WARNING: ${file} is missing required field: ${field}`);
      warnings++;
    }
  }
  if (fm.description && (fm.description.length < 100 || fm.description.length > 165)) {
    console.warn(`  WARNING: ${file} description length ${fm.description.length} chars (target 140-155)`);
  }
}

const localDir = path.join(ROOT, 'src/content/local');
const localCount = fs.existsSync(localDir) ? fs.readdirSync(localDir).filter(f => f.endsWith('.md')).length : 0;

console.log(`\n📋 Content summary:`);
console.log(`   ${publishedCount} published blog posts`);
console.log(`   ${localCount} local SEO pages`);
if (warnings > 0) {
  console.log(`   ${warnings} warnings — fix before committing if possible`);
}

const today = new Date().toISOString().split('T')[0];
const commitMsg = `content: publish ${today} — ${publishedCount} posts, ${localCount} local pages`;

try {
  execSync('git add .', { cwd: ROOT, stdio: 'inherit' });
  execSync(`git commit -m "${commitMsg}"`, { cwd: ROOT, stdio: 'inherit' });
  execSync('git push origin main', { cwd: ROOT, stdio: 'inherit' });
  console.log(`\n✅ Pushed: "${commitMsg}"`);
  console.log(`   Vercel will deploy to https://blog.localfeed.app in ~60 seconds.`);
} catch (e) {
  console.error('\n❌ Git operation failed:', e.message);
  process.exit(1);
}
