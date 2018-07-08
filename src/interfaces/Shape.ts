import { Vec2 } from "./Vec2";
import { CurveDirection } from "./CurveDirection";

export interface Shape {
  p1: Vec2;
  p2: Vec2;
  p3: Vec2;
  curve?: CurveDirection;
}
