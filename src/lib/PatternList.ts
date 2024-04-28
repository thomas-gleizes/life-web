import Pattern, { CellPattern } from "./Pattern.ts"

export default class PatternList {
  public static cubeX4: CellPattern = [
    [0, 0],
    [1, 0],
    [0, 1],
    [1, 1],
  ]

  public static cubeX9: CellPattern = [...this.cubeX4, [2, 0], [0, 2], [2, 2], [1, 2], [2, 1]]

  public static barX3: CellPattern = [
    [0, 0],
    [0, 1],
    [0, 2],
  ]

  public static glider: CellPattern = [
    [0, 0],
    [1, 0],
    [2, 0],
    [2, 1],
    [1, 2],
  ]

  public static gliderGun: CellPattern = [
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

  public static beacon: CellPattern = [
    [0, 0],
    [1, 0],
    [0, 1],
    [3, 2],
    [2, 3],
    [3, 3],
  ]

  public static pulsar: CellPattern = [
    [4, 2],
    [5, 2],
    [6, 2],
    [10, 2],
    [11, 2],
    [12, 2],
    [2, 4],
    [7, 4],
    [9, 4],
    [14, 4],
    [2, 5],
    [7, 5],
    [9, 5],
    [14, 5],
    [2, 6],
    [7, 6],
    [9, 6],
    [14, 6],
    [4, 7],
    [5, 7],
    [6, 7],
    [10, 7],
    [11, 7],
    [12, 7],
    [4, 9],
    [5, 9],
    [6, 9],
    [10, 9],
    [11, 9],
    [12, 9],
    [2, 10],
    [7, 10],
    [9, 10],
    [14, 10],
    [2, 11],
    [7, 11],
    [9, 11],
    [14, 11],
    [2, 12],
    [7, 12],
    [9, 12],
    [14, 12],
    [4, 14],
    [5, 14],
    [6, 14],
    [10, 14],
    [11, 14],
    [12, 14],
  ]

  public static lwss: CellPattern = [
    [1, 0],
    [4, 0],
    [0, 1],
    [0, 2],
    [4, 2],
    [0, 3],
    [1, 3],
    [2, 3],
    [3, 3],
  ]
}
