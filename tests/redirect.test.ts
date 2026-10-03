import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';

const redirect = readFileSync('public/404.html', 'utf8').match(/<script>([\s\S]*?)<\/script>/)![1];
const restore = readFileSync('index.html', 'utf8').match(/<script>([\s\S]*?)<\/script>/)![1];

test('404 redirect restores clean routes, queries, hashes, and encoding exactly once', () => {
  for (const path of ['/projects/solidity-grammer-fuzzer', '/blog/my-post?tag=a&value=x%26y#heading', '/blog/%E6%96%87%E7%AB%A0?value=%2B%20&empty=#top', '/blog/hello?encoded=%25&literal=~and~#section']) {
    const url = new URL(path, 'https://rohit-padwal.com');
    let destination = '';
    runInNewContext(redirect, { location: { pathname: url.pathname, search: url.search, hash: url.hash, replace: (value: string) => { destination = value; } } });
    assert.ok(destination.startsWith('/index.html?__spa='));
    let restored = '';
    runInNewContext(restore, { URLSearchParams, location: { search: new URL(destination, url.origin).search }, history: { replaceState: (_state: unknown, _title: string, value: string) => { restored = value; } } });
    assert.equal(restored, path);
  }
});

test('restore script ignores normal queries and external redirect targets', () => {
  for (const search of ['?tag=Java', '?__spa=https%3A%2F%2Fexample.com', '?__spa=%2F%2Fevil.example']) {
    let changed = false;
    runInNewContext(restore, { URLSearchParams, location: { search }, history: { replaceState: () => { changed = true; } } });
    assert.equal(changed, false);
  }
});
