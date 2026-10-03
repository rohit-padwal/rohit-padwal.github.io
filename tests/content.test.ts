import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { load } from 'cheerio';
import { parsePost, readPosts } from '../build/content';
import portfolio from '../src/content/portfolio.json';
import type { Project } from '../src/content/types';
import { getProjectLinks } from '../src/content/project-links';

const normalize = (text: string) => text.replace(/\s+/g, ' ').trim();
const original = load(readFileSync('legacy/index.html', 'utf8'));
const built = load(readFileSync('dist/index.html', 'utf8'));

test('every original active section heading and content paragraph survives verbatim', () => {
  for (const id of ['about', 'facts', 'skills', 'education', 'workEx', 'myresume', 'portfolio', 'contact']) {
    assert.ok(built(`#${id}`).length, `Missing section #${id}`);
    const rendered = normalize(built(`#${id}`).text());
    original(`#${id} h2, #${id} h3, #${id} h4, #${id} h5, #${id} p, #${id} li, #${id} label`).each((_, node) => {
      const expected = normalize(original(node).text());
      assert.ok(rendered.includes(expected), `Missing original text in #${id}: ${expected}`);
    });
  }
  assert.equal(portfolio.projects.length, 6);
  assert.equal(portfolio.experience.length, 7);
  assert.equal(portfolio.education.length, 2);
  assert.equal(portfolio.skillGroups.length, 8);
  original('#facts .count-box').each((_, node) => {
    const value = Number(original(node).find('span[data-purecounter-end]').attr('data-purecounter-end'));
    const label = normalize(original(node).find('p').text());
    assert.ok(portfolio.facts.some((fact) => fact.label === label && fact.value === value));
    assert.ok(built('#facts').text().includes(value.toLocaleString('en-US')));
  });
  original('#skills .progress').each((_, node) => {
    const value = Number(original(node).find('[aria-valuenow]').attr('aria-valuenow'));
    const name = normalize(original(node).find('.skill').text()).replace(`${value}%`, '').trim();
    assert.ok(portfolio.skills.some((skill) => skill.name === name && skill.value === value));
    assert.equal(built(`#skills progress[aria-label="${name}: ${value}%"]`).attr('value'), String(value));
  });
  for (const role of portfolio.roles) assert.ok(built('#hero').text().includes(role));
  original('#header .social-links a, #portfolio .title a, #myresume a, #footer a').each((_, node) => {
    const url = original(node).attr('href')!;
    assert.ok(built(`a[href="${url.startsWith('resume/') ? '/' + url : url}"]`).length, `Missing link ${url}`);
  });
});

test('original domain, resume and every image are copied byte for byte', () => {
  assert.deepEqual(readFileSync('dist/CNAME'), readFileSync('CNAME'));
  assert.deepEqual(readFileSync('dist/resume/Rohit_Padwal_Resume.pdf'), readFileSync('resume/Rohit_Padwal_Resume.pdf'));
  const verify = (directory: string) => {
    for (const file of readdirSync(directory, { withFileTypes: true })) {
      const path = `${directory}/${file.name}`;
      if (file.isDirectory()) verify(path);
      else assert.deepEqual(readFileSync(`dist/${path}`), readFileSync(path), path);
    }
  };
  verify('assets/img');
});

test('project CTAs exist only when their URLs exist, including live-only projects', () => {
  const base: Project = { slug: 'test', title: 'Test', description: 'Test' };
  for (const [githubUrl, liveDemoUrl, expected] of [[undefined, undefined, 0], ['https://github.com/test', undefined, 1], [undefined, 'https://example.com', 1], ['https://github.com/test', 'https://example.com', 2]] as const) {
    const links = getProjectLinks({ ...base, githubUrl, liveDemoUrl });
    assert.equal(links.length, expected);
    if (liveDemoUrl) assert.ok(links.some((link) => link.label === 'Live Demo' && link.url === liveDemoUrl));
    if (githubUrl) assert.ok(links.some((link) => link.label === 'GitHub' && link.url === githubUrl));
  }
});

test('Markdown metadata, reading time, drafts, and invalid frontmatter', () => {
  const source = '---\ntitle: Test\ndate: "2026-10-03"\ntags: [Java]\n---\n' + 'word '.repeat(401);
  const post = parsePost(source, 'test-post.md');
  assert.equal(post.readingTime, 3);
  assert.equal(post.slug, 'test-post');
  assert.deepEqual(post.tags, ['Java']);
  assert.equal(readPosts('tests/fixtures/blog').length, 1);
  assert.throws(() => parsePost(source.replace('2026-10-03', '2026-02-30'), 'test.md'), /real YYYY-MM-DD/);
  assert.throws(() => parsePost(source.replace('tags: [Java]', 'tags: Java'), 'test.md'), /array/);
  assert.throws(() => parsePost(source, '../invalid.md'), /filename/);
  assert.throws(() => parsePost(source.replace('title: Test', 'title:'), 'test.md'), /title/);
});

test('production pages include static content and route-specific metadata without JavaScript', () => {
  for (const project of portfolio.projects) {
    const $ = load(readFileSync(`dist/projects/${project.slug}/index.html`, 'utf8'));
    assert.equal($('h1').text(), project.title);
    assert.equal($('meta[name="description"]').attr('content'), project.description);
    assert.equal($('link[rel="canonical"]').attr('href'), `https://rohit-padwal.com/projects/${project.slug}`);
    assert.equal($('#root').attr('data-route'), `/projects/${project.slug}`);
  }
  assert.ok(readFileSync('dist/404.html', 'utf8').length > 512);
  assert.equal(readdirSync('content/blog').filter((file) => file.endsWith('.md')).length, 0);
});
