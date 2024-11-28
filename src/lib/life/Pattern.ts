import Rule from "./Rule.ts"
import { RULES_LIST } from "../../utils/constants.ts"
import { Coordinate } from "../../types"

export type CellPattern = ("0" | "X")[][]

export default class Pattern {
  private _name: string
  private cells: Coordinate[]
  private readonly _rule: Rule

  constructor(pattern: Coordinate[] = [], name = "", rule: Rule = RULES_LIST.Conway) {
    this.cells = [...pattern]
    this._rule = rule
    this._name = name
  }

  static from(cellPattern: CellPattern, name: string): Pattern {
    const cells: Coordinate[] = []

    for (let i = 0; i < cellPattern.length; i++) {
      for (let j = 0; j < cellPattern[i].length; j++) {
        if (cellPattern[i][j] === "X") {
          cells.push([j, i])
        }
      }
    }

    return new Pattern(cells, name)
  }

  public get name() {
    return this._name
  }

  public set name(name: string) {
    this._name = name
  }

  public addCellPattern(pattern: Coordinate[]) {
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
    const [[minX, minY]] = this.getBoundingBox()
    this.cells = this.cells.map(([dx, dy]) => [x - minX + dx, y - minY + dy])
    return this
  }

  public getCells(): Coordinate[] {
    return this.cells
  }

  public toCells(): string[] {
    return this.cells.map(([x, y]) => `${Math.floor(x)},${Math.floor(y)}`)
  }

  public get rule(): Rule {
    return this._rule
  }

  public getBoundingBox() {
    let minX = Infinity
    let minY = Infinity
    let maxX = -Infinity
    let maxY = -Infinity

    for (const [x, y] of this.cells) {
      minX = Math.min(minX, x)
      minY = Math.min(minY, y)
      maxX = Math.max(maxX, x)
      maxY = Math.max(maxY, y)
    }

    return [
      [minX, minY],
      [maxX, maxY],
    ]
  }

  public getSize() {
    const [[minX, minY], [maxX, maxY]] = this.getBoundingBox()
    return [maxX - minX + 1, maxY - minY + 1]
  }

  public getCenter() {
    const [[minX, minY], [maxX, maxY]] = this.getBoundingBox()
    return [(minX + maxX) / 2, (minY + maxY) / 2]
  }

  public centerOrigin() {
    const [centerX, centerY] = this.getCenter()
    this.cells = this.cells.map(([x, y]) => [x - centerX, y - centerY])
    return this
  }

  public toZeros() {
    this.setOrigin(0, 0)
    return this
  }

  public clone(): Pattern {
    return new Pattern(this.cells, this._name, this._rule)
  }

  public toJson() {
    return {
      name: this._name,
      cells: this.cells,
      rules: this._rule.toJson(),
    }
  }

  static fromJson(json: any): Pattern {
    return new Pattern(json.cells, json.name, Rule.fromJSON(json.rules))
  }

  static parse(string: string): Pattern {
    const pattern = new Pattern()
    let ignore = false
    let step = 1
    let x = 0
    let y = 0
    let match
    let number

    for (let i = 0; i < string.length; i++) {
      if (ignore) {
        if (string[i] === "\n") {
          ignore = false
        }
        continue
      }
      switch (string[i]) {
        case "#":
        case "x":
        case "!":
          ignore = true
          continue
        case "$":
          x = 0
          y += step
          continue
        case "b":
          x += step
          step = 1
          continue
        case "o":
          for (let j = 0; j < step; j++) {
            pattern.addCell(x++, y)
          }
          step = 1
          continue
      }
      match = string.slice(i).match(/[0-9]+/)
      if (match && !match.index) {
        number = match[0]
        step = parseInt(number)
        i += number.length - 1
      }
    }

    return pattern
  }
}
