type Pattern = Array<[number, number]>

export default class PatternBuilder {
  public static formate(pattern: Pattern, originX: number = 0, originY: number = 0): string[] {
    return pattern.map(([x, y]) => `${x + originX},${y + originY}`)
  }

  private static ordinate(pattern: Pattern, originX: number, originY: number): Pattern {
    return pattern.map(([x, y]) => [x + originX, y + originY])
  }

  public static symetricY(pattern: Pattern): Pattern {
    return pattern.map(([x, y]) => [x, -y])
  }

  public static symetricX(pattern: Pattern): Pattern {
    return pattern.map(([x, y]) => [-x, y])
  }

  public static cubeX4: Pattern = [
    [0, 0],
    [1, 0],
    [0, 1],
    [1, 1],
  ]

  public static cubeX9: Pattern = [...this.cubeX4, [2, 0], [0, 2], [2, 2], [1, 2], [2, 1]]

  public static barHX3: Pattern = [
    [0, 0],
    [1, 0],
    [2, 0],
  ]

  public static barVX3: Pattern = [
    [0, 0],
    [0, 1],
    [0, 2],
  ]

  public static glider: Pattern = [
    [0, 0],
    [1, 0],
    [2, 0],
    [2, 1],
    [1, 2],
  ]

  public static gliderGun: Pattern = [
    ...this.ordinate(this.cubeX4, 1, 5),
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
    ...this.ordinate(this.cubeX4, 35, 3),
  ]
}
