export type CellPattern = [number, number][]

export default class Pattern {
  private cells: CellPattern

  constructor(pattern: CellPattern = []) {
    this.cells = [...pattern]
  }

  public addCellPattern(pattern: CellPattern) {
    this.cells.push(...pattern)
    return this
  }

  public addPattern(pattern: Pattern) {
    this.cells.push(...pattern.cells)
    return this
  }

  public addCell(x: number, y: number) {
    this.cells.push([x, y])
    return this
  }

  public rotateRight() {
    this.cells = this.cells.map(([x, y]) => [y, -x])
    return this
  }

  public rotateLeft() {
    this.cells = this.cells.map(([x, y]) => [-y, x])
    return this
  }

  public symmetricY() {
    this.cells = this.cells.map(([x, y]) => [x, -y])
    return this
  }

  public symmetricX() {
    this.cells = this.cells.map(([x, y]) => [-x, y])
    return this
  }

  public symmetricXY() {
    this.cells = this.cells.map(([x, y]) => [-x, -y])
    return this
  }

  public setOrigin(x: number, y: number) {
    this.cells = this.cells.map(([dx, dy]) => [x + dx, y + dy])
    return this
  }

  public getCells(): CellPattern {
    return this.cells
  }

  public toCells(): string[] {
    return this.cells.map(([x, y]) => `${x},${y}`)
  }
}
