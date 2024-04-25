import Game from "./Game.ts"

export default class Renderer {
  private static readonly FPS = 144

  private _canvas: HTMLCanvasElement
  private _context2D: CanvasRenderingContext2D
  private _game: Game

  private _center: { x: number; y: number }
  private _playing: boolean
  private _delay: number
  private _scale: number

  private _mouse: { x: number; y: number; isDown: boolean }

  constructor(canvas: HTMLCanvasElement) {
    this._canvas = canvas
    this._context2D = canvas.getContext("2d")!

    this._game = new Game()
    this._center = {
      x: canvas.width / 2,
      y: canvas.height / 2,
    }
    this._playing = localStorage.getItem("playing") === "true"
    this._delay = 1
    this._scale = +(localStorage.getItem("scale") || "1")

    this._mouse = { x: 0, y: 0, isDown: false }
  }

  private drawCell(x: number, y: number) {
    const border = 0.05
    const width = 1

    this._context2D.fillStyle = "white"
    this._context2D.fillRect(
      x * width * this._scale + border * this._scale + this._center.x,
      y * width * this._scale + border * this._scale + this._center.y,
      width * this._scale - border * this._scale * 2,
      width * this._scale - border * this._scale * 2,
    )
  }

  private render() {
    this._context2D.clearRect(0, 0, this._canvas.width, this._canvas.height)
    for (const cell of this._game.cellsAlive) {
      const [x, y] = cell.split(",").map(Number)
      this.drawCell(x, y)
    }
  }

  private sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  private setUpEventListeners() {
    window.addEventListener("wheel", (event) => {
      if (event.deltaY < 0) this._scale *= 0.9
      else this._scale *= 1.1
    })

    window.addEventListener("mousedown", () => {
      this._mouse.isDown = true
    })

    window.addEventListener("mouseup", () => {
      this._mouse.isDown = false
    })

    window.addEventListener("mousemove", (event) => {
      this._mouse.x = event.clientX
      this._mouse.y = event.clientY

      if (this._mouse.isDown) {
        this._center.x += event.movementX
        this._center.y += event.movementY
      }
    })

    window.addEventListener("keydown", (event) => {
      event.preventDefault()
      switch (event.key) {
        case " ":
          this._playing = !this._playing
          localStorage.setItem("playing", String(this._playing))
          break
        case "k":
          if (!this._playing) this._game.iterate()
          break
        case "ArrowUp":
          this._delay *= 0.9
          break
        case "ArrowDown":
          this._delay *= 1.1
          break
        case "i":
          console.log("This._scale", this._scale)
          console.log("This._delay", this._delay)
          console.log("CELL alive", this._game.cellsAlive.length)
      }
    })
  }

  public async start() {
    this.setUpEventListeners()

    setInterval(() => {
      this.render()
    }, 1000 / Renderer.FPS)

    while (true) {
      while (this._playing) {
        this._game.iterate()
        await this.sleep(this._delay)
      }

      await this.sleep(100)
    }
  }
}
