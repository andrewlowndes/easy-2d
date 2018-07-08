import { Glyph, Path } from 'opentype.js';

import { Vec2 } from "../interfaces/Vec2";
import { windingOrder } from "./Geometry";
import { Polygon } from "../interfaces/Polygon";

export function splitCurve(a: Vec2, b: Vec2, c: Vec2, t: number): Array<[Vec2, Vec2, Vec2]> {
  const p1: Vec2 = { x: (b.x-a.x) * t + a.x, y: (b.y-a.y) * t + a.y };
  const p2: Vec2 = { x: (c.x-b.x) * t + b.x, y: (c.y-b.y) * t + b.y };
  
  const midPoint: Vec2 = { x: (p2.x-p1.x) * t + p1.x, y: (p2.y-p1.y) * t + p1.y };
  
  return [[a, p1, midPoint], [midPoint, p2, c]];
}

export function convertGlyphToPolygons(charGlyph: Glyph) {
  //run through the commands and create polygons with vertices for them
  const polygons: Array<Polygon> = [];
  
  let currentPolygon: Polygon,
    lastVertex: Vec2;
  
  //we go anti-clockwise
  (charGlyph.path as Path).commands.forEach((command) => {
    switch (command.type) {
      case 'M':
        if (currentPolygon) {
          polygons.push(currentPolygon);
        }
        
        currentPolygon = {
          vertices: [],
          lines: [],
          curves: []
        };
        
        lastVertex = {
          x: command.x,
          y: command.y
        };
        
        currentPolygon.vertices.push(lastVertex);
        
        break;
      case 'L':
        if (command.x === lastVertex.x && command.y === lastVertex.y) {
          break;
        }
      
        const newVertex = {
          x: command.x,
          y: command.y
        };
        
        currentPolygon.vertices.push(newVertex);
        
        currentPolygon.lines.push({
          from: lastVertex,
          to: newVertex
        });
        
        lastVertex = newVertex;
        
        break;
      case 'Q':
        //TODO: we need to split the curves if they intersect with any lines on our shape (including boundaries with other curves)
        //for now just subdivide every curve for testing purposes
        splitCurve(lastVertex, { x: command.x1, y: command.y1 }, command as Vec2, 0.5).forEach((curve) => {
          lastVertex = curve[0];
          
          //add a curve, determine it's in/out based on angle
          const middleVertex = curve[1];
          const newVertex = curve[2];
          
          const area = ((middleVertex.x-lastVertex.x)*(newVertex.y-lastVertex.y) - 
            (newVertex.x-lastVertex.x)*(middleVertex.y-lastVertex.y));
        
          const direction = windingOrder(lastVertex, middleVertex, newVertex);
          
          currentPolygon.curves.push({
            from: lastVertex,
            middle: middleVertex,
            to: newVertex,
            direction: direction
          });
          
          //join the last point with the previous as a line so we can triangulate the rest of the shape
          currentPolygon.vertices.push(middleVertex);
          
          if (direction > 0) {
            if (newVertex.x !== lastVertex.x || newVertex.y !== lastVertex.y) {
              currentPolygon.vertices.push(newVertex);
              
              currentPolygon.lines.push({
                from: lastVertex,
                to: newVertex
              });
              
              lastVertex = newVertex;
            }
          } else { //for inner curves we need to go the long way round for the polygon
            currentPolygon.vertices.push(newVertex);
              
            currentPolygon.lines = currentPolygon.lines.concat([
              {
                from: lastVertex,
                to: middleVertex
              },
              {
                from: middleVertex,
                to: newVertex
              }
            ]);
            
            lastVertex = newVertex;
          }
        });
        
        break;
      case 'Z':
        //close the path
        const firstVertex = currentPolygon.vertices[0];
        
        if (firstVertex.x !== lastVertex.x || firstVertex.y !== lastVertex.y) {
          currentPolygon.lines.push({
            from: lastVertex,
            to: firstVertex
          });
        }
        
        break;
    }
  });
  
  if (currentPolygon) {
    polygons.push(currentPolygon);
  }
  
  return polygons;
}
