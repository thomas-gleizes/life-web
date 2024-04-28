export async function iterate(currentAliveCells: Set<string>): Promise<Set<string>> {
  const neighborCounts = new Map()

  for (const cell of currentAliveCells) {
    const [x, y] = cell.split(",").map(Number)
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        if (dx !== 0 || dy !== 0) {
          const neighbor = [x + dx, y + dy].join(",")
          const count = neighborCounts.get(neighbor) || 0
          neighborCounts.set(neighbor, count + 1)
        }
      }
    }
  }

  const newAliveCells = new Set<string>()

  for (const [cell, count] of neighborCounts.entries()) {
    if (count === 3 || (count === 2 && currentAliveCells.has(cell))) {
      newAliveCells.add(cell)
    }
  }

  return newAliveCells
}
