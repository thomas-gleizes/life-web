import { Coordinate } from "../types"

export function calculateRangeSurface([[x1, y1], [x2, y2]]: [Coordinate, Coordinate]): number {
  return Math.abs(x2 - x1) * Math.abs(y2 - y1)
}
