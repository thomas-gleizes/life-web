import { AppProcessor } from "./lib/AppProcessor.ts"
import { ToolBar } from "./components/TooBar.tsx"
import { StatusBar } from "./components/StatusBar.tsx"
import { Canvas } from "./components/Canvas.tsx"

const appProcessor = new AppProcessor()

// appProcessor.start().then(() => appProcessor.setDelay(50))

export function App() {
  return (
    <div className="w-screen h-screen bg-black relative top-0 left-0">
      <ToolBar appProcessor={appProcessor} />
      <Canvas appProcessor={appProcessor} />
      <StatusBar appProcessor={appProcessor} />
    </div>
  )
}
