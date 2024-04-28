import { displayNumber } from "../utils/displayNumber.ts"

export default class SettingsIndicator {
  static setCellCount(count: number) {
    const cellCount = document.getElementById("cell-count")!
    cellCount.textContent = displayNumber(count)
  }

  static setPlaying(playing: boolean) {
    const playButton = document.getElementById("play")!
    playButton.children.item(0)!.className = playing ? "fa fa-pause" : "fa fa-play"
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
    iterationElement.textContent = displayNumber(iteration)
  }

  static setCenter(x: number, y: number) {
    const centerElement = document.getElementById("center")!
    centerElement.textContent = `(${displayNumber(Math.floor(x))}, ${displayNumber(Math.floor(y))})`
  }

  static setPerformanceI(time: number) {
    const performanceElement = document.getElementById("perf-i")!
    performanceElement.textContent = `${time}`
  }

  static setPerformanceR(time: number) {
    const performanceElement = document.getElementById("perf-r")!
    performanceElement.textContent = `${time}`
  }

  static togglePatterList(display: boolean) {
    const element = document.getElementById("pattern-selector")!
    element.style.display = display ? "block" : "none"
  }

  static toggleWorker(worker: boolean) {
    const element = document.getElementById("use-worker")!
    element.firstElementChild!.className = worker ? "fa-solid fa-microchip" : "fa fa-user-tie"
  }
}
