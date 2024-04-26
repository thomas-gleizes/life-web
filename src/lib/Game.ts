import PatternList from "./PatternList.ts"
import Pattern from "./Pattern.ts"

export default class Game {
  private readonly _cellsAlive: Set<string>
  private readonly _initialCells: string[]
  private _iteration: number

  constructor() {
    this._iteration = 0
    const initialCells: string[] = []
    initialCells.push(
      ...new Pattern(PatternList.gliderGun).setOrigin(-50 - 100, -36 - 100).toCells(),
    )
    initialCells.push(
      ...new Pattern(PatternList.gliderGun).symmetricX().setOrigin(51, -37).toCells(),
    )
    initialCells.push(
      ...new Pattern(PatternList.gliderGun).symmetricY().setOrigin(-52, 38).toCells(),
    )

    this._cellsAlive = new Set<string>(initialCells)
    this._initialCells = initialCells
  }

  public reset(): void {
    this._cellsAlive.clear()
    for (const cell of this._initialCells) this._cellsAlive.add(cell)
    this._iteration = 0
  }

  private getNeighbours(x: number, y: number): Set<string> {
    return new Set(
      [
        [x - 1, y - 1],
        [x - 1, y],
        [x - 1, y + 1],
        [x, y - 1],
        [x, y + 1],
        [x + 1, y - 1],
        [x + 1, y],
        [x + 1, y + 1],
      ].map((neighbour) => neighbour.join(",")),
    )
  }

  public clear(): void {
    this._cellsAlive.clear()
    this._iteration = 0
  }

  public async iterate(): Promise<void> {
    const cells = new Set<string>(this._cellsAlive)
    const deadCellsToChecks = new Set<string>()

    for (const cell of cells) {
      const [x, y] = cell.split(",").map(Number)
      const neighbours = this.getNeighbours(x, y)
      let aliveNeighbours = 0

      for (const neighbour of neighbours) {
        if (cells.has(neighbour)) {
          aliveNeighbours++
        } else {
          deadCellsToChecks.add(neighbour)
        }
      }

      if (aliveNeighbours < 2 || aliveNeighbours > 3) {
        this._cellsAlive.delete(cell)
      }
    }

    for (const deadCell of deadCellsToChecks) {
      const [x, y] = deadCell.split(",").map(Number)
      const neighbours = this.getNeighbours(x, y)

      const aliveNeighbours = Array.from(neighbours).filter((neighbour) =>
        cells.has(neighbour),
      ).length

      if (aliveNeighbours === 3) {
        this._cellsAlive.add(deadCell)
      }
    }

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

  public get cellsAlive(): Array<string> {
    return Array.from(this._cellsAlive)
  }

  isCellAlive(x: number, y: number): boolean {
    return this._cellsAlive.has(`${x},${y}`)
  }
}
