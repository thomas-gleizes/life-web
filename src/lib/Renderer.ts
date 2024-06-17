import SettingsIndicator from "./SettingsIndicator.tsx"
import { RULES_LIST } from "../utils/constants.ts"
import Rule from "./Rule.ts"
import Pattern from "./Pattern.ts"
import {
  Coordinate,
  RequestType,
  RequestTypeWithId,
  ResponseType,
  ResponseTypeWithId,
} from "../types"
import uuid from "../utils/uuid.ts"

export default class Renderer {
  private static readonly FPS = 30
  private static readonly MIN_SCALE = 0.2
  private static readonly MIN_DELAY = 1
  private static readonly MAX_DELAY = 5000

  private _canvas: HTMLCanvasElement
  private _context2D: CanvasRenderingContext2D
  private _isStarted: boolean

  private _center: { x: number; y: number }
  private _playing: boolean
  private _delay: number

  private _scale: number
  private _zoom: number

  private _mouse: { x: number; y: number; isDown1: boolean; isDown2: boolean; kill: boolean | null }
  private _patternCopy: Pattern | null

  private _gameWorker: Worker
  private _resolvers: Map<string, Function>

  constructor(canvas: HTMLCanvasElement) {
    this._canvas = canvas
    this._context2D = canvas.getContext("2d")!
    this._isStarted = false

    this._center = {
      x: canvas.width / 2,
      y: canvas.height / 2,
    }
    this._playing = true
    this._delay = 100
    this._scale = 10.12
    this._zoom = 58

    this._mouse = { x: 0, y: 0, isDown1: false, isDown2: false, kill: null }
    this._patternCopy = null

    this._resolvers = new Map()

    this._gameWorker = new Worker(new URL("../workers/game.ts", import.meta.url), {
      type: "module",
    })

    this._gameWorker.onmessage = (event: MessageEvent<ResponseTypeWithId>) => {
      const resolver = this._resolvers.get(event.data.id)

      if (resolver) resolver(event.data.content)
      else console.error("Invalid response id")
    }
  }

  private render(cells: string[]) {
    const timestamp = Date.now()
    this._context2D.clearRect(0, 0, this._canvas.width, this._canvas.height)
    const rectWidth = this._scale
    const border = rectWidth / 10
    const padding = border / 2

    for (const cell of cells) {
      const [x, y] = cell.split(",").map(Number)
      const rectX = x * this._scale + this._center.x
      const rectY = y * this._scale + this._center.y

      if (
        rectX + rectWidth < 0 ||
        rectX > this._canvas.width ||
        rectY + rectWidth < 0 ||
        rectY > this._canvas.height
      ) {
        continue
      }

      this._context2D.fillStyle = "white"
      this._context2D.fillRect(
        rectX + padding,
        rectY + padding,
        rectWidth - border,
        rectWidth - border,
      )
    }

    SettingsIndicator.setPerformanceR(Date.now() - timestamp)
  }

  private sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  private togglePlaying() {
    this._playing = !this._playing
    this.postMessage({ type: this._playing ? "start" : "stop", content: null })
    localStorage.setItem("playing", String(this._playing))
    SettingsIndicator.setPlaying(this._playing)
  }

  private setZoom(zoom: number) {
    this._zoom = Math.max(0, Math.min(100, zoom))
    let scale = Renderer.MIN_SCALE

    for (let i = 0; i < this._zoom; i++) {
      scale *= 1.07
    }

    SettingsIndicator.setScaleIndicator(this._zoom)

    this._scale = scale
  }

  private reverseScale() {
    let zoom = 0
    let tempScale = Renderer.MIN_SCALE

    while (tempScale < this._scale) {
      tempScale *= 1.07
      zoom++
    }

    return zoom
  }

  private postMessage(request: RequestType): Promise<ResponseType["content"]> {
    return new Promise((resolve) => {
      let id = uuid()
      const requestWithId: RequestTypeWithId = { ...request, id }

      this._resolvers.set(id, resolve)

      this._gameWorker.postMessage(requestWithId)
    })
  }

  private addPattern(pattern: Pattern, [x, y]: Coordinate) {
    return this.postMessage({
      type: "pattern",
      content: { pattern: pattern.toJson(), coord: [x, y] },
    })
  }

  private clear() {
    return this.postMessage({ type: "clear", content: null })
  }

  private reset() {
    return this.postMessage({ type: "reset", content: null })
  }

  private setRule(rule: Rule) {
    return this.postMessage({ type: "rule", content: { rule: rule.toJson() } })
  }

  private async save() {
    return this.postMessage({ type: "save", content: null })
  }

  private async toggleLife(coord: Coordinate) {
    return this.postMessage({ type: "toggleCell", content: { coord } })
  }

  private setUpEventListeners() {
    this._canvas.addEventListener("wheel", (event) => {
      const oldScale = this._scale
      if (event.deltaY < 0) this.setZoom(this._zoom - 1)
      else this.setZoom(this._zoom + 1)

      const scaleRatio = this._scale / oldScale
      this._center.x = event.clientX - scaleRatio * (event.clientX - this._center.x)
      this._center.y = event.clientY - scaleRatio * (event.clientY - this._center.y)

      SettingsIndicator.setCenter(
        this._canvas.width / 2 - this._center.x,
        this._canvas.height / 2 - this._center.y,
      )
    })

    this._canvas.addEventListener("mousedown", (event) => {
      if (this._patternCopy) return

      if (event.button === 0) {
        this._mouse.isDown1 = true
        if (!this._patternCopy) return

        const x = Math.floor((event.clientX - this._center.x) / this._scale)
        const y = Math.floor((event.clientY - this._center.y) / this._scale)
        this.toggleLife([x, y])
      } else if (event.button === 2) {
        this._canvas.style.cursor = "grabbing"
        this._mouse.isDown2 = true
      }
    })

    this._canvas.addEventListener("mouseup", (event) => {
      if (this._patternCopy) {
        const x = (event.clientX - this._center.x) / this._scale
        const y = (event.clientY - this._center.y) / this._scale
        return this.addPattern(this._patternCopy.toZeros(), [x, y])
      }

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
        if (this._patternCopy) return

        const x = Math.floor((event.clientX - this._center.x) / this._scale)
        const y = Math.floor((event.clientY - this._center.y) / this._scale)
        this.toggleLife([x, y])
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

    document.getElementById("reset")!.addEventListener("click", () => this.reset())

    document.getElementById("clear")!.addEventListener("click", () => this.clear())

    document.getElementById("play")!.addEventListener("click", () => this.togglePlaying())

    document.getElementById("save")!.addEventListener("click", () => this.save())

    document
      .getElementById("menu-button")!
      .addEventListener("click", () => SettingsIndicator.toggleMenu())

    document.getElementById("speed")!.addEventListener("input", (event) => {
      const input = event.target as HTMLInputElement
      this._delay = Math.floor(
        Math.max(Renderer.MIN_DELAY, Math.min(Renderer.MAX_DELAY, Number(input.value))),
      )
    })

    SettingsIndicator.setDelay(this._delay)

    document.getElementById("speed-minus")!.addEventListener("click", async () => {
      this._delay = Math.floor(+Math.max(Renderer.MIN_DELAY, this._delay * 0.9).toFixed(2))
      await this.postMessage({ type: "delay", content: { delay: this._delay } })
      SettingsIndicator.setDelay(this._delay)
    })

    document.getElementById("speed-plus")!.addEventListener("click", async () => {
      this._delay = +Math.min(Renderer.MAX_DELAY, this._delay * 1.1).toFixed(2)
      await this.postMessage({ type: "delay", content: { delay: this._delay } })
      SettingsIndicator.setDelay(this._delay)
    })

    document.getElementById("rule")!.addEventListener("change", (event) => {
      const target = event.target as HTMLSelectElement
      const rule: Rule = RULES_LIST[target.value as keyof typeof RULES_LIST]
      this.setRule(rule)
    })

    SettingsIndicator.setUpRulesSelect()
    SettingsIndicator.setupPatternList((pattern) => {
      SettingsIndicator.setPatternName(pattern.name)
      this._patternCopy = pattern
    })

    document.getElementById("reset-pattern")!.addEventListener("click", () => {
      SettingsIndicator.setPatternName("")
      this._patternCopy = null
    })

    document.body.addEventListener("keydown", (event) => {
      event.preventDefault()
      switch (event.key) {
        case " ":
          this.togglePlaying()
          break
        case "k":
          if (!this._playing) {
            this.postMessage({ type: "iterate", content: null })
          }
          break
        case "ArrowRight":
          this._center.x -= this.reverseScale()
          SettingsIndicator.setCenter(
            this._canvas.width / 2 - this._center.x,
            this._canvas.height / 2 - this._center.y,
          )
          break
        case "ArrowLeft":
          this._center.x += this.reverseScale()
          SettingsIndicator.setCenter(
            this._canvas.width / 2 - this._center.x,
            this._canvas.height / 2 - this._center.y,
          )
          break
        case "ArrowDown":
          this._center.y -= this.reverseScale()
          SettingsIndicator.setCenter(
            this._canvas.width / 2 - this._center.x,
            this._canvas.height / 2 - this._center.y,
          )
          break
        case "ArrowUp":
          this._center.y += this.reverseScale()
          SettingsIndicator.setCenter(
            this._canvas.width / 2 - this._center.x,
            this._canvas.height / 2 - this._center.y,
          )
          break
        case "r":
          this.reset()
      }
    })
  }

  private async loopRender() {
    while (true) {
      const timestamp = Date.now()
      const { cells } = await this.postMessage({ type: "cells", content: null })

      this.render(cells)
      SettingsIndicator.setCellCount(cells.length)

      const performance = Date.now() - timestamp

      SettingsIndicator.setPerformanceR(performance)

      const sleepTime = Math.max(1, 1000 / Renderer.FPS - performance)

      await this.sleep(sleepTime)
    }
  }

  public async start() {
    if (this._isStarted) return
    this._isStarted = true

    this.setUpEventListeners()
    await this.postMessage({ type: "delay", content: { delay: this._delay } })
    await this.postMessage({ type: "start", content: null })

    void this.loopRender()
  }
}
