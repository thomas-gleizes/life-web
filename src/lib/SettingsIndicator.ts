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
}
