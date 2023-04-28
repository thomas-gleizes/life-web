import { Coordinate } from "./Coordinate.ts"

export class Cell {
  private readonly _coordinate: Coordinate
  private _isAlive: boolean

  constructor(x: number, y: number, isAlive: boolean = false) {
    this._coordinate = new Coordinate(x, y)
    this._isAlive = isAlive
  }

  get coordinate(): Coordinate {
    return this._coordinate
  }

  get isAlive(): boolean {
    return this._isAlive
  }

  public toggleLife(): void {
    this._isAlive = !this._isAlive
  }
}
