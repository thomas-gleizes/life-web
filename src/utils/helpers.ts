import { Coordinate } from "../types"

export function calculateRangeSurface([[x1, y1], [x2, y2]]: [Coordinate, Coordinate]): number {
  return Math.abs(x2 - x1) * Math.abs(y2 - y1)
}

export function round(number: number, precision: number = 0): number {
  const factor = Math.pow(10, precision)
  return Math.round(number * factor) / factor
}

export function formatNumberWithSpaces(number: number): string {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}