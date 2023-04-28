import React, { useEffect, useRef } from "react"
import { Game } from "./lib/Game.ts"

const App = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const gameRef = useRef<Game>()

  useEffect(() => {
    console.log("CanvasRef", canvasRef)
    if (canvasRef.current) {
      gameRef.current = new Game(canvasRef.current, {
        timeout: 10,
        cellWidth: 6,
        cellHeight: 0.2,
      })
      gameRef.current.run()
    }
  }, [])

  return (
    <>
      <canvas id="game-of-life" ref={canvasRef}></canvas>
    </>
  )
}

export default App
