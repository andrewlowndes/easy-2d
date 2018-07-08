import { Vec2 } from "../interfaces/Vec2";
import { Scanlines } from "../interfaces/Scanlines";
export interface ddaOptions {
    maxSteps: number;
    pos: Vec2;
    cellSize: Vec2;
    min: Vec2;
    max: Vec2;
}
export declare function dda(p1: Vec2, p2: Vec2, opts: Partial<ddaOptions>, cb: (cellPos: Vec2) => boolean | void): boolean;
export declare function rasterizeTriangle(p1: Vec2, p2: Vec2, p3: Vec2, opts: Partial<ddaOptions>, cb: (coord: Vec2) => void): Scanlines;
