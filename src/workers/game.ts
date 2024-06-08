import GameProcessor from "../lib/GameProcessor.ts"
import { RequestType, RequestTypeWithId } from "../types"

const gameProcessor = new GameProcessor()

void gameProcessor.start()

onmessage = async (event: MessageEvent<RequestTypeWithId>) => {
  const data: RequestType = event.data
  const response = await gameProcessor.handleEvent(data)
  const responseWithId = { ...response, id: event.data.id }

  postMessage(responseWithId)
}
