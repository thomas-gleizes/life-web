type Pattern = Array<[number, number]>

export default class PatternBuilder {
  public static toCells(pattern: Pattern, originX: number = 0, originY: number = 0): string[] {
    return pattern.map(([x, y]) => `${x + originX},${y + originY}`)
  }

  private static position(pattern: Pattern, originX: number, originY: number): Pattern {
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
    ...this.position(this.cubeX4, 1, 5),
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
    ...this.position(this.cubeX4, 35, 3),
  ]

  public static gliderGunX4: Pattern = [
    ...PatternBuilder.position(PatternBuilder.cubeX4, 4000, 4000),
    ...PatternBuilder.position(PatternBuilder.gliderGun, 1, 1),
    ...PatternBuilder.position(PatternBuilder.symetricY(PatternBuilder.gliderGun), 1, -1),
    ...PatternBuilder.position(PatternBuilder.symetricX(PatternBuilder.gliderGun), -1, 1),
    ...PatternBuilder.position(
      PatternBuilder.symetricX(PatternBuilder.symetricY(PatternBuilder.gliderGun)),
      -1,
      -1,
    ),
  ]

  public static beacon: Pattern = [
    [0, 0],
    [1, 0],
    [0, 1],
    [3, 2],
    [2, 3],
    [3, 3],
  ]

  public static pulsar: Pattern = [
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

  public static lwss: Pattern = [
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
