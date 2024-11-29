import { FC } from "preact/compat"
import { useState } from "preact/hooks"

import { AppProcessor } from "../lib/AppProcessor.ts"
import { useEvent } from "../hooks/useEvent.ts"

const DELAY_RANGE = [1, 2, 5, 10, 25, 50, 100, 250, 500, 1000]

export const ToolBar: FC<{ appProcessor: AppProcessor }> = ({ appProcessor }) => {
  const [currentIndex, setCurrentIndex] = useState<number>(5)
  const [isRunning, setIsRunning] = useState<boolean>(appProcessor.isRunning)

  const handleDelay = (index: number) => {
    if (
      (index === -1 && currentIndex > 0) ||
      (index === 1 && currentIndex < DELAY_RANGE.length - 1)
    ) {
      setCurrentIndex(currentIndex + index)
      appProcessor.setDelay(DELAY_RANGE[currentIndex + index])
    }
  }

  const toggleRunning = () => {
    appProcessor.isRunning
      ? appProcessor.stop().then(setIsRunning)
      : appProcessor.start().then(setIsRunning)
  }

  useEvent("keydown", (event) => {
    switch (event.key) {
      case " ":
        toggleRunning()
        break
    }
  })

  return (
    <div className="absolute flex items-center space-x-2 px-2 top-4 left-4 bg-black bg-opacity-30 backdrop-blur-lg text-white rounded-2xl p-2">
      <div className="flex">
        <button
          onClick={() => toggleRunning()}
          className="bg-red-800 h-8 w-8 flex justify-center items-center rounded-l-md"
        >
          {isRunning ? (
            <i className="fa fa-pause text-1xl" />
          ) : (
            <i className="fa fa-play text-1xl" />
          )}
        </button>
        <button
          onClick={() => appProcessor.clear()}
          className="bg-red-800 h-8 w-8 flex justify-center items-center"
        >
          <i className="fa fa-trash text-1xl" />
        </button>
        <button
          onClick={() => appProcessor.reset()}
          className="bg-red-800 h-8 w-8 flex justify-center items-center"
        >
          <i className="fa fa-rotate-left text-1xl" />
        </button>
        <button
          onClick={() => appProcessor.save()}
          className="bg-red-800 h-8 w-8 flex justify-center items-center rounded-r-md"
        >
          <i className="fa-solid fa-floppy-disk text-1xl" />
        </button>
      </div>
      <div className="flex items-center">
        <button
          onClick={() => handleDelay(-1)}
          className="bg-red-800 h-8 w-8 flex justify-center items-center rounded-l-md"
        >
          <i className="fa fa-minus text-1xl" />
        </button>
        <div className="w-20 h-full text-center bg-white text-black font-semibold text-lg">
          {DELAY_RANGE[currentIndex]}ms
        </div>
        <button
          onClick={() => handleDelay(1)}
          className="bg-red-800 h-8 w-8 flex justify-center items-center rounded-r-md"
        >
          <i className="fa fa-plus text-1xl" />
        </button>
      </div>
    </div>
  )
}
