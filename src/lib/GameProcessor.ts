import Game from "./Game.ts"
import { RequestType, ResponseType } from "../types"
import Rule from "./Rule.ts"
import Pattern from "./Pattern.ts"

export default class GameProcessor {
  private isRunning: boolean
  private isStarted: boolean
  private game: Game
  private delay: number
  private callbackActions: Function[]

  constructor() {
    this.isStarted = false
    this.isRunning = false
    this.game = new Game()
    this.delay = 100
    this.callbackActions = []
  }

  public setRunning(running: boolean): void {
    this.isRunning = running
  }

  private async sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  public async start() {
    if (this.isStarted) return
    this.isStarted = true

    while (true) {
      while (this.isRunning) {
        for (const action of [...this.callbackActions]) {
          await action.bind(this)()
          this.callbackActions.shift()
        }

        const timestamp = Date.now()

        await this.game.iterate()

        const elapsed = Date.now() - timestamp

        const sleepTime = Math.max(this.delay - elapsed, 1)

        await this.sleep(sleepTime)
      }

      await this.sleep(1000)
    }
  }

  public async handleEvent({ type, content }: RequestType): Promise<ResponseType> {
    const response: ResponseType = { type, content: {} }

    switch (type) {
      case "delay":
        this.delay = content.delay
        break
      case "start":
        this.setRunning(true)
        break
      case "stop":
        this.setRunning(false)
        break
      case "save":
        this.game.save()
        break
      case "rule":
        const rule = Rule.fromJSON(content.rule)
        if (this.isRunning) this.callbackActions.push(() => this.game.setRule(rule))
        else this.game.setRule(rule)
        break
      case "toggleCell":
        if (this.isRunning) this.callbackActions.push(() => this.game.toggleCell(content.coord))
        else this.game.toggleCell(content.coord)
        break
      case "pattern":
        const pattern = Pattern.fromJson(content.pattern)

        if (this.isRunning)
          this.callbackActions.push(() => this.game.addPattern(pattern, content.coord))
        else this.game.addPattern(pattern, content.coord)
        break
      case "reset":
        if (this.isRunning) this.callbackActions.push(() => this.game.reset())
        else this.game.reset()
        break
      case "clear":
        if (this.isRunning) this.callbackActions.push(() => this.game.clear())
        else this.game.clear()
        break
      case "iterate":
        if (!this.isRunning) await this.game.iterate()
        break
      case "cells":
        response.content.cells = Array.from(this.game.cellsAlive)
        break
      default:
        break
    }

    return response
  }
}
