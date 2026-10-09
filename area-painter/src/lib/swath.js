import GeometryFactory from 'jsts/org/locationtech/jts/geom/GeometryFactory.js';
import Coordinate from 'jsts/org/locationtech/jts/geom/Coordinate.js';
import BufferOp from 'jsts/org/locationtech/jts/operation/buffer/BufferOp.js';
import BufferParameters from 'jsts/org/locationtech/jts/operation/buffer/BufferParameters.js';

const EARTH_RADIUS_M = 6371008.8;
const DEG = Math.PI / 180;

const factory = new GeometryFactory();

// Flat ends (a tool's swath stops where the tool stops), round joins (the tool
// sweeps a fan when it turns). Few segments per quarter circle keeps it fast.
const bufferParams = new BufferParameters(4, BufferParameters.CAP_FLAT, BufferParameters.JOIN_ROUND, 5);

/**
 * Local flat projection (metres) around an origin. Equirectangular is accurate to
 * well under 0.1% for areas a few km across, which is all a single recording covers.
 */
function makeProjection(origin) {
  const k = Math.cos(origin.lat * DEG);
  return {
    toXY: ([lat, lng]) => [(lng - origin.lng) * DEG * EARTH_RADIUS_M * k, (lat - origin.lat) * DEG * EARTH_RADIUS_M],
    toLatLng: (x, y) => [origin.lat + y / EARTH_RADIUS_M / DEG, origin.lng + x / (EARTH_RADIUS_M * k) / DEG],
  };
}

function ringToLatLngs(ring, proj) {
  return ring.getCoordinates().map((c) => proj.toLatLng(c.x, c.y));
}

/**
 * The area painted by dragging a tool of `widthM` metres along a track.
 *
 * `segments` is an array of continuous runs, each an array of [lat, lng, ...] points.
 * Runs are not joined to each other (a gap in GPS is not painted).
 *
 * Returns { areaM2, polygons } where `polygons` is Leaflet-ready:
 * an array of polygons, each [outerRing, ...holes], each ring [[lat, lng], ...].
 * Overlapping passes are merged, so ground covered twice is counted once.
 */
export function computeSwath(segments, widthM) {
  const empty = { areaM2: 0, polygons: [] };
  const first = segments?.find((seg) => seg.length > 0)?.[0];
  if (!first || !(widthM > 0)) return empty;

  const proj = makeProjection({ lat: first[0], lng: first[1] });
  const lines = [];
  for (const seg of segments) {
    const coords = [];
    for (const p of seg) {
      const [x, y] = proj.toXY(p);
      const last = coords[coords.length - 1];
      if (!last || last.x !== x || last.y !== y) coords.push(new Coordinate(x, y));
    }
    if (coords.length >= 2) lines.push(factory.createLineString(coords));
  }
  if (lines.length === 0) return empty;

  const swath = BufferOp.bufferOp(factory.createMultiLineString(lines), widthM / 2, bufferParams);

  const polygons = [];
  for (let i = 0; i < swath.getNumGeometries(); i++) {
    const poly = swath.getGeometryN(i);
    if (poly.isEmpty()) continue;
    const rings = [ringToLatLngs(poly.getExteriorRing(), proj)];
    for (let h = 0; h < poly.getNumInteriorRing(); h++) {
      rings.push(ringToLatLngs(poly.getInteriorRingN(h), proj));
    }
    polygons.push(rings);
  }
  return { areaM2: swath.getArea(), polygons };
}
