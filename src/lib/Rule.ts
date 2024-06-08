export default class Rule {
  private readonly _name: string
  private readonly _description: string
  private readonly _neighborToSurvive: number[]
  private readonly _neighborToBorn: number[]

  constructor(
    name: string,
    description: string,
    neighborToSurvive: number[],
    neighborToBorn: number[],
  ) {
    this._name = name
    this._description = description
    this._neighborToSurvive = neighborToSurvive ?? []
    this._neighborToBorn = neighborToBorn ?? []
  }

  get name(): string {
    return this._name
  }

  get description(): string {
    return this._description
  }

  mustSurvive(count: number): boolean {
    return this._neighborToSurvive.includes(count)
  }

  mustBorn(count: number): boolean {
    return this._neighborToBorn.includes(count)
  }

  toJson(): {
    name: string
    description: string
    neighborToDead: number[]
    neighborToAlive: number[]
  } {
    return {
      name: this._name,
      description: this._description,
      neighborToDead: this._neighborToSurvive,
      neighborToAlive: this._neighborToBorn,
    }
  }

  static fromJSON(obj: any): Rule {
    return new Rule(obj.name, obj.description, obj.neighborToDead, obj.neighborToAlive)
  }
}
