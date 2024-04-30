import Rule from "../lib/Rule.ts"

export const RULES_LIST = {
  Conway: new Rule(
    "Conway's Game of Life",
    "In Conway's Game of Life, a cell dies if it has fewer than 2 neighbors (underpopulation) or more than 3 neighbors (overpopulation). A dead cell becomes alive if it has exactly 3 neighbors (reproduction).",
    [0, 1, 4, 5, 6, 7, 8],
    [3],
  ),
  highLife: new Rule(
    "High Life",
    "In High Life, a cell dies if it has fewer than 2 neighbors (underpopulation) or more than 3 neighbors (overpopulation). A dead cell becomes alive if it has exactly 3 or 6 neighbors.",
    [0, 1, 4, 5, 7, 8],
    [3, 6],
  ),
  seeds: new Rule(
    "Seeds",
    "In Seeds, a dead cell becomes alive if it has exactly 2 neighbors. All live cells die in every generation.",
    [0, 1, 3, 4, 5, 6, 7, 8],
    [2],
  ),
  seeds2: new Rule(
    "Seeds 2",
    "In Seeds 2, a dead cell becomes alive if it has exactly 2 or 3 neighbors. All live cells die in every generation.",
    [0, 1, 4, 5, 6, 7, 8],
    [2, 3],
  ),
  lifeWithoutDeath: new Rule(
    "Life without Death",
    "In Life without Death, a cell stays alive if it has 1, 2, 3, 4, 5, 6, 7, or 8 neighbors. A dead cell becomes alive if it has exactly 3 neighbors.",
    [],
    [3],
  ),
  life34: new Rule(
    "34 Life",
    "In 34 Life, a cell stays alive if it has 3 or 4 neighbors, and a dead cell becomes alive if it has 3 or 4 neighbors.",
    [0, 1, 2, 5, 6, 7, 8],
    [3, 4],
  ),
  diamoeba: new Rule(
    "Diamoeba",
    "In Diamoeba, a cell dies if it has fewer than 5 neighbors or more than 8 neighbors. A dead cell becomes alive if it has exactly 3, 5, 6, 7, or 8 neighbors.",
    [0, 1, 3, 4, 5, 8],
    [3, 5, 6, 7, 8],
  ),
  twoByTwo: new Rule(
    "2x2",
    "In 2x2, a cell dies if it has exactly 2 or 3 neighbors. A dead cell becomes alive if it has exactly 3 or 6 neighbors.",
    [2, 3],
    [3, 6],
  ),
  maze: new Rule(
    "Maze",
    "In Maze, a cell dies if it has fewer than 1 or more than 5 neighbors. A dead cell becomes alive if it has exactly 3 neighbors.",
    [0, 6, 7, 8],
    [3],
  ),
  move: new Rule(
    "Move",
    "In Move, a cell dies if it has fewer than 2 or more than 6 neighbors. A dead cell becomes alive if it has exactly 3 neighbors.",
    [0, 1, 7, 8],
    [3],
  ),
  pseudoLife: new Rule(
    "Pseudo Life",
    "In Pseudo Life, a cell dies if it has fewer than 2 or more than 3 neighbors. A dead cell becomes alive if it has exactly 3 or 8 neighbors.",
    [0, 1, 4, 5, 6, 7, 8],
    [3, 8],
  ),
  walledCities: new Rule(
    "Walled Cities",
    "In Walled Cities, a cell dies if it has fewer than 4 or more than 5 neighbors. A dead cell becomes alive if it has exactly 4 or 5 neighbors.",
    [0, 1, 2, 3, 6, 7, 8],
    [4, 5],
  ),
  stains: new Rule(
    "Stains",
    "In Stains, a cell dies if it has fewer than 2 or more than 3 neighbors. A dead cell becomes alive if it has exactly 3 or 7 neighbors.",
    [0, 1, 4, 5, 6, 8],
    [3, 7],
  ),
  coagulations: new Rule(
    "Coagulations",
    "In Coagulations, a cell dies if it has fewer than 2 or more than 3 neighbors. A dead cell becomes alive if it has exactly 3, 7, or 8 neighbors.",
    [0, 1, 4, 5, 6],
    [3, 7, 8],
  ),
  dayAndNight: new Rule(
    "Day & Night",
    "In Day & Night, a cell dies if it has fewer than 3 or more than 6 neighbors. A dead cell becomes alive if it has exactly 3, 6, 7, or 8 neighbors.",
    [0, 1, 2, 4, 5, 8],
    [3, 6, 7, 8],
  ),
  anneal: new Rule(
    "Anneal",
    "In Anneal, a cell dies if it has fewer than 3 or more than 5 neighbors. A dead cell becomes alive if it has exactly 4, 6, or 7 neighbors.",
    [0, 1, 2, 6, 7, 8],
    [4, 6, 7],
  ),
  moveMirror: new Rule(
    "Move-Mirror",
    "In Move-Mirror, a cell dies if it has fewer than 1 or more than 7 neighbors. A dead cell becomes alive if it has exactly 3 or 5 neighbors.",
    [0, 2, 6, 8],
    [3, 5],
  ),
  longLife: new Rule(
    "Long Life",
    "In Long Life, a cell dies if it has fewer than 5 or more than 6 neighbors. A dead cell becomes alive if it has exactly 5 or 6 neighbors.",
    [0, 1, 2, 3, 4, 7, 8],
    [5, 6],
  ),
  ameoba: new Rule(
    "Ameoba",
    "In Ameoba, a cell dies if it has fewer than 5 or more than 8 neighbors. A dead cell becomes alive if it has exactly 3, 5, 7, or 8 neighbors.",
    [0, 1, 2, 4, 6, 8],
    [3, 5, 7, 8],
  ),
  replicator: new Rule(
    "Replicator",
    "In Replicator, a cell dies if it has an odd number of neighbors. A dead cell becomes alive if it has an even number of neighbors.",
    [1, 3, 5, 7],
    [0, 2, 4, 6, 8],
  ),
} as const
