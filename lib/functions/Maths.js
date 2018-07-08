"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function scale(p1, a) {
    return { x: a * p1.x, y: a * p1.y };
}
exports.scale = scale;
function multiply(p1, p2) {
    return { x: p2.x * p1.x, y: p2.y * p1.y };
}
exports.multiply = multiply;
function divide(p1, p2) {
    return { x: p1.x / p2.x, y: p1.y / p2.y };
}
exports.divide = divide;
function add(p1, p2) {
    return { x: p1.x + p2.x, y: p1.y + p2.y };
}
exports.add = add;
function adds(p1, a) {
    return { x: p1.x + a, y: p1.y + a };
}
exports.adds = adds;
function sub(p1, p2) {
    return { x: p1.x - p2.x, y: p1.y - p2.y };
}
exports.sub = sub;
function floor(p1) {
    return { x: Math.floor(p1.x), y: Math.floor(p1.y) };
}
exports.floor = floor;
function abs(p1) {
    return { x: Math.abs(p1.x), y: Math.abs(p1.y) };
}
exports.abs = abs;
function sign(p1) {
    return { x: Math.sign(p1.x), y: Math.sign(p1.y) };
}
exports.sign = sign;
function dot(p1, p2) {
    return p1.x * p2.x + p1.y * p2.y;
}
exports.dot = dot;
function equal(p1, p2) {
    return p1.x == p2.x && p1.y == p2.y;
}
exports.equal = equal;
function length(p1) {
    return Math.sqrt(p1.x * p1.x + p1.y * p1.y);
}
exports.length = length;
function normalize(p1) {
    return scale(p1, 1 / length(p1));
}
exports.normalize = normalize;
function avg(arr) {
    var sum = arr.reduce(function (acc, item) {
        acc.x += item.x;
        acc.y += item.y;
        return acc;
    }, { x: 0, y: 0 });
    sum.x /= arr.length;
    sum.y /= arr.length;
    return sum;
}
exports.avg = avg;
function inRange(p1, min, max) {
    return !(p1.x > max.x || p1.x < min.x || p1.y > max.y || p1.y < min.y);
}
exports.inRange = inRange;
