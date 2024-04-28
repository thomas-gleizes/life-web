import { iterate } from "../utils/iterate.ts"

onmessage = (event) => {
  switch (event.data.type) {
    case "iterate":
      iterate(new Set(event.data.cellsAlive)).then((result) => {
        postMessage({ type: "result", result })
      })
      break
    default:
      console.error("Unknown message type", event.data.type)
  }
}
