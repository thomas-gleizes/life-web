import uuid from "../utils/uuid.ts"
import { ActionType, Coordinate, RequestType, ResponseType } from "../types"
import Rule from "./life/Rule.ts"
import Pattern from "./life/Pattern.ts"

export class AppProcessor {
  private readonly _worker: Worker
  private readonly _resolvers: Map<string, Function>

  constructor() {
    this._worker = new Worker(new URL("../workers/life.ts", import.meta.url), {
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
    content: Extract<RequestType, { type: T }>["content"],
  ): Promise<Extract<ResponseType, { type: T }>["content"]> {
    // @ts-ignore
    return new Promise((resolve) => {
      let id = uuid()
      const requestWithId = { type, content, id }

      this._resolvers.set(id, resolve)

      this._worker.postMessage(requestWithId)
    })
  }

  public start() {
    return this.send("start", null)
  }

  public stop() {
    return this.send("stop", null)
  }

  public setDelay(delay: number) {
    return this.send("delay", { delay })
  }

  public toggleCell(coord: Coordinate) {
    return this.send("toggleCell", { coord })
  }

  public iterate() {
    return this.send("iterate", null)
  }

  public setRule(rule: Rule) {
    return this.send("rule", { rule: rule.toJson() })
  }

  public setPattern(pattern: Pattern, coord: Coordinate) {
    return this.send("pattern", { pattern: pattern.toJson(), coord })
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

  public getCells(range?: [Coordinate, Coordinate]) {
    return this.send("cells", { range })
  }

  public getInfo() {
    return this.send("info", null)
  }
}
