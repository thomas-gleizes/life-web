import PatternList from "./PatternList.ts"
import Pattern from "./Pattern.ts"
import { iterate } from "../utils/iterate.ts"

const RULES = {
  default: "Default",
  rule6: "Rule 6",
} as const

export default class Game {
  private _cellsAlive: Set<string>
  private readonly _initialCells: string[]
  private _iteration: number
  private rule: keyof typeof RULES
  private _worker: Worker
  private _useWorker: boolean

  constructor() {
    const initialCells: string[] = []
    for (let i = 0; i < 10; i++) {
      initialCells.push(...new Pattern(PatternList.gliderGun).setOrigin(i * 40, 0).toCells())
      initialCells.push(...new Pattern(PatternList.gliderGun).setOrigin(-40, i * 30).toCells())
    }

    this._cellsAlive = new Set<string>(initialCells)
    this._initialCells = initialCells
    this._iteration = 0
    this.rule = "default"
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

  public setRule(rule: keyof typeof RULES): void {
    this.rule = rule
  }

  public clear(): void {
    this._cellsAlive.clear()
    this._iteration = 0
  }

  public async iterate(): Promise<void> {
    if (this._useWorker)
      return new Promise((resolve) => {
        this._worker.postMessage({
          type: "iterate",
          cellsAlive: Array.from(this._cellsAlive),
          rule: this.rule,
        })

        this._worker.onmessage = (event) => {
          this._cellsAlive = new Set(event.data.result)
          this._iteration++
          resolve()
        }
      })

    this._cellsAlive = await iterate(this._cellsAlive)
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
