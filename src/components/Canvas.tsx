import { createRef, FC, useRef } from "preact/compat"

import { AppProcessor } from "../lib/AppProcessor.ts"
import { useEvent } from "../hooks/useEvent.ts"
import { ArrayValues } from "../utils/ArrayValues.ts"

type State = {
  center: { x: number; y: number }
  scale: ArrayValues<number>
  width: number
  height: number
  cells: string[]
}

const SCALES = [0.1, 0.2, 0.5, 1, 2, 5, 10, 15, 20, 50]

export const Canvas: FC<{ appProcessor: AppProcessor }> = ({ appProcessor }) => {
  const context = createRef<CanvasRenderingContext2D>()
  const state = useRef<State>({
    center: { x: 500, y: 500 },
    scale: new ArrayValues(SCALES, SCALES.length - 1),
    width: 100,
    height: 100,
    cells: [],
  })

  function render() {
    if (!context.current) return

    console.log("render")

    const scale = state.current.scale.getCurrent()

    context.current.clearRect(0, 0, state.current.width, state.current.height)

    const rectWidth = scale
    const border = rectWidth / 10
    const padding = border / 2
    const rectSize = rectWidth - border

    for (const cell of state.current.cells) {
      const [x, y] = cell.split(",").map(Number)
      const rectX = x * scale + state.current.center.x
      const rectY = y * scale + state.current.center.y

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
        state.current.center.y -= state.current.scale.getCurrent()
        break
      case "ArrowDown":
        state.current.center.y += state.current.scale.getCurrent()
        break
      case "ArrowRight":
        state.current.center.x += state.current.scale.getCurrent()
        break
      case "ArrowLeft":
        state.current.center.x -= state.current.scale.getCurrent()
        break
    }

    render()
  })

  useEvent("wheel", (event) => {
    const oldScale = state.current.scale.getCurrent()

    if (event.deltaY < 0) state.current.scale.next()
    else state.current.scale.previous()

    const scaleRatio = state.current.scale.getCurrent() / oldScale

    state.current.center.x = event.clientX - scaleRatio * (event.clientX - state.current.center.x)
    state.current.center.y = event.clientY - scaleRatio * (event.clientY - state.current.center.y)

    render()
  })

  return <canvas ref={handleRef} className="" />
}
