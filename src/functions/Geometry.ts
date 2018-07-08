import { SweepContext, Point } from 'poly2tri';

import { Vec2 } from "../interfaces/Vec2";
import { Polygon } from '../interfaces/Polygon';
import { Shape } from '../interfaces/Shape';
import { add, sub } from "./Maths";

export function rotate(p1: Vec2, x: number): Vec2 {
  const sinX = Math.sin(x),
    cosX = Math.cos(x);
  
  return { x: p1.x * cosX - p1.y * sinX, y: p1.y * cosX + p1.x * sinX };
}

export function rotateAround(p1: Vec2, p2: Vec2, x: number): Vec2 {
  return add(rotate(sub(p1, p2), x), p2);
}

export function windingOrder(a: Vec2, b: Vec2, c: Vec2): 0 | 1 | -1 {
  return -Math.sign((b.x-a.x)*(c.y-a.y) - (c.x-a.x)*(b.y-a.y)) as 0 | 1 | -1;
}

export function triangulatePolygons(polygons: Array<Polygon>) {
  const simplePolygons: Array<SweepContext> = [],
    shapes: Array<Shape> = [];
  
  let currentPolygon: SweepContext;

  //filter the polygons by ones that are holes and ones that are solid
  polygons.forEach((polygon) => {
    //triangulate the polygons and render them
    if (polygon.lines.length) {
      const points = polygon.lines.reduce((acc, line) => {
        return acc.concat(line.from);
      }, []);
      
      //if the polygon is winding in the opposite direction then we add it as a hole
      const direction = windingOrder(points[0], points[1], points[2]);
      
      if (direction > 0 || !currentPolygon) {
        if (currentPolygon) {
          simplePolygons.push(currentPolygon);
        }
        
        currentPolygon = new SweepContext(points.map((point) => {
          return new Point(point.x, point.y);
        }));
      } else {
        currentPolygon.addHole(points.map((point) => {
          return new Point(point.x, point.y);
        }));
      }
    }
  });
            
  if (currentPolygon) {
    simplePolygons.push(currentPolygon);
  }
  
  //then triangulate the polygons once the shapes have been defined
  simplePolygons.forEach((polygon) => {
    polygon.triangulate();
  
    polygon.getTriangles().forEach((triangle) => {
      const p1 = triangle.getPoint(0),
        p2 = triangle.getPoint(1),
        p3 = triangle.getPoint(2);
      
      shapes.push({ p1: p1, p2: p2, p3: p3 });
    });
  });
  
  //render the curves
  polygons.forEach((polygon) => {
    polygon.curves.forEach((curve) => {
      shapes.push({ p1: curve.from, p2: curve.middle, p3: curve.to, curve: curve.direction });
    });
  });
  
  return shapes;
}
