import { Vec2 } from "../interfaces/Vec2";
import { Polygon } from '../interfaces/Polygon';
import { Shape } from '../interfaces/Shape';
export declare function rotate(p1: Vec2, x: number): Vec2;
export declare function rotateAround(p1: Vec2, p2: Vec2, x: number): Vec2;
export declare function windingOrder(a: Vec2, b: Vec2, c: Vec2): 0 | 1 | -1;
export declare function triangulatePolygons(polygons: Array<Polygon>): Shape[];
