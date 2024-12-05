import { useEffect } from "react"

export function useEvent<K extends keyof WindowEventMap>(
  event: K,
  callback: (this: Window, ev: WindowEventMap[K]) => any,
  target: Window | any = window
) {
  useEffect(() => {
    window.addEventListener(event, callback)

    return () => window.removeEventListener(event, callback)
  })
}
