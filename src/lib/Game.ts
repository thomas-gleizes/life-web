import PatternBuilder from "./PatternBuilder.ts"

export default class Game {
  private _cellsAlive: Set<string>

  constructor() {
    this._cellsAlive = new Set<string>([
      ...PatternBuilder.formate(PatternBuilder.gliderGun, 1, 1),
      ...PatternBuilder.formate(PatternBuilder.symetricY(PatternBuilder.gliderGun), 1, -1),
      ...PatternBuilder.formate(PatternBuilder.symetricX(PatternBuilder.gliderGun), -1, 1),
      ...PatternBuilder.formate(
        PatternBuilder.symetricX(PatternBuilder.symetricY(PatternBuilder.gliderGun)),
        -1,
        -1,
      ),
    ])
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
  }

  public get cellsAlive(): Array<string> {
    return Array.from(this._cellsAlive)
  }
}
