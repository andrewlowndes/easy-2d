import { Vec2 } from '../interfaces/Vec2';

export function scale(p1: Vec2, a: number): Vec2 {
  return { x: a * p1.x, y: a * p1.y };
}

export function multiply(p1: Vec2, p2: Vec2): Vec2 {
  return { x: p2.x * p1.x, y: p2.y * p1.y };
}

export function divide(p1: Vec2, p2: Vec2): Vec2 {
  return { x: p1.x / p2.x, y: p1.y / p2.y };
}

export function add(p1: Vec2, p2: Vec2): Vec2 {
  return { x: p1.x + p2.x, y: p1.y + p2.y };
}

export function adds(p1: Vec2, a: number): Vec2 {
  return { x: p1.x + a, y: p1.y + a };
}

export function sub(p1: Vec2, p2: Vec2): Vec2 {
  return { x: p1.x - p2.x, y: p1.y - p2.y };
}

export function floor(p1: Vec2): Vec2 {
  return { x: Math.floor(p1.x), y: Math.floor(p1.y) };
}

export function abs(p1: Vec2): Vec2 {
  return { x: Math.abs(p1.x), y: Math.abs(p1.y) };
}

export function sign(p1: Vec2): Vec2 {
  return { x: Math.sign(p1.x), y: Math.sign(p1.y) };
}

export function dot(p1: Vec2, p2: Vec2): number {
  return p1.x*p2.x + p1.y*p2.y;
}

export function equal(p1: Vec2, p2: Vec2): boolean {
  return p1.x == p2.x && p1.y == p2.y;
}

export function length(p1: Vec2): number {
  return Math.sqrt(p1.x*p1.x + p1.y*p1.y);
}

export function normalize(p1: Vec2): Vec2 {
  return scale(p1, 1/length(p1));
}

export function avg(arr: Array<Vec2>): Vec2 {
  const sum = arr.reduce((acc, item) => {
    acc.x += item.x;
    acc.y += item.y;

    return acc;
  }, { x: 0, y: 0 });
  
  sum.x /= arr.length;
  sum.y /= arr.length;
  
  return sum;
}

/*
* The max value is not inclusive
*/
export function inRange(p1: Vec2, min: Vec2, max: Vec2): boolean {
  return !(p1.x > max.x || p1.x < min.x || p1.y > max.y || p1.y < min.y);
}