import lodash from "lodash"

import { Cell } from "./Cell.ts"
import { Coordinate } from "./Coordinate.ts"

export class Board {
  private _cells: Cell[][]
  private readonly _sizeX: number
  private readonly _sizeY: number

  constructor(sizeX: number, sizeY: number) {
    this._sizeX = sizeX
    this._sizeY = sizeY

    this._cells = Array.from({ length: sizeX }, (_, x) =>
      Array.from(
        { length: sizeY },
        (_, y) => new Cell(x, y, x === Math.floor(sizeX / 2) || y === Math.floor(sizeY / 2))
      )
    )

    this._cells[0][0].toggleLife()
    this._cells[sizeX - 1][sizeY - 1].toggleLife()
    this._cells[sizeX - 1][0].toggleLife()
    this._cells[0][sizeY - 1].toggleLife()

    const [x, y] = [Math.floor(sizeX / 2), Math.floor(sizeY / 2)]

    this._cells[x][y].toggleLife()
    this._cells[x][y - 1].toggleLife()
    this._cells[x][y + 1].toggleLife()
  }

  private getAliveNeighbours(cell: Cell): number {
    let aliveNeighbours = 0
    for (let i = cell.coordinate.x - 1; i <= cell.coordinate.x + 1; i++) {
      for (let j = cell.coordinate.y - 1; j <= cell.coordinate.y + 1; j++) {
        if (i === cell.coordinate.x && j === cell.coordinate.y) {
          continue
        }
        if (i < 0 || i >= this._sizeX || j < 0 || j >= this._sizeY) {
          continue
        }
        if (this._cells[i][j].isAlive) {
          aliveNeighbours++
        }
      }
    }

    return aliveNeighbours
  }

  public toggleLife(coordinate: Coordinate): void {
    this._cells[coordinate.x][coordinate.y].toggleLife()
  }

  private cloneBoard(): Cell[][] {
    const pCells: Cell[][] = []

    for (let i = 0; i < this._sizeX; i++) {
      pCells[i] = []
      for (let j = 0; j < this._sizeY; j++) pCells[i][j] = new Cell(i, j, this._cells[i][j].isAlive)
    }

    return pCells
  }

  public iterate(): void {
    const pCells = this.cloneBoard()

    for (let i = 0; i < this._sizeX; i++) {
      for (let j = 0; j < this._sizeY; j++) {
        const pCell = pCells[i][j]

        const aliveNeighbours = this.getAliveNeighbours(pCell)
        if (pCell.isAlive && (aliveNeighbours < 2 || aliveNeighbours > 3)) {
          pCells[i][j].toggleLife()
        } else if (!pCell.isAlive && aliveNeighbours === 3) {
          pCells[i][j].toggleLife()
        }
      }
    }

    this._cells = lodash.cloneDeep(pCells)
  }

  public getAliveCell() {
    const aliveCells: Cell[] = []

    for (const row of this._cells) for (const cell of row) if (cell.isAlive) aliveCells.push(cell)

    return aliveCells
  }

  public countAliveCell(): number {
    return this.getAliveCell().length
  }
}
