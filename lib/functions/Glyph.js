"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Geometry_1 = require("./Geometry");
function splitCurve(a, b, c, t) {
    var p1 = { x: (b.x - a.x) * t + a.x, y: (b.y - a.y) * t + a.y };
    var p2 = { x: (c.x - b.x) * t + b.x, y: (c.y - b.y) * t + b.y };
    var midPoint = { x: (p2.x - p1.x) * t + p1.x, y: (p2.y - p1.y) * t + p1.y };
    return [[a, p1, midPoint], [midPoint, p2, c]];
}
exports.splitCurve = splitCurve;
function convertGlyphToPolygons(charGlyph) {
    var polygons = [];
    var currentPolygon, lastVertex;
    charGlyph.path.commands.forEach(function (command) {
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
                var newVertex = {
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
                splitCurve(lastVertex, { x: command.x1, y: command.y1 }, command, 0.5).forEach(function (curve) {
                    lastVertex = curve[0];
                    var middleVertex = curve[1];
                    var newVertex = curve[2];
                    var area = ((middleVertex.x - lastVertex.x) * (newVertex.y - lastVertex.y) -
                        (newVertex.x - lastVertex.x) * (middleVertex.y - lastVertex.y));
                    var direction = Geometry_1.windingOrder(lastVertex, middleVertex, newVertex);
                    currentPolygon.curves.push({
                        from: lastVertex,
                        middle: middleVertex,
                        to: newVertex,
                        direction: direction
                    });
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
                    }
                    else {
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
                var firstVertex = currentPolygon.vertices[0];
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
exports.convertGlyphToPolygons = convertGlyphToPolygons;
