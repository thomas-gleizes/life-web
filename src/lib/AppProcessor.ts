import uuid from "../utils/uuid"
import { ActionType, Coordinate, RangeC, RequestType, ResponseType } from "../types"
import Rule from "./life/Rule"
import Pattern from "./life/Pattern"

export class AppProcessor {
  private readonly _worker: Worker
  private readonly _resolvers: Map<string, Function>

  private _isRunning = false

  constructor() {
    this._worker = new Worker(new URL("../workers/life_worker", import.meta.url), {
      type: "module",
    })
    this._resolvers = new Map()

    this._worker.onmessage = (event: MessageEvent) => {
      const resolver = this._resolvers.get(event.data.id)

      if (resolver) resolver(event.data.content)
      else console.error("Invalid response id")
    }
  }

  private async send<T extends ActionType>(
    type: T,
    content: Extract<RequestType, { type: T }>["content"]
  ): Promise<Extract<ResponseType, { type: T }>["content"]> {
    return new Promise<any>((resolve) => {
      let id = uuid()
      const requestWithId = { type, content, id }

      this._resolvers.set(id, resolve)

      this._worker.postMessage(requestWithId)
    })
  }

  public async start() {
    return this.send("start", null)
      .then(() => (this._isRunning = true))
      .then(() => this.isRunning)
  }

  public async stop() {
    return this.send("stop", null)
      .then(() => (this._isRunning = false))
      .then(() => this.isRunning)
  }

  public setDelay(delay: number) {
    return this.send("delay", { delay })
  }

  public toggleCell(coordinate: Coordinate) {
    return this.send("toggleCell", { coordinate })
  }

  public iterate() {
    return this.send("iterate", null)
  }

  public setRule(rule: Rule) {
    return this.send("rule", { rule: rule.toJson() })
  }

  public setPattern(pattern: Pattern, coordinate: Coordinate) {
    return this.send("pattern", { pattern: pattern.toJson(), coordinate })
  }

  public reset() {
    return this.send("reset", null)
  }

  public clear() {
    return this.send("clear", null)
  }

  public save() {
    return this.send("save", null)
  }

  public getCells(range?: RangeC) {
    return this.send("cells", { range })
  }

  public getInfo() {
    return this.send("info", null)
  }

  public addSoupe(origin: Coordinate, width: number, height: number, probability: number) {
    return this.send("soup", { origin, width, height, probability })
  }

  public get isRunning() {
    return this._isRunning
  }
}
