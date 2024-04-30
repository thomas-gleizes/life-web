import { displayNumber } from "../utils/displayNumber.ts"
import { PATTERNS_LIST, RULES_LIST } from "../utils/constants.ts"
import Pattern from "./Pattern.ts"

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

  static setupPatternList(onClick: (pattern: Pattern) => void) {
    const list = document.getElementById("pattern-list")!
    for (const [name, pattern] of Object.entries(PATTERNS_LIST)) {
      const canvas = document.createElement("canvas")
      canvas.addEventListener("click", () => onClick(pattern))
      const context = canvas.getContext("2d")!
      const div = document.createElement("div")
      div.textContent = name
      div.appendChild(canvas)
      list.appendChild(div)

      canvas.width = 200
      canvas.height = 100

      const size = pattern.getSize()
      const scale = Math.min(canvas.width / size[0], canvas.height / size[1]) * 0.8

      for (const [x, y] of pattern.getCells()) {
        const rectX = x * scale + (canvas.width / 2 - (size[0] * scale) / 2)
        const rectY = y * scale + (canvas.height / 2 - (size[1] * scale) / 2)
        const rectWidth = scale
        const border = rectWidth / 10

        context.fillStyle = "white"
        context.fillRect(
          rectX + border / 2,
          rectY + border / 2,
          rectWidth - border,
          rectWidth - border,
        )
      }
    }
  }
}
