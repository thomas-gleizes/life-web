import "./index.css"
import Renderer from "./lib/Renderer.ts"

const canvas = document.querySelector("canvas")! as HTMLCanvasElement
canvas.width = window.innerWidth
canvas.height = window.innerHeight

const renderer = new Renderer(canvas)

void renderer.start()
