import { iterate } from "../utils/iterate.ts"
import Rule from "./Rule.ts"
import { RULES_LIST } from "../utils/constants.ts"
import Pattern from "./Pattern.ts"

export default class Game {
  private _cellsAlive: Set<string>
  private readonly _initialCells: string[]
  private _iteration: number
  private rule: Rule
  private _worker: Worker
  private _useWorker: boolean

  constructor() {
    const initialCells: string[] = []

    this._cellsAlive = new Set<string>(initialCells)
    this._initialCells = initialCells
    this._iteration = 0
    this.rule = RULES_LIST.Conway
    this._useWorker = false
    this._worker = new Worker(new URL("../workers/iterate.ts", import.meta.url), {
      name: "iterate",
      type: "module",
    })
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

  public addPattern(pattern: Pattern, originX: number = 0, originY: number = 0): void {
    for (const [x, y] of pattern.getCells()) {
      this._cellsAlive.add(`${x + originX},${y + originY}`)
    }
  }

  public async iterate(): Promise<void> {
    if (this._useWorker)
      return new Promise((resolve) => {
        this._worker.postMessage({
          type: "iterate",
          cellsAlive: this._cellsAlive,
          rule: this.rule.toObject(),
        })

        this._worker.onmessage = (event) => {
          this._cellsAlive = new Set(event.data.result)
          this._iteration++
          resolve()
        }
      })

    this._cellsAlive = await iterate(this._cellsAlive, this.rule)
    this._iteration++
  }

  public get iteration(): number {
    return this._iteration
  }

  public toggleCell(x: number, y: number): void {
    const cell = `${x},${y}`
    if (this._cellsAlive.has(cell)) {
      this._cellsAlive.delete(cell)
    } else {
      this._cellsAlive.add(cell)
    }
  }

  public toggleWorker(): boolean {
    this._useWorker = !this._useWorker
    return this._useWorker
  }

  public get cellsAlive(): Array<string> {
    return Array.from(this._cellsAlive)
  }

  isCellAlive(x: number, y: number): boolean {
    return this._cellsAlive.has(`${x},${y}`)
  }
}
