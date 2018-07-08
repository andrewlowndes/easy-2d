"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var Maths_1 = require("./Maths");
function dda(p1, p2, opts, cb) {
    opts = __assign({ maxSteps: 500, pos: { x: 0, y: 0 }, cellSize: { x: 1, y: 1 }, min: { x: 0, y: 0 }, max: null }, opts);
    var dir = Maths_1.normalize(Maths_1.sub(p2, p1)), relativePos = Maths_1.sub(p1, opts.pos), cellPos = Maths_1.floor(Maths_1.divide(relativePos, opts.cellSize)), tDelta = Maths_1.abs(Maths_1.divide(opts.cellSize, dir)), step = Maths_1.sign(dir), distToClosestCell = Maths_1.multiply(opts.cellSize, Maths_1.add(cellPos, Maths_1.sign(Maths_1.adds(step, 1)))), tMax = Maths_1.divide(Maths_1.sub(distToClosestCell, relativePos), dir), stopCell = Maths_1.floor(Maths_1.divide(Maths_1.sub(p2, opts.pos), opts.cellSize));
    for (var i = 0; i < opts.maxSteps; i++) {
        if (opts.min && opts.max && !Maths_1.inRange(cellPos, opts.min, opts.max)) {
            return true;
        }
        if (cb(cellPos) === false) {
            return false;
        }
        if (Maths_1.equal(stopCell, cellPos)) {
            return true;
        }
        if (tMax.x < tMax.y) {
            tMax.x += tDelta.x;
            cellPos.x += step.x;
        }
        else {
            tMax.y += tDelta.y;
            cellPos.y += step.y;
        }
    }
    return true;
}
exports.dda = dda;
function rasterizeTriangle(p1, p2, p3, opts, cb) {
    var lines = [{ from: p1, to: p2 }, { from: p2, to: p3 }, { from: p3, to: p1 }], scanlines = {};
    lines.forEach(function (line) {
        dda(line.from, line.to, opts, function (pos) {
            var scanline = scanlines[pos.y];
            if (!scanline) {
                scanline = { min: pos.x, max: pos.x };
            }
            else {
                scanline.min = Math.min(scanline.min, pos.x);
                scanline.max = Math.max(scanline.max, pos.x);
            }
            scanlines[pos.y] = scanline;
        });
    });
    var coord = { x: 0, y: 0 };
    for (var y in scanlines) {
        if (scanlines.hasOwnProperty(y)) {
            coord.y = parseInt(y, 10);
            var scanline = scanlines[y];
            for (coord.x = scanline.min; coord.x <= scanline.max; coord.x++) {
                cb(coord);
            }
        }
    }
    return scanlines;
}
exports.rasterizeTriangle = rasterizeTriangle;
