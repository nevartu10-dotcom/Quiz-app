import { test } from 'node:test';
import assert from 'node:assert/strict';
import { addFix, trackLength, pointCount } from './track.js';

const M = 1 / 111195;
const fix = (northM, time, accuracy = 5) => ({ lat: 60 + northM * M, lng: 25, accuracy, time });

function run(fixes) {
  return fixes.reduce((track, f) => addFix(track, f), []);
}

test('normal walking builds one segment', () => {
  const track = run([fix(0, 0), fix(1.5, 1000), fix(3, 2000), fix(4.5, 3000)]);
  assert.equal(track.length, 1);
  assert.equal(pointCount(track), 4);
  assert.ok(Math.abs(trackLength(track) - 4.5) < 0.1);
});

test('inaccurate fixes are ignored', () => {
  const track = run([fix(0, 0), fix(2, 1000, 60), fix(4, 2000)]);
  assert.equal(pointCount(track), 2);
});

test('standing still does not add points', () => {
  const track = run([fix(0, 0), fix(0.3, 1000), fix(0.5, 2000), fix(2, 3000)]);
  assert.equal(pointCount(track), 2);
});

test('impossible jumps are ignored', () => {
  const track = run([fix(0, 0), fix(500, 1000), fix(1.5, 2000)]);
  assert.equal(pointCount(track), 2);
  assert.ok(trackLength(track) < 2);
});

test('a long pause starts a new segment', () => {
  const track = run([fix(0, 0), fix(2, 1000), fix(40, 60000), fix(42, 61000)]);
  assert.equal(track.length, 2);
  assert.ok(Math.abs(trackLength(track) - 4) < 0.1);
});

test('out-of-order fixes are ignored', () => {
  const track = run([fix(0, 5000), fix(2, 4000)]);
  assert.equal(pointCount(track), 1);
});
