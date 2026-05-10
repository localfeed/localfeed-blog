#!/usr/bin/env node
/**
 * Usage: node scripts/generate-post.mjs "keyword or topic"
 * Creates a draft .md file ready for content generation.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');

const keyword = process.argv.slice(2).join(' ');
if (!keyword) {
  console.error('Usage: node scripts/generate-post.mjs "keyword or topic"');
  process.exit(1);
}

function slugify(str) {
  return str.toLowerCase().replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-').replace(/-+/g, '-');
}

const slug = slugify(keyword);
const today = new Date().toISOString().split('T')[0];
const blogDir = path.join(ROOT, 'src/content/blog');
const outFile = path.join(blogDir, `${slug}.md`);

if (fs.existsSync(outFile)) {
  console.error(`File already exists: ${outFile}`);
  process.exit(1);
}

const template = `---
title: "${keyword.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}"
slug: "${slug}"
description: ""
date: "${today}"
author: "Benoit Boussuge"
category: "venue-marketing"
tags: []
status: "draft"
readTime: ""
targetKeyword: "${keyword}"
---

<!-- DRAFT: Replace this with the generated article content -->
<!-- Category options: venue-marketing, platform-comparison, operator-insights, off-peak, local-seo -->
<!-- 1. Write or generate 1000-1400 words below -->
<!-- 2. Fill in description (140-155 chars), tags, readTime -->
<!-- 3. Change status to "published" when ready -->
<!-- 4. Run: node scripts/publish.mjs -->

## Introduction

[Write opening paragraph here — start with the problem or reality, not "In this article..."]

## [H2 Section 1]

[Body content]

## [H2 Section 2]

[Body content]

## [H2 Section 3]

[Body content]

## The bottom line

[Closing paragraph + CTA to LocalFeed]

---

[LocalFeed](https://localfeed.app/list-venue) — commission-free. No forced discounts. Built for NZ venues.
`;

fs.mkdirSync(blogDir, { recursive: true });
fs.writeFileSync(outFile, template, 'utf8');

console.log(`\nDraft created: src/content/blog/${slug}.md`);
console.log(`\nNext steps:`);
console.log(`  1. Open src/content/blog/${slug}.md`);
console.log(`  2. Generate content (use run-claude-blog.md prompt with keyword: "${keyword}")`);
console.log(`  3. Fill in description, tags, readTime in frontmatter`);
console.log(`  4. Change status: "draft" → "published"`);
console.log(`  5. Run: node scripts/publish.mjs`);
