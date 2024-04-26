import PatternBuilder from "./PatternBuilder.ts"

export default class Game {
  private _cellsAlive: Set<string>
  private _iteration: number

  constructor() {
    this._iteration = 0
    this._cellsAlive = new Set<string>(PatternBuilder.toCells(PatternBuilder.gliderGunX4))
    // this._cellsAlive.add("0,0")
    // this._cellsAlive.add("-1,0")
    // this._cellsAlive.add("1,0")
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

  public iterate(): void {
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
}
