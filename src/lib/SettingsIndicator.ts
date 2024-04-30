import { displayNumber } from "../utils/displayNumber.ts"
import { RULES_LIST } from "../utils/constants.ts"
import PatternList from "./PatternList.ts"

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

  static toggleMenu() {
    const element = document.getElementById("menu")!
    console.log("Element.style.right", element.style.right)
    element.style.right = element.style.right !== "0px" ? "0px" : "-40vw"
  }

  static toggleWorker(worker: boolean) {
    const element = document.getElementById("use-worker")!
    element.firstElementChild!.className = worker ? "fa-solid fa-microchip" : "fa fa-user-tie"
  }

  static setUpRulesSelect() {
    const select = document.getElementById("rule")! as HTMLSelectElement
    for (const rule of Object.entries(RULES_LIST)) {
      const option = document.createElement("option")
      option.value = rule[0]
      option.textContent = rule[1].name
      select.appendChild(option)
    }
  }

  static setupPatternList() {}
}
