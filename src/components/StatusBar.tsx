import { FC, useEffect, useRef, useState } from "react"
import { AppProcessor } from "../lib/AppProcessor"
import { formatNumberWithSpaces } from "../utils/helpers"

export const StatusBar: FC<{ appProcessor: AppProcessor }> = ({ appProcessor }) => {
  const isFree = useRef<boolean>(true)

  const [info, setInfo] = useState<Awaited<ReturnType<AppProcessor["getInfo"]>>>({
    cellsAlive: 0,
    lastIteration: 0,
  })

  useEffect(() => {
    const interval = setInterval(() => {
      if (isFree) {
        isFree.current = false

        appProcessor
          .getInfo()
          .then(setInfo)
          .catch(console.warn)
          .finally(() => (isFree.current = true))
      } else console.log("BUSY")
    }, 500)

    return () => clearInterval(interval)
  })

  return (
    <ul className="absolute flex space-x-2 px-2 bottom-4 left-4 bg-black bg-opacity-30 backdrop-blur-lg text-white rounded-sm p-2">
      <li>Alive = {formatNumberWithSpaces(info?.cellsAlive)}</li>
      <li>I = {formatNumberWithSpaces(info?.lastIteration)}ms</li>
    </ul>
  )
}

