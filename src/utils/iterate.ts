import Rule from "../lib/Rule.ts"
import { RULES_LIST } from "./constants.ts"

export async function iterate(
  currentAliveCells: Set<string>,
  rule: Rule = RULES_LIST.Conway,
): Promise<Set<string>> {
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
    if ((currentAliveCells.has(cell) && !rule.mustDie(count)) || rule.mustLive(count)) {
      newAliveCells.add(cell)
    }
  }

  return newAliveCells
}
