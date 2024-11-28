import { signal, effect } from "@preact/signals"
import { FC } from "preact/compat"
import { AppProcessor } from "../lib/AppProcessor.ts"

const cellsAlive = signal(NaN)
const lastIterationTime = signal(NaN)

export const StatusBar: FC<{ appProcessor: AppProcessor }> = ({ appProcessor }) => {
  effect(() => {
    const interval = setTimeout(() => {
      appProcessor.getInfo().then((info) => {
        cellsAlive.value = info.cellsAlive
        lastIterationTime.value = info.lastIteration
      })
    }, 1000)

    return () => clearInterval(interval)
  })

  return (
    <div className="absolute flex space-x-2 px-2 bottom-4 left-4 bg-black bg-opacity-30 backdrop-blur-lg text-white rounded-2xl p-2">
      <div>Alive = {cellsAlive.value}</div>
      <div>I = {lastIterationTime.value}ms</div>
    </div>
  )
}
