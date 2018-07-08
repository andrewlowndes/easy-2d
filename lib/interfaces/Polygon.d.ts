import { Vec2 } from './Vec2';
import { Line } from './Line';
import { Curve } from './Curve';
export interface Polygon {
    vertices: Array<Vec2>;
    lines: Array<Line>;
    curves: Array<Curve>;
}
