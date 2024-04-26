import Game from "./Game.ts"
import SettingsIndicator from "./SettingsIndicator.ts"

export default class Renderer {
  private static readonly FPS = 144
  private static readonly MIN_SCALE = 0.05
  private static readonly MAX_SCALE = 300
  private static readonly MIN_DELAY = 1
  private static readonly MAX_DELAY = 5000

  private _canvas: HTMLCanvasElement
  private _context2D: CanvasRenderingContext2D
  private _game: Game
  private _isStarted: boolean

  private _center: { x: number; y: number }
  private _playing: boolean
  private _delay: number
  private _scale: number

  private _mouse: { x: number; y: number; isDown1: boolean; isDown2: boolean; kill: boolean | null }

  constructor(canvas: HTMLCanvasElement) {
    this._canvas = canvas
    this._context2D = canvas.getContext("2d")!
    this._isStarted = false

    this._game = new Game()
    this._center = {
      x: canvas.width / 2,
      y: canvas.height / 2,
    }
    this._playing = localStorage.getItem("playing") === "true"
    this._delay = 100
    this._scale = 10

    this._mouse = { x: 0, y: 0, isDown1: false, isDown2: false, kill: null }
  }

  private drawCell(x: number, y: number) {
    const width = 1

    const rectX = x * width * this._scale + this._center.x
    const rectY = y * width * this._scale + this._center.y
    const rectWidth = width * this._scale

    if (
      rectX + rectWidth < 0 ||
      rectX > this._canvas.width ||
      rectY + rectWidth < 0 ||
      rectY > this._canvas.height
    ) {
      return
    }

    this._context2D.fillStyle = "white"
    this._context2D.fillRect(rectX, rectY, rectWidth, rectWidth)
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

  private togglePlaying() {
    this._playing = !this._playing
    localStorage.setItem("playing", String(this._playing))
    SettingsIndicator.setPlaying(this._playing)
  }

  private resetSettings() {
    this._game.reset()
  }

  private toggleLife(x: number, y: number) {
    if (this._mouse.kill === null) this._mouse.kill = this._game.isCellAlive(x, y)
    if (this._mouse.kill && this._game.isCellAlive(x, y)) {
      this._game.toggleCell(x, y)
    } else if (!this._mouse.kill && !this._game.isCellAlive(x, y)) {
      this._game.toggleCell(x, y)
    }
  }

  private setUpEventListeners() {
    this._canvas.addEventListener("wheel", (event) => {
      const oldScale = this._scale
      if (event.deltaY < 0) this._scale = Math.max(Renderer.MIN_SCALE, this._scale * 0.9)
      else this._scale = Math.min(Renderer.MAX_SCALE, this._scale * 1.1)

      const scaleRatio = this._scale / oldScale
      this._center.x = event.clientX - scaleRatio * (event.clientX - this._center.x)
      this._center.y = event.clientY - scaleRatio * (event.clientY - this._center.y)

      SettingsIndicator.setCenter(
        this._canvas.width / 2 - this._center.x,
        this._canvas.height / 2 - this._center.y,
      )
    })

    this._canvas.addEventListener("mousedown", (event) => {
      if (event.button === 0) {
        this._mouse.isDown1 = true
        const x = Math.floor((event.clientX - this._center.x) / this._scale)
        const y = Math.floor((event.clientY - this._center.y) / this._scale)
        this.toggleLife(x, y)
      } else if (event.button === 2) {
        this._canvas.style.cursor = "grabbing"
        this._mouse.isDown2 = true
      }
    })

    this._canvas.addEventListener("mouseup", (event) => {
      if (event.button === 0) {
        this._mouse.isDown1 = false
        this._mouse.kill = null
      } else if (event.button === 2) {
        this._canvas.style.cursor = "unset"
        this._mouse.isDown2 = false
      }
    })

    this._canvas.addEventListener("mousemove", (event) => {
      this._mouse.x = event.clientX
      this._mouse.y = event.clientY

      if (this._mouse.isDown2) {
        this._center.x += event.movementX
        this._center.y += event.movementY

        SettingsIndicator.setCenter(
          this._canvas.width / 2 - this._center.x,
          this._canvas.height / 2 - this._center.y,
        )
      } else if (this._mouse.isDown1) {
        const x = Math.floor((event.clientX - this._center.x) / this._scale)
        const y = Math.floor((event.clientY - this._center.y) / this._scale)
        this.toggleLife(x, y)
      }
    })

    this._canvas.addEventListener("mouseleave", () => {
      this._mouse.isDown2 = false
      this._mouse.isDown1 = false
      this._mouse.kill = null
      this._canvas.style.cursor = "unset"
    })

    this._canvas.addEventListener("contextmenu", (event) => {
      event.preventDefault()
    })

    document.getElementById("reset")!.addEventListener("click", () => this.resetSettings())

    document.getElementById("play")!.addEventListener("click", () => this.togglePlaying())

    document.getElementById("clear")!.addEventListener("click", () => this._game.clear())

    document.getElementById("speed")!.addEventListener("input", (event) => {
      const input = event.target as HTMLInputElement
      this._delay = Math.max(Renderer.MIN_DELAY, Math.min(Renderer.MAX_DELAY, Number(input.value)))
    })

    document.getElementById("speed-minus")!.addEventListener("click", () => {
      this._delay = +Math.max(Renderer.MIN_DELAY, this._delay * 0.9).toFixed(2)
      SettingsIndicator.setDelay(this._delay)
    })

    document.getElementById("speed-plus")!.addEventListener("click", () => {
      this._delay = +Math.min(Renderer.MAX_DELAY, this._delay * 1.1).toFixed(2)
      SettingsIndicator.setDelay(this._delay)
    })

    document.body.addEventListener("keydown", (event) => {
      event.preventDefault()
      switch (event.key) {
        case " ":
          this.togglePlaying()
          break
        case "k":
          if (!this._playing) {
            this._game.iterate()
            SettingsIndicator.setIteration(this._game.iteration)
          }
          break
        case "ArrowUp":
          this._delay = +Math.min(Renderer.MAX_DELAY, this._delay * 1.1).toFixed(2)
          SettingsIndicator.setDelay(this._delay)
          break
        case "ArrowDown":
          this._delay = +Math.max(Renderer.MIN_DELAY, this._delay * 0.9).toFixed(2)
          SettingsIndicator.setDelay(this._delay)
          break
        case "i":
          console.log("This._scale", this._scale)
          console.log("This._delay", this._delay)
          console.log("CELL alive", this._game.cellsAlive.length)
          break
        case "r":
          this.resetSettings()
      }
    })
  }

  public async start() {
    if (this._isStarted) throw new Error("Renderer is already started")
    this._isStarted = true

    this.setUpEventListeners()

    setInterval(() => {
      this.render()
      SettingsIndicator.setCellCount(this._game.cellsAlive.length)
    }, 1000 / Renderer.FPS)

    while (true) {
      while (this._playing) {
        void this._game.iterate()
        SettingsIndicator.setIteration(this._game.iteration)
        await this.sleep(this._delay)
      }

      await this.sleep(100)
    }
  }
}
