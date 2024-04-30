import { iterate } from "../utils/iterate.ts"
import Rule from "../lib/Rule.ts"

onmessage = (event) => {
  switch (event.data.type) {
    case "iterate":
      iterate(event.data.cellsAlive, Rule.createFromObject(event.data.rule)).then((result) => {
        postMessage({ type: "result", result })
      })
      break
    default:
      console.error("Unknown message type", event.data.type)
  }
}
