import Game from "../lib/Game.ts"
import Pattern from "../lib/Pattern.ts"
import Rule from "../lib/Rule.ts"

type Resp = {
  type: string
  data: any
}

const game = new Game()

onmessage = async (event) => {
  const { type, message: data } = event.data
  const response: Resp = { type, data: null }

  switch (type) {
    case "addPattern":
      game.addPattern(Pattern.fromJSON(data.pattern), data.x, data.y)
      break
    case "clear":
      game.clear()
      break
    case "reset":
      game.reset()
      break
    case "rule":
      game.setRule(Rule.fromJSON(data.rule))
      break
    case "toggleLife":
      game.toggleCell(data.x, data.y)
      break
    case "iterate":
      await game.iterate()
      response.data = { iteration: game.iteration, cells: game.cellsAlive }
      break
  }

  postMessage(response)
}
