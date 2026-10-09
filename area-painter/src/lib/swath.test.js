import { test } from 'node:test';
import assert from 'node:assert/strict';
import { computeSwath } from './swath.js';

// ~1 m in degrees of latitude.
const M = 1 / 111195;
const origin = { lat: 60, lng: 25 };
const lngM = M / Math.cos((origin.lat * Math.PI) / 180);
const at = (east, north) => [origin.lat + north * M, origin.lng + east * lngM];
const one = (...pts) => [pts];

function near(actual, expected, tolerance) {
  assert.ok(Math.abs(actual - expected) <= tolerance, `expected ${expected} ± ${tolerance}, got ${actual}`);
}

test('straight line: area is length × width', () => {
  const { areaM2, polygons } = computeSwath(one(at(0, 0), at(100, 0)), 2);
  near(areaM2, 200, 0.5);
  assert.equal(polygons.length, 1);
});

test('driving back over the same strip is not counted twice', () => {
  const { areaM2 } = computeSwath(one(at(0, 0), at(100, 0), at(0, 0)), 2);
  near(areaM2, 200, 2);
});

test('two adjacent passes that just touch add up', () => {
  // Out along y=0, U-turn, back along y=2 with a 2 m tool: two 2 m strips side by side.
  const { areaM2 } = computeSwath(one(at(0, 0), at(100, 0), at(100, 2), at(0, 2)), 2);
  near(areaM2, 400, 6);
});

test('overlapping passes count the overlap once', () => {
  // Second pass 1 m to the side of the first with a 2 m tool: 3 m wide in total.
  const { areaM2 } = computeSwath(one(at(0, 0), at(100, 0), at(100, 1), at(0, 1)), 2);
  near(areaM2, 300, 4);
});

test('a small tool width in centimetres', () => {
  const { areaM2 } = computeSwath(one(at(0, 0), at(50, 0)), 0.3);
  near(areaM2, 15, 0.1);
});

test('separate segments are not joined across the gap', () => {
  // Two 10 m strips 50 m apart; joining them would paint the 50 m between too.
  const { areaM2, polygons } = computeSwath([[at(0, 0), at(10, 0)], [at(60, 0), at(70, 0)]], 2);
  near(areaM2, 40, 0.5);
  assert.equal(polygons.length, 2);
});

test('too few points or zero width paint nothing', () => {
  assert.equal(computeSwath(one(at(0, 0)), 2).areaM2, 0);
  assert.equal(computeSwath([], 2).areaM2, 0);
  assert.equal(computeSwath(one(at(0, 0), at(0, 0)), 2).areaM2, 0);
  assert.equal(computeSwath(one(at(0, 0), at(10, 0)), 0).areaM2, 0);
});

test('long noisy track stays fast enough for live updates', () => {
  const pts = [];
  for (let i = 0; i < 3600; i++) {
    const row = Math.floor(i / 200);
    const along = row % 2 ? 200 - (i % 200) : i % 200;
    pts.push(at(along + Math.random() * 2, row * 3 + Math.random() * 2));
  }
  const t0 = performance.now();
  const { areaM2 } = computeSwath([pts], 3);
  const ms = performance.now() - t0;
  assert.ok(areaM2 > 0);
  assert.ok(ms < 1000, `took ${ms.toFixed(0)} ms`);
  console.log(`3600 points: ${ms.toFixed(0)} ms, ${areaM2.toFixed(0)} m²`);
});
