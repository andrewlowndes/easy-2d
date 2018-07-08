# Easy 2D
Various helper functions to perform mathematical and geometry operations in two dimensions

## Included functions

### Geometry functions
rotate, rotateAround, windingOrder, triangulatePolygons

---
### Glyph-related functions
splitCurve, convertGlyphToPolygons

---
### Rasterisation functions
dda, rasterizeTriangle, ddaOptions

---
### 2D intersection functions
boxLineIntersection, boxRayIntersection, pointInBox, pointInTriangle, pointInCurve, barycentricCoords

---
### 2D vector math functions
scale, multiply, divide, add, adds, sub, floor, abs, sign, dot, equal, length, normalize, avg, inRange

---

## Using in node
Install via `npm install apl-easy-2d`, then import via ES6 Modules:
```typescript
import { windingOrder } from 'apl-easy-2d';
```

## Using in the browser
Add the script tag below or download it an bundle it with your own scripts.
```html
<script src="http://unpkg.com/apl-easy-2d/lib/apl-easy-2d.min.js"></script>
```

If you need to use a function that requires the 3rd-party library and have not included them separetely then include the umd which comes bundled with all dependencies.

```html
<script src="http://unpkg.com/apl-easy-2d/lib/apl-easy-2d.umd.js"></script>
```

## TODO
- Add unit tests to all functions

## Licence
All code is licenced under MIT.
