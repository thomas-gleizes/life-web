import { Board } from "./Board.ts"
import { Coordinate } from "./Coordinate.ts"

declare type Options = {
  scale?: number
  timeout?: number
  loop?: boolean
  cellWidth?: number
  cellHeight?: number
}

export class Game {
  private readonly _canvas: HTMLCanvasElement

  private readonly _board: Board
  private _loop: boolean
  private _interval: number
  private _cellWidth: number
  private _cellHeight: number

  constructor(canvasElement: HTMLCanvasElement, options: Options = {}) {
    const scale = options.scale || 5

    canvasElement.height = Math.round(canvasElement.offsetHeight / scale) * scale
    canvasElement.width = Math.round(canvasElement.offsetWidth / scale) * scale

    this._canvas = canvasElement
    this._board = new Board(
      Math.round(this._canvas.width / scale),
      Math.round(this._canvas.height / scale)
    )
    this._loop = typeof options.loop === "boolean" ? options.loop : true
    this._interval = options.timeout || 100
    this._cellHeight = options.cellHeight || 0.95
    this._cellWidth = options.cellWidth || 0.95

    this._canvas.addEventListener("click", (event) => {
      const x = Math.floor(event.offsetX / scale)
      const y = Math.floor(event.offsetY / scale)

      this._board.toggleLife(new Coordinate(x, y))
      this.render()
      this._board.iterate()
    })

    this.getContext().scale(scale, scale)
  }

  private getContext(): CanvasRenderingContext2D {
    const context = this._canvas.getContext("2d")
    if (context === null) throw new Error("Context not found")
    return context
  }

  private drawCell(coordinate: Coordinate, color: string = "white"): void {
    const context = this.getContext()

    context.fillStyle = color
    context.fillRect(coordinate.x, coordinate.y, this._cellWidth, this._cellHeight)
  }

  private render(): void {
    const ctx = this.getContext()

    ctx.clearRect(0, 0, this._canvas.width, this._canvas.height)
    for (const cell of this._board.getAliveCell()) this.drawCell(cell.coordinate)
  }

  public sleep(timeout?: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, timeout || this._interval))
  }

  public async run(): Promise<void> {
    this.render()
    await this.sleep(1000)

    while (true) {
      if (this._loop) {
        do {
          this._board.iterate()
          this.render()
          await this.sleep()
        } while (this._loop)
      } else await this.sleep(50)
    }
  }

  togglePlay(): void {
    console.log("toggle", this._loop)
    this._loop = !this._loop
  }

  set cellHeight(value: number) {
    this._cellHeight = value
  }
  set cellWidth(value: number) {
    this._cellWidth = value
  }
}
