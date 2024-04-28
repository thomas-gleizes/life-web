onmessage = (event) => {
  switch (event.data.type) {
    case "iterate":
      const result = run(event.data.cellsAlive, event.data.rule)
      postMessage({ type: "result", result })
      break
    default:
      console.error("Unknown message type", event.data.type)
  }
}

function getNeighbours(x: number, y: number): Set<string> {
  return new Set(
    [
      [x - 1, y - 1],
      [x - 1, y],
      [x - 1, y + 1],
      [x, y - 1],
      [x, y + 1],
      [x + 1, y - 1],
      [x + 1, y],
      [x + 1, y + 1],
    ].map((neighbour) => neighbour.join(",")),
  )
}

function run(cellsAlive: string[], rule: string) {
  const results = new Set<string>(cellsAlive)
  const cells = new Set<string>(cellsAlive)
  const deadCellsToChecks = new Set<string>()

  for (const cell of cells) {
    const [x, y] = cell.split(",").map(Number)
    const neighbours = getNeighbours(x, y)
    let aliveNeighbours = 0

    for (const neighbour of neighbours) {
      if (cells.has(neighbour)) {
        aliveNeighbours++
      } else {
        deadCellsToChecks.add(neighbour)
      }
    }

    switch (rule) {
      case "default":
        if (aliveNeighbours < 2 || aliveNeighbours > 3) {
          results.delete(cell)
        }
        break
      case "rule6":
        if ((aliveNeighbours < 2 || aliveNeighbours > 3) && aliveNeighbours !== 6) {
          results.delete(cell)
        }
        break
    }
  }

  for (const deadCell of deadCellsToChecks) {
    const [x, y] = deadCell.split(",").map(Number)
    const neighbours = getNeighbours(x, y)

    const aliveNeighbours = Array.from(neighbours).filter((neighbour) =>
      cells.has(neighbour),
    ).length

    if (aliveNeighbours === 3) {
      results.add(deadCell)
    }
  }

  return Array.from(results)
}
