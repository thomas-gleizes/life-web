export class ArrayValues<T = unknown> {
  constructor(private _values: T[], private _currentIndex: number = 0) {}

  get values() {
    return this._values
  }

  public next(): T {
    if (this._currentIndex < this._values.length - 1) {
      this._currentIndex++
    }

    return this._values[this._currentIndex]
  }

  public previous(): T {
    if (this._currentIndex > 0) {
      this._currentIndex--
    }

    return this._values[this._currentIndex]
  }

  public getCurrent(): T {
    return this._values[this._currentIndex]
  }
}
