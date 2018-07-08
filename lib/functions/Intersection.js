"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Maths_1 = require("./Maths");
function boxLineIntersection(a, b, min, max) {
    var tE = 0, tL = 1;
    var dir = Maths_1.sub(b, a), clipT = function (num, denom) {
        if (denom == 0)
            return (num <= 0.0);
        var t = num / denom;
        if (denom > 0) {
            if (t > tL)
                return false;
            if (t > tE)
                tE = t;
        }
        else {
            if (t < tE)
                return false;
            if (t < tL)
                tL = t;
        }
        return true;
    };
    if (clipT(min.x - a.x, dir.x) &&
        clipT(a.x - max.x, -dir.x) &&
        clipT(min.y - a.y, dir.y) &&
        clipT(a.y - max.y, -dir.y)) {
        var line = { from: a, to: b };
        if (tE > 0) {
            line.from = { x: a.x + tE * dir.x, y: a.y + tE * dir.y };
        }
        if (tL < 1) {
            line.to = { x: a.x + tL * dir.x, y: a.y + tL * dir.y };
        }
        return line;
    }
}
exports.boxLineIntersection = boxLineIntersection;
function boxRayIntersection(ray, min, max) {
    var minT = Maths_1.divide(Maths_1.sub(min, ray.pos), ray.dir), maxT = Maths_1.divide(Maths_1.sub(max, ray.pos), ray.dir);
    var tNear = Math.max(Math.min(minT.x, maxT.x), Math.min(minT.y, maxT.y)), tFar = Math.min(Math.max(minT.x, maxT.x), Math.max(minT.y, maxT.y));
    if (tFar < 0 || tNear > tFar) {
        return;
    }
    return Maths_1.add(ray.pos, Maths_1.scale(ray.dir, tNear));
}
exports.boxRayIntersection = boxRayIntersection;
function pointInBox(p, min, max) {
    return p.x >= min.x && p.x <= max.x && p.y >= min.y && p.y <= max.y;
}
exports.pointInBox = pointInBox;
function pointInTriangle(p, p0, p1, p2) {
    var dX = p.x - p2.x, dY = p.y - p2.y, dX21 = p2.x - p1.x, dY12 = p1.y - p2.y, D = dY12 * (p0.x - p2.x) + dX21 * (p0.y - p2.y), s = dY12 * dX + dX21 * dY, t = (p2.y - p0.y) * dX + (p0.x - p2.x) * dY;
    if (D < 0) {
        return s <= 0 && t <= 0 && s + t >= D;
    }
    return s >= 0 && t >= 0 && s + t <= D;
}
exports.pointInTriangle = pointInTriangle;
function pointInCurve(p, p0, p1, p2, dir) {
    var uv = barycentricCoords(p, p0, p1, p2);
    var w = 1.0 - uv.x - uv.y, coord = { x: uv.y * 0.5 + w, y: w }, distFromCurve = coord.x * coord.x - coord.y;
    if ((dir > 0.0 && distFromCurve > 0.0) || (dir < 0.0 && distFromCurve < 0.0)) {
        return false;
    }
    return true;
}
exports.pointInCurve = pointInCurve;
function barycentricCoords(p, p0, p1, p2) {
    var v0 = Maths_1.sub(p2, p0), v1 = Maths_1.sub(p1, p0), dot00 = Maths_1.dot(v0, v0), dot01 = Maths_1.dot(v0, v1), dot11 = Maths_1.dot(v1, v1), invDenom = 1.0 / (dot00 * dot11 - dot01 * dot01);
    var v2 = Maths_1.sub(p, p0), dot02 = Maths_1.dot(v0, v2), dot12 = Maths_1.dot(v1, v2);
    var u = (dot11 * dot02 - dot01 * dot12) * invDenom, v = (dot00 * dot12 - dot01 * dot02) * invDenom;
    return { x: u, y: v };
}
exports.barycentricCoords = barycentricCoords;
