import { FC, useEffect, useRef } from "react"

import { AppProcessor } from "../lib/AppProcessor"
import { useEvent } from "../hooks/useEvent"
import { ArrayValues } from "../utils/ArrayValues"
import { RangeC } from "../types"
import { round } from "../utils/helpers"

type State = {
  origin: { x: number; y: number }
  scale: ArrayValues<number>
  width: number
  height: number
  cells: string[]
  mouse: { isDown: boolean; x: number; y: number; downAt: null | number }
}

const SCALES = [
  0.1, 0.175, 0.25, 0.375, 0.5, 0.75, 1, 1.75, 2, 2.5, 3.75, 5, 7.5, 10, 17.5, 25, 37.5, 50,
]

const FRAME_RATE = 25

export const Canvas: FC<{ appProcessor: AppProcessor }> = ({ appProcessor }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const context = useRef<CanvasRenderingContext2D>()

  const state = useRef<State>({
    origin: { x: 0, y: 0 },
    scale: new ArrayValues(SCALES, 13),
    width: 100,
    height: 100,
    cells: [],
    mouse: { x: 0, y: 0, isDown: false, downAt: null },
  })

  function getRange(): RangeC {
    const scale = state.current.scale.getCurrent()

    return {
      coordinate: [
        round(-state.current.origin.x / scale, 2),
        round(-state.current.origin.y / scale, 2),
      ],
      width: round(state.current.width / scale, 2),
      height: round(state.current.height / scale, 2),
    }
  }

  function render() {
    if (!context.current) return

    const scale = state.current.scale.getCurrent()

    context.current.clearRect(0, 0, state.current.width, state.current.height)

    const rectWidth = scale
    const border = rectWidth / 10
    const padding = border / 2
    const rectSize = rectWidth - border

    for (const cell of state.current.cells) {
      const [x, y] = cell.split(",").map(Number)

      const rectX = x * scale + state.current.origin.x
      const rectY = y * scale + state.current.origin.y

      context.current.fillStyle = "white"
      context.current.fillRect(rectX + padding, rectY + padding, rectSize, rectSize)
    }
  }

  const handlePointerDown = (event: PointerEvent) => {
    state.current.mouse.isDown = true
    state.current.mouse.downAt = Date.now()
  }

  const handlePointerMove = (event: PointerEvent) => {
    if (state.current.mouse.isDown) {
      const dx = event.clientX - state.current.mouse.x
      const dy = event.clientY - state.current.mouse.y

      state.current.origin.x += dx
      state.current.origin.y += dy

      render()
    }

    state.current.mouse.x = event.clientX
    state.current.mouse.y = event.clientY
  }

  const handlePointerUp = (event: PointerEvent) => {
    if (Date.now() - state.current.mouse.downAt! < 200) {
      const scale = state.current.scale.getCurrent()

      appProcessor
        .toggleCell([
          Math.floor(event.clientX / scale + state.current.origin.x),
          Math.floor(event.clientY / scale + state.current.origin.y),
        ])
        .then(console.log)
    }

    state.current.mouse.isDown = false
    state.current.mouse.downAt = null
  }

  useEvent("pointerdown", handlePointerDown, canvasRef.current)
  useEvent("pointermove", handlePointerMove, canvasRef.current)
  useEvent("pointerup", handlePointerUp, canvasRef.current)

  useEvent(
    "keydown",
    (event) => {
      switch (event.key) {
        case "ArrowUp":
          state.current.origin.y += state.current.height / 10
          break
        case "ArrowDown":
          state.current.origin.y -= state.current.height / 10
          break
        case "ArrowRight":
          state.current.origin.x -= state.current.width / 10
          break
        case "ArrowLeft":
          state.current.origin.x += state.current.width / 10
          break
      }

      render()
    },
    canvasRef.current,
  )

  useEvent(
    "click",
    (event) => {
      console.log("Click", event)
    },
    canvasRef.current,
  )

  useEvent(
    "wheel",
    (event) => {
      const oldScale = state.current.scale.getCurrent()

      if (event.deltaY < 0) state.current.scale.next()
      else state.current.scale.previous()

      const scaleRatio = state.current.scale.getCurrent() / oldScale

      state.current.origin.x = event.clientX - scaleRatio * (event.clientX - state.current.origin.x)
      state.current.origin.y = event.clientY - scaleRatio * (event.clientY - state.current.origin.y)

      render()
    },
    canvasRef.current,
  )

  useEvent("resize", () => {
    if (!context.current) return

    context.current.canvas.width = state.current.width = window.innerWidth
    context.current.canvas.height = state.current.height = window.innerHeight

    render()
  })

  useEffect(() => {
    if (!canvasRef.current) return
    canvasRef.current.width = state.current.width = window.innerWidth
    canvasRef.current.height = state.current.height = window.innerHeight

    const canvasRenderingContext2D = canvasRef.current.getContext("2d")

    if (!canvasRenderingContext2D) return

    context.current = canvasRenderingContext2D

    const interval = setInterval(async () => {
      const { cells } = await appProcessor.getCells(getRange())
      state.current.cells = cells

      render()
    }, 1000 / FRAME_RATE)

    return () => clearInterval(interval)
  }, [])

  return <canvas ref={canvasRef} className="block" />
}
