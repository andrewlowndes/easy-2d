export { Curve } from './interfaces/Curve';
export { CurveDirection } from './interfaces/CurveDirection';
export { Line } from './interfaces/Line';
export { Polygon } from './interfaces/Polygon';
export { Ray } from './interfaces/Ray';
export { Scanlines } from './interfaces/Scanlines';
export { Shape } from './interfaces/Shape';
export { Vec2 } from './interfaces/Vec2';

export { rotate, rotateAround, windingOrder, triangulatePolygons } from './functions/Geometry';
export { splitCurve, convertGlyphToPolygons } from './functions/Glyph';
export { dda, rasterizeTriangle, ddaOptions } from './functions/Rasterisation';
export { boxLineIntersection, boxRayIntersection, pointInBox, pointInTriangle, pointInCurve, barycentricCoords } from './functions/Intersection';
export { scale, multiply, divide, add, adds, sub, floor, abs, sign, dot, equal, length, normalize, avg, inRange } from './functions/Maths';
