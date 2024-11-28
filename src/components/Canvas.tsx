import { createRef, FC, useRef } from "preact/compat"

import { AppProcessor } from "../lib/AppProcessor.ts"
import { useEvent } from "../hooks/useEvent.ts"

type State = {
  center: { x: number; y: number }
  scale: number
  zoom: number
  width: number
  height: number
  cells: string[]
}

const MAX_ZOOM = 100
const MIN_ZOOM = 0
const DEFAULT_SCALE = 2

export const Canvas: FC<{ appProcessor: AppProcessor }> = ({ appProcessor }) => {
  const context = createRef<CanvasRenderingContext2D>()
  const state = useRef<State>({
    center: { x: 500, y: 500 },
    scale: 15,
    zoom: 50,
    width: 100,
    height: 100,
    cells: [],
  })

  function render() {
    if (!context.current) return

    context.current.clearRect(0, 0, state.current.width, state.current.height)

    const rectWidth = state.current.scale
    const border = rectWidth / 10
    const padding = border / 2
    const rectSize = rectWidth - border

    for (const cell of state.current.cells) {
      const [x, y] = cell.split(",").map(Number)
      const rectX = x * state.current.scale + state.current.center.x
      const rectY = y * state.current.scale + state.current.center.y

      context.current.fillStyle = "white"
      context.current.fillRect(rectX + padding, rectY + padding, rectSize, rectSize)
    }
  }

  const handleRef = (canvas: HTMLCanvasElement | null) => {
    if (!canvas) return

    canvas.width = state.current.width = window.innerWidth
    canvas.height = state.current.height = window.innerHeight
    state.current.center.x = state.current.width / 2
    state.current.center.y = state.current.height / 2

    context.current = canvas.getContext("2d")

    if (!context) return

    setInterval(async () => {
      const { cells } = await appProcessor.getCells()
      state.current.cells = cells
      render()
    }, 1000 / 30)
  }

  useEvent("keydown", (event) => {
    switch (event.key) {
      case " ":
        break
      case "ArrowUp":
        state.current.center.y -= state.current.scale
        break
      case "ArrowDown":
        state.current.center.y += state.current.scale
        break
      case "ArrowRight":
        state.current.center.x += state.current.scale
        break
      case "ArrowLeft":
        state.current.center.x -= state.current.scale
        break
    }

    render()
  })

  useEvent("wheel", (event) => {
    const oldScale = state.current.scale
    const scaleRatio = state.current.scale / oldScale

    state.current.center.x = event.clientX - scaleRatio * (event.clientX - state.current.center.x)
    state.current.center.y = event.clientY - scaleRatio * (event.clientY - state.current.center.y)

    if (event.deltaY < 0) state.current.zoom += 1
    else state.current.zoom -= 1

    state.current.zoom = Math.max(0, Math.min(100, state.current.zoom))
    let scale = 2

    for (let i = 0; i < state.current.zoom; i++) scale *= 1.09

    state.current.scale = scale
    render()
  })

  return <canvas ref={handleRef} className="" />
}
