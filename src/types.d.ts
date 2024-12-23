export type Coordinate = [number, number]
export type RangeC = { coordinate: Coordinate; width: number; height: number }

// Define the shared base type
export type EventType = {
  type: string
  content: any
}

// Extend the base type for RequestType and ResponseType
export type RequestType =
  | { type: "start"; content: null }
  | { type: "stop"; content: null }
  | { type: "iterate"; content: null }
  | { type: "reset"; content: null }
  | { type: "save"; content: null }
  | { type: "cells"; content: { range?: RangeC } }
  | { type: "clear"; content: null }
  | { type: "info"; content: null }
  | { type: "info"; content: null }
  | { type: "toggleCell"; content: { coordinate: Coordinate } }
  | { type: "rule"; content: { rule: object } }
  | { type: "delay"; content: { delay: number } }
  | { type: "pattern"; content: { pattern: object; coordinate: Coordinate } }
  | {
      type: "soup"
      content: { origin: Coordinate; width: number; height: number; probability: number }
    }

export type ResponseType =
  | { type: "cells"; content: { cells: string[] } }
  | { type: "info"; content: { lastIteration: number; cellsAlive: number } }
  | {
      type:
        | "start"
        | "stop"
        | "reset"
        | "clear"
        | "iterate"
        | "rule"
        | "delay"
        | "pattern"
        | "toggleCell"
        | "save"
        | "soup"
      content: {}
    }

export type ActionType = RequestType extends { type: infer T } ? T : never

export type RequestTypeWithId = RequestType & { id: string }
export type ResponseTypeWithId = ResponseType & { id: string }
