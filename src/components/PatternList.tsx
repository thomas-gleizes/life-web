import { useEffect, useRef, useState } from "preact/hooks"

import Pattern from "../lib/Pattern.ts"
import { PATTERNS_LIST } from "../utils/constants.ts"

function PatternC({
  pattern: patternP,
  onClick,
}: {
  pattern: Pattern
  onClick: (pattern: Pattern) => void
}) {
  const canvas = useRef<HTMLCanvasElement>(null)
  const pattern = useRef<Pattern>(patternP.clone())

  function drawPattern(canvas: HTMLCanvasElement) {
    canvas.width = canvas.clientWidth
    canvas.height = canvas.clientHeight

    const context = canvas.getContext("2d")!

    const size = pattern.current.getSize()
    const scale = Math.min(canvas.width / size[0], canvas.height / size[1]) * 0.8

    context.clearRect(0, 0, canvas.width, canvas.height)

    for (const [x, y] of pattern.current.getCells()) {
      const rectX = x * scale + (canvas.width / 2 - (size[0] * scale) / 2)
      const rectY = y * scale + (canvas.height / 2 - (size[1] * scale) / 2)
      const rectWidth = scale
      const border = rectWidth / 10

      context.fillStyle = "white"
      context.fillRect(
        rectX + border / 2,
        rectY + border / 2,
        rectWidth - border,
        rectWidth - border,
      )
    }
  }

  useEffect(() => {
    const interval = setInterval(() => {
      if (!canvas.current) return

      drawPattern(canvas.current)

      clearInterval(interval)
    })
  }, [])

  useEffect(() => {
    const listener = () => {
      if (!canvas.current) return

      drawPattern(canvas.current)
    }

    window.addEventListener("resize", listener)

    return () => {
      window.removeEventListener("resize", listener)
    }
  }, [])

  const handleClick = () => {
    onClick(pattern.current)
  }

  const handleRotate = () => {
    pattern.current.rotateLeft().toZeros()
    drawPattern(canvas.current!)
  }

  const handleX = () => {
    pattern.current.symmetricX().toZeros()
    drawPattern(canvas.current!)
  }

  const handleY = () => {
    pattern.current.symmetricY().toZeros()
    drawPattern(canvas.current!)
  }

  return (
    <div>
      <div className="pattern-head">
        <h4>{pattern.current.name}</h4>
        <div className="pattern-action">
          <button onClick={handleRotate}>
            <i className="fa fa-rotate-left"></i>
          </button>
          <button onClick={handleX}>
            <i className="fa fa-x"></i>
          </button>
          <button onClick={handleY}>
            <i className="fa fa-y"></i>
          </button>
        </div>
      </div>
      <div onClick={handleClick}>
        <canvas ref={canvas}></canvas>
      </div>
    </div>
  )
}

export default function PatternList({ onClick }: { onClick: (pattern: Pattern) => void }) {
  const [patterns, setPatterns] = useState<Pattern[]>([...Object.values(PATTERNS_LIST)])

  const handleFile = (event: Event) => {
    const input = event.target as HTMLInputElement
    const file = input.files![0]

    const reader = new FileReader()

    reader.onload = function (e) {
      const content = e.target!.result as string
      const pattern = Pattern.parse(content)
      pattern.name = file.name.replace(".rle", "")

      setPatterns((patterns) => [pattern, ...patterns])

      input.value = ""
    }

    reader.readAsText(file)
  }

  return (
    <div>
      <div>
        <input type="file" className="btn" accept=".rle" onInput={handleFile}>
          Importer
        </input>
      </div>
      {patterns.map((pattern, index) => (
        <PatternC key={pattern.name + index} pattern={pattern} onClick={onClick} />
      ))}
    </div>
  )
}
