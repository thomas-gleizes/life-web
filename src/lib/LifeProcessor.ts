import Life from "./life/Life"
import { RequestType, ResponseType } from "../types"
import Rule from "./life/Rule"
import Pattern from "./life/Pattern"

export default class LifeProcessor {
  private isRunning: boolean
  private isStarted: boolean
  private life: Life
  private delay: number
  private readonly callbackActions: Function[]
  private lastIterationTime: number

  constructor() {
    this.isStarted = false
    this.isRunning = false
    this.life = new Life()
    this.delay = 100
    this.callbackActions = []
    this.lastIterationTime = NaN
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

        await this.life.iterate()

        this.lastIterationTime = Date.now() - timestamp

        const sleepTime = Math.max(this.delay - this.lastIterationTime, 1)

        await this.sleep(sleepTime)
      }

      await this.sleep(100)
    }
  }

  public async handleEvent({ type, content }: RequestType): Promise<ResponseType> {
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
        this.life.save()
        break
      case "rule":
        const rule = Rule.fromJSON(content.rule)
        this.addAction(() => this.life.setRule(rule))
        break
      case "toggleCell":
        this.addAction(() => this.life.toggleCell(content.coordinate))
        break
      case "pattern":
        const pattern = Pattern.fromJson(content.pattern)

        this.addAction(() => this.life.addPattern(pattern, content.coordinate))
        break
      case "reset":
        this.addAction(() => this.life.reset())
        break
      case "clear":
        this.addAction(() => this.life.clear())
        break
      case "iterate":
        if (!this.isRunning) await this.life.iterate()
        break
      case "cells":
        const cells = content.range
          ? this.life.getCellsAlive(content.range)
          : Array.from(this.life.cellsAlive)

        return { type, content: { cells: cells } }
      case "info":
        return {
          type,
          content: {
            cellsAlive: this.life.cellsAlive.size,
            lastIteration: this.lastIterationTime,
          },
        }
      case "soup":
        this.addAction(() =>
          this.life.addSoup(content.origin, content.width, content.height, content.probability)
        )
        break
      default:
        break
    }

    return { type, content: {} }
  }
}
