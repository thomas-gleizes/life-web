export default class Rule {
  private readonly _name: string
  private readonly _description: string
  private readonly _neighborToDead: number[]
  private readonly _neighborToAlive: number[]

  constructor(
    name: string,
    description: string,
    neighborToDead: number[],
    neighborToAlive: number[],
  ) {
    this._name = name
    this._description = description
    this._neighborToDead = neighborToDead ?? []
    this._neighborToAlive = neighborToAlive ?? []
  }

  static createFromObject(obj: {
    name: string
    description: string
    neighborToDead: number[]
    neighborToAlive: number[]
  }): Rule {
    return new Rule(obj.name, obj.description, obj.neighborToDead, obj.neighborToAlive)
  }

  get name(): string {
    return this._name
  }

  get description(): string {
    return this._description
  }

  mustDie(count: number): boolean {
    return this._neighborToDead.includes(count)
  }

  mustLive(count: number): boolean {
    return this._neighborToAlive.includes(count)
  }

  toObject(): {
    name: string
    description: string
    neighborToDead: number[]
    neighborToAlive: number[]
  } {
    return {
      name: this._name,
      description: this._description,
      neighborToDead: this._neighborToDead,
      neighborToAlive: this._neighborToAlive,
    }
  }
}
