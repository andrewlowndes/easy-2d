import { Line } from "../interfaces/Line";
import { Vec2 } from "../interfaces/Vec2";
import { Ray } from "../interfaces/Ray";
import { CurveDirection } from "../interfaces/CurveDirection";
import { sub, divide, add, scale, dot } from "./Maths";

//Liang–Barsky algorithm
export function boxLineIntersection(a: Vec2, b: Vec2, min: Vec2, max: Vec2): Line {
  let tE = 0, 
    tL = 1;
  
  const dir = sub(b, a),
    clipT = (num: number, denom: number): boolean => {
      if (denom==0) return (num <= 0.0);

      const t = num / denom;

      if (denom > 0) {
        if (t > tL) return false;
        if (t > tE) tE = t;
      } else {
        if (t < tE) return false;
        if (t < tL) tL = t;
      }

      return true;
    };
  
  if (clipT(min.x - a.x, dir.x) &&
    clipT(a.x - max.x, -dir.x) &&
    clipT(min.y - a.y, dir.y) &&
    clipT(a.y - max.y, -dir.y)) {
    
    const line = { from: a, to: b };
    
    if (tE > 0) {
      line.from = { x: a.x + tE * dir.x, y: a.y + tE * dir.y };
    }
    
    if (tL < 1) {
      line.to = { x: a.x + tL * dir.x, y: a.y + tL * dir.y };
    }
    
    return line;
  }
}

export function boxRayIntersection(ray: Ray, min: Vec2, max: Vec2): Vec2 {
  const minT = divide(sub(min, ray.pos), ray.dir),
    maxT = divide(sub(max, ray.pos), ray.dir);
  
  const tNear = Math.max(Math.min(minT.x, maxT.x), Math.min(minT.y, maxT.y)),
    tFar = Math.min(Math.max(minT.x, maxT.x), Math.max(minT.y, maxT.y));
  
  if (tFar < 0 || tNear > tFar) {
    return;
  }
  
  return add(ray.pos, scale(ray.dir, tNear));
}

export function pointInBox(p: Vec2, min: Vec2, max: Vec2): boolean {
  return p.x >= min.x && p.x <= max.x && p.y >= min.y && p.y <= max.y;
}

export function pointInTriangle(p: Vec2, p0: Vec2, p1: Vec2, p2: Vec2): boolean {
  const dX = p.x-p2.x,
    dY = p.y-p2.y,
    dX21 = p2.x-p1.x,
    dY12 = p1.y-p2.y,
    D = dY12*(p0.x-p2.x) + dX21*(p0.y-p2.y),
    s = dY12*dX + dX21*dY,
    t = (p2.y-p0.y)*dX + (p0.x-p2.x)*dY;
  
  if (D<0) {
    return s<=0 && t<=0 && s+t>=D;
  }
  
  return s>=0 && t>=0 && s+t<=D;
}

export function pointInCurve(p: Vec2, p0: Vec2, p1: Vec2, p2: Vec2, dir: CurveDirection): boolean {
  const uv = barycentricCoords(p, p0, p1, p2);
  
  //use the blinn and loop method
  const w = 1.0 - uv.x - uv.y,
    coord = { x: uv.y * 0.5 + w, y: w },
    distFromCurve = coord.x * coord.x - coord.y;
  
  if ((dir > 0.0 && distFromCurve > 0.0) || (dir < 0.0 && distFromCurve < 0.0)) {
    return false;   
  }
  
  return true;
}

export function barycentricCoords(p: Vec2, p0: Vec2, p1: Vec2, p2: Vec2): Vec2 {
  //TODO: compute only when p0, p1, p2 changes
  const v0 = sub(p2, p0),
    v1 = sub(p1, p0),
    dot00 = dot(v0, v0),
    dot01 = dot(v0, v1),
    dot11 = dot(v1, v1),
    invDenom = 1.0 / (dot00 * dot11 - dot01 * dot01);
  
  //compute only when p changes
  const v2 = sub(p, p0),
    dot02 = dot(v0, v2),
    dot12 = dot(v1, v2);

  const u = (dot11 * dot02 - dot01 * dot12) * invDenom,
    v = (dot00 * dot12 - dot01 * dot02) * invDenom;
  
  return { x: u, y: v };
}
