import Game from "./Game.ts"
import { RequestType, ResponseType } from "../types"
import Rule from "./Rule.ts"
import Pattern from "./Pattern.ts"

export default class GameProcessor {
  private isRunning: boolean
  private isStarted: boolean
  private game: Game
  private delay: number
  private readonly callbackActions: Function[]

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

  private addAction(action: Function): void {
    if (!this.isRunning) action()
    else this.callbackActions.push(action)
  }

  private async playActions() {
    for (const action of [...this.callbackActions]) {
      await action.bind(this)()
      this.callbackActions.shift()
    }
  }

  private async sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  public async start() {
    if (this.isStarted) return
    this.isStarted = true

    while (true) {
      while (this.isRunning) {
        await this.playActions()
        const timestamp = Date.now()

        await this.game.iterate()

        const elapsed = Date.now() - timestamp

        const sleepTime = Math.max(this.delay - elapsed, 1)

        await this.sleep(sleepTime)
      }

      await this.sleep(100)
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
        this.addAction(() => this.game.setRule(rule))
        break
      case "toggleCell":
        this.addAction(() => this.game.toggleCell(content.coord))
        break
      case "pattern":
        const pattern = Pattern.fromJson(content.pattern)

        this.addAction(() => this.game.addPattern(pattern, content.origin))
        break
      case "reset":
        this.addAction(() => this.game.reset())
        break
      case "clear":
        this.addAction(() => this.game.clear())
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
