export type Coordinate = [number, number]

// Define the shared base type
export type EventType = {
  type: string
  content: any
}

// Extend the base type for RequestType and ResponseType
export type RequestType = EventType &
  (
    | { type: "start" | "stop" | "reset" | "clear" | "cells" | "iterate" | "save"; content: null }
    | { type: "toggleCell"; content: { coord: Coordinate } }
    | { type: "rule"; content: { rule: object } }
    | { type: "delay"; content: { delay: number } }
    | { type: "pattern"; content: { pattern: object; coord: Coordinate } }
  )

export type ResponseType = EventType &
  (
    | { type: "cells"; content: { cells: string[] } }
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
        content: {}
      }
  )

export type RequestTypeWithId = RequestType & { id: string }
export type ResponseTypeWithId = ResponseType & { id: string }
