import { AppProcessor } from "./lib/AppProcessor"
import { ToolBar } from "./components/TooBar"
import { StatusBar } from "./components/StatusBar"
import { Canvas } from "./components/Canvas"

const appProcessor = new AppProcessor()

appProcessor.start().then(() => appProcessor.setDelay(1000 / 60))

export function App() {
  return (
    <div className="w-screen h-screen bg-black relative top-0 left-0">
      <ToolBar appProcessor={appProcessor} />
      <Canvas appProcessor={appProcessor} />
      <StatusBar appProcessor={appProcessor} />
    </div>
  )
}
