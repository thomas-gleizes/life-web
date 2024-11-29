import Rule from "./Rule.ts"
import { PATTERNS_LIST, RULES_LIST } from "../../utils/constants.ts"
import Pattern from "./Pattern.ts"
import { Coordinate } from "../../types"
import { calculateRangeSurface } from "../../utils/helpers.ts"

export default class Life {
  private _cellsAlive: Set<string>
  private _initialCells: string[]
  private _iteration: number
  private rule: Rule

  constructor() {
    this._cellsAlive = new Set<string>()

    this._initialCells = Array.from(this._cellsAlive)
    this._iteration = 0
    this.rule = RULES_LIST.Conway

    this._cellsAlive.add("0,0")
    this._cellsAlive.add("-64,-46")
    this._cellsAlive.add("64,46")
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

  public getCellsAlive(range: [Coordinate, Coordinate]): Array<string> {
    if (calculateRangeSurface(range) > this._cellsAlive.size) {
      return Array.from(this._cellsAlive).filter((cell) => {
        const [x, y] = cell.split(",").map(Number)

        return x >= range[0][0] && x <= range[1][0] && y >= range[0][1] && y <= range[1][1]
      })
    } else {
      const cellsAlive: string[] = []
      for (let x = range[0][0]; x <= range[1][0]; x++) {
        for (let y = range[0][1]; y <= range[1][1]; y++) {
          const cell = `${x},${y}`
          if (!this._cellsAlive.has(cell)) cellsAlive.push(cell)
        }
      }
      return cellsAlive
    }
  }

  public get cellsAlive(): Set<string> {
    return this._cellsAlive
  }
}
