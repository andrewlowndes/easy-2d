import { Vec2 } from "../interfaces/Vec2";
import { Scanlines } from "../interfaces/Scanlines";
import { Line } from "../interfaces/Line";
import { sub, divide, floor, abs, sign, multiply, add, adds, inRange, equal, normalize } from "./Maths";

export interface ddaOptions {
  maxSteps: number;
  pos: Vec2;
  cellSize: Vec2;
  min: Vec2;
  max: Vec2;
}

/*
  2D Digital differential analyser
  Useful for traversing a grid for tracing
*/
export function dda(p1: Vec2, p2: Vec2, opts: Partial<ddaOptions>, cb: (cellPos: Vec2) => boolean | void): boolean {
  opts = {
    maxSteps: 500,
    pos: { x: 0, y: 0 },
    cellSize: { x: 1, y: 1 },
    min: { x: 0, y: 0 },
    max: null,
    ...opts
  };
  
  const dir = normalize(sub(p2, p1)),
    relativePos = sub(p1, opts.pos),
    cellPos = floor(divide(relativePos, opts.cellSize)),
    tDelta = abs(divide(opts.cellSize, dir)),
    step = sign(dir),
    distToClosestCell = multiply(opts.cellSize, add(cellPos, sign(adds(step, 1)))),
    tMax = divide(sub(distToClosestCell, relativePos), dir),
    stopCell = floor(divide(sub(p2, opts.pos), opts.cellSize));
  
  for (let i=0; i<opts.maxSteps; i++) {
    if (opts.min && opts.max && !inRange(cellPos, opts.min, opts.max)) {
      return true;
    }
    
    if (cb(cellPos)===false) {
      return false;
    }
    
    if (equal(stopCell, cellPos)) {
      return true;
    }
    
    if (tMax.x < tMax.y) {
      tMax.x += tDelta.x;
      cellPos.x += step.x;
    } else {
      tMax.y += tDelta.y;
      cellPos.y += step.y;
    }
  }
  
  return true;
}

export function rasterizeTriangle(p1: Vec2, p2: Vec2, p3: Vec2, opts: Partial<ddaOptions>, cb: (coord: Vec2) => void): Scanlines {
  const lines: Array<Line> = [{ from: p1, to: p2 }, { from: p2, to: p3 }, { from: p3, to: p1 }],
    scanlines: Scanlines = {}; //hash of y pos and min/max x
  
  lines.forEach((line) => {
    dda(line.from, line.to, opts, (pos) => {
      //store the position in the scanlines
      let scanline = scanlines[pos.y];
      
      if (!scanline) {
        scanline = { min: pos.x, max: pos.x };
      } else {
        scanline.min = Math.min(scanline.min, pos.x);
        scanline.max = Math.max(scanline.max, pos.x);
      }
      
      scanlines[pos.y] = scanline;
    });
  });
  
  //run through the scanlines and fill in the blocks in between
  const coord = { x: 0, y: 0 };
  
  for (let y in scanlines) {
    if (scanlines.hasOwnProperty(y)) {
      coord.y = parseInt(y, 10);
      const scanline = scanlines[y];
      
      for (coord.x=scanline.min; coord.x<=scanline.max; coord.x++) {
        cb(coord);
      }
    }
  }
  
  return scanlines;
}
