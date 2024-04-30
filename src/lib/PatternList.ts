import Pattern, { CellPattern } from "./Pattern.ts"

export default class PatternList {
  public static cubeX4: CellPattern[] = [
    [0, 0],
    [1, 0],
    [0, 1],
    [1, 1],
  ]

  public static cubeX9: CellPattern[] = [...this.cubeX4, [2, 0], [0, 2], [2, 2], [1, 2], [2, 1]]

  public static blinker: CellPattern[] = [
    [0, 0],
    [1, 0],
    [2, 0],
  ]

  public static glider: CellPattern[] = [
    [0, 0],
    [1, 0],
    [2, 0],
    [2, 1],
    [1, 2],
  ]

  public static gliderGun: CellPattern[] = [
    ...new Pattern(this.cubeX4).setOrigin(1, 5).getCells(),
    // left part
    [11, 5],
    [11, 6],
    [11, 7],
    [12, 8],
    [13, 9],
    [14, 9],
    [12, 4],
    [13, 3],
    [14, 3],
    [15, 6],
    [16, 4],
    [16, 8],
    [17, 5],
    [17, 6],
    [17, 7],
    [18, 6],
    //right part
    [21, 5],
    [21, 4],
    [21, 3],
    [22, 5],
    [22, 4],
    [22, 3],
    [23, 6],
    [23, 2],
    [25, 6],
    [25, 7],
    [25, 2],
    [25, 1],
    ...new Pattern(this.cubeX4).setOrigin(35, 3).getCells(),
  ]

  public static beacon: CellPattern[] = [
    [0, 0],
    [1, 0],
    [0, 1],
    [3, 2],
    [2, 3],
    [3, 3],
  ]

  public static pulsar: CellPattern[] = [
    [2, 0],
    [3, 0],
    [4, 0],
    [8, 0],
    [9, 0],
    [10, 0],
    [0, 2],
    [5, 2],
    [7, 2],
    [12, 2],
    [0, 3],
    [5, 3],
    [7, 3],
    [12, 3],
    [0, 4],
    [5, 4],
    [7, 4],
    [12, 4],
    [2, 5],
    [3, 5],
    [4, 5],
    [8, 5],
    [9, 5],
    [10, 5],
    [2, 7],
    [3, 7],
    [4, 7],
    [8, 7],
    [9, 7],
    [10, 7],
    [0, 8],
    [5, 8],
    [7, 8],
    [12, 8],
    [0, 9],
    [5, 9],
    [7, 9],
    [12, 9],
    [0, 10],
    [5, 10],
    [7, 10],
    [12, 10],
    [2, 12],
    [3, 12],
    [4, 12],
    [8, 12],
    [9, 12],
    [10, 12],
  ]
}
