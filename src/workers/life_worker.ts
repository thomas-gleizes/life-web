import LifeProcessor from "../lib/LifeProcessor"
import { RequestTypeWithId } from "../types"

const lifeProcessor = new LifeProcessor()

void lifeProcessor.start()

onmessage = async (event: MessageEvent<RequestTypeWithId>) => {
  const { id, ...data } = event.data

  const response = await lifeProcessor.handleEvent(data)
  const responseWithId = { ...response, id: event.data.id }

  postMessage(responseWithId)
}
