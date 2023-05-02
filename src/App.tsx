import React, { useEffect, useRef, useState } from "react"
import { Game } from "./lib/Game.ts"
import PauseIcon from "./assets/icons/pause.svg"
import PlayIcon from "./assets/icons/play.svg"
import PlusIcon from "./assets/icons/plus.svg"
import MinusIcon from "./assets/icons/minus.svg"

const App = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const gameRef = useRef<Game>()

  const [isPlaying, setPlayling] = useState<boolean>(true)
  const [speed, setSpeed] = useState<number>(0)

  useEffect(() => {
    console.log("CanvasRef", canvasRef)
    if (canvasRef.current && !(gameRef.current instanceof Game)) {
      gameRef.current = new Game(canvasRef.current, {
        timeout: 10,
        cellWidth: 0.9,
        cellHeight: 0.9,
      })
      gameRef.current.run()

      setPlayling(gameRef.current.isPlaying())
      setSpeed(gameRef.current.getSpeed())
    }
  }, [])

  const handleTogglePlay = () => {
    if (gameRef.current instanceof Game) {
      gameRef.current.togglePlay()
      setPlayling(gameRef.current.isPlaying())
    }
  }

  const handleIncreaseSpeed = () => {
    if (gameRef.current instanceof Game) {
      setSpeed(gameRef.current?.increaseSpeed())
    }
  }

  const handleDecreaseSpeed = () => {
    if (gameRef.current instanceof Game) {
      setSpeed(gameRef.current.decreaseSpeed())
    }
  }

  return (
    <>
      <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full bg-black"></canvas>
      <div className="fixed top-2 left-2 bg-white p-2 rounded-lg">
        <div className="flex space-x-4">
          <div>
            <button className="flex justify-center items-center" onClick={handleTogglePlay}>
              {isPlaying ? <PauseIcon /> : <PlayIcon />}
            </button>
          </div>
          <div className="flex space-x-2 items-center">
            <div>Speed: {speed}ms</div>
            <button onClick={handleDecreaseSpeed}>
              <MinusIcon />
            </button>
            <button onClick={handleIncreaseSpeed}>
              <PlusIcon />
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default App
