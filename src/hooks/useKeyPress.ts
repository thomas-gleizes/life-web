import { useEffect, useState } from "react"

export function useKeyPress(key: KeyboardEvent["key"]): boolean {
  const [isPress, setIsPress] = useState<boolean>(false)

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (key === event.key) setIsPress(true)
    }

    const handleKeyUp = (event: KeyboardEvent) => {
      if (key === event.key) setIsPress(false)
    }

    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("keyup", handleKeyUp)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("keyup", handleKeyUp)
    }
  }, [])

  return isPress
}
