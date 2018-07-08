import { Vec2 } from './Vec2';
import { CurveDirection } from './CurveDirection';
export interface Curve {
    from: Vec2;
    middle: Vec2;
    to: Vec2;
    direction: CurveDirection;
}
