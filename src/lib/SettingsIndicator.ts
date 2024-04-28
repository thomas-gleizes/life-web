export default class SettingsIndicator {
  static setCellCount(count: number) {
    const cellCount = document.getElementById("cell-count")!
    cellCount.textContent = count.toString()
  }

  static setPlaying(playing: boolean) {
    const playButton = document.getElementById("play")!
    playButton.textContent = playing ? "Pause" : "Play"
  }

  static setDelay(delay: number) {
    const delayElement = document.getElementById("speed")! as HTMLInputElement
    delayElement.value = delay.toString()
  }

  static setScale(scale: number) {
    const scaleElement = document.getElementById("scale")! as HTMLInputElement
    scaleElement.value = scale.toString()
  }

  static setIteration(iteration: number) {
    const iterationElement = document.getElementById("iterate-count")!
    iterationElement.textContent = iteration.toString()
  }

  static setCenter(x: number, y: number) {
    const centerElement = document.getElementById("center")!
    centerElement.textContent = `(${x.toFixed(2)}, ${y.toFixed(2)})`
  }

  static setPerformanceI(time: number) {
    const performanceElement = document.getElementById("perf-i")!
    performanceElement.textContent = `${time}`
  }

  static setPerformanceR(time: number) {
    const performanceElement = document.getElementById("perf-r")!
    performanceElement.textContent = `${time}`
  }
}