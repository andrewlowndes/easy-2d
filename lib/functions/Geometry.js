"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var poly2tri_1 = require("poly2tri");
var Maths_1 = require("./Maths");
function rotate(p1, x) {
    var sinX = Math.sin(x), cosX = Math.cos(x);
    return { x: p1.x * cosX - p1.y * sinX, y: p1.y * cosX + p1.x * sinX };
}
exports.rotate = rotate;
function rotateAround(p1, p2, x) {
    return Maths_1.add(rotate(Maths_1.sub(p1, p2), x), p2);
}
exports.rotateAround = rotateAround;
function windingOrder(a, b, c) {
    return -Math.sign((b.x - a.x) * (c.y - a.y) - (c.x - a.x) * (b.y - a.y));
}
exports.windingOrder = windingOrder;
function triangulatePolygons(polygons) {
    var simplePolygons = [], shapes = [];
    var currentPolygon;
    polygons.forEach(function (polygon) {
        if (polygon.lines.length) {
            var points = polygon.lines.reduce(function (acc, line) {
                return acc.concat(line.from);
            }, []);
            var direction = windingOrder(points[0], points[1], points[2]);
            if (direction > 0 || !currentPolygon) {
                if (currentPolygon) {
                    simplePolygons.push(currentPolygon);
                }
                currentPolygon = new poly2tri_1.SweepContext(points.map(function (point) {
                    return new poly2tri_1.Point(point.x, point.y);
                }));
            }
            else {
                currentPolygon.addHole(points.map(function (point) {
                    return new poly2tri_1.Point(point.x, point.y);
                }));
            }
        }
    });
    if (currentPolygon) {
        simplePolygons.push(currentPolygon);
    }
    simplePolygons.forEach(function (polygon) {
        polygon.triangulate();
        polygon.getTriangles().forEach(function (triangle) {
            var p1 = triangle.getPoint(0), p2 = triangle.getPoint(1), p3 = triangle.getPoint(2);
            shapes.push({ p1: p1, p2: p2, p3: p3 });
        });
    });
    polygons.forEach(function (polygon) {
        polygon.curves.forEach(function (curve) {
            shapes.push({ p1: curve.from, p2: curve.middle, p3: curve.to, curve: curve.direction });
        });
    });
    return shapes;
}
exports.triangulatePolygons = triangulatePolygons;
