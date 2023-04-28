import React from "react"
import { createRoot } from "react-dom/client"

import "../public/style.css"
import App from "./App.tsx"

const root = document.getElementById("root") as HTMLElement

createRoot(root).render(<App />)
