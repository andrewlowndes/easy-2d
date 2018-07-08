import { Glyph } from 'opentype.js';
import { Vec2 } from "../interfaces/Vec2";
import { Polygon } from "../interfaces/Polygon";
export declare function splitCurve(a: Vec2, b: Vec2, c: Vec2, t: number): Array<[Vec2, Vec2, Vec2]>;
export declare function convertGlyphToPolygons(charGlyph: Glyph): Polygon[];
