import Rule from "./Rule.ts"
import { PATTERNS_LIST, RULES_LIST } from "../utils/constants.ts"
import Pattern from "./Pattern.ts"
import { Coordinate } from "../types"

export default class Game {
  private _cellsAlive: Set<string>
  private _initialCells: string[]
  private _iteration: number
  private rule: Rule

  constructor() {
    this._cellsAlive = new Set<string>(PATTERNS_LIST.pulsar.clone().centerOrigin().toCells())

    this._initialCells = Array.from(this._cellsAlive)
    this._iteration = 0
    this.rule = RULES_LIST.Conway
  }

  public reset(): void {
    this._cellsAlive.clear()
    for (const cell of this._initialCells) this._cellsAlive.add(cell)
    this._iteration = 0
  }

  public setRule(rule: Rule): void {
    this.rule = rule
  }

  public clear(): void {
    this._cellsAlive.clear()
    this._iteration = 0
  }

  public save() {
    this._initialCells = Array.from(this._cellsAlive)
  }

  public addPattern(pattern: Pattern, [originX, originY]: Coordinate): void {
    for (const [x, y] of pattern.clone().centerOrigin().getCells()) {
      this._cellsAlive.add(`${Math.floor(x + originX)},${Math.floor(y + originY)}`)
    }
  }

  public async iterate(): Promise<void> {
    const neighborCounts = new Map()
    const rule = this.rule

    for (const cell of this._cellsAlive) {
      const [x, y] = cell.split(",").map(Number)
      for (let dx = -1; dx <= 1; dx++) {
        for (let dy = -1; dy <= 1; dy++) {
          if (dx !== 0 || dy !== 0) {
            const neighbor = [x + dx, y + dy].join(",")
            const count = neighborCounts.get(neighbor) || 0
            neighborCounts.set(neighbor, count + 1)
          }
        }
      }
    }

    const newAliveCells = new Set<string>()

    for (const [cell, count] of neighborCounts.entries()) {
      if ((this._cellsAlive.has(cell) && rule.mustSurvive(count)) || rule.mustBorn(count)) {
        newAliveCells.add(cell)
      }
    }

    this._cellsAlive = newAliveCells
    this._iteration++
  }

  public get iteration(): number {
    return this._iteration
  }

  public toggleCell([x, y]: Coordinate): void {
    const cell = `${x},${y}`
    if (this._cellsAlive.has(cell)) {
      this._cellsAlive.delete(cell)
    } else {
      this._cellsAlive.add(cell)
    }
  }

  public get cellsAlive(): Array<string> {
    return Array.from(this._cellsAlive)
  }
}
