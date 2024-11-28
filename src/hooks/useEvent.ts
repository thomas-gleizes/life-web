import { useEffect } from "preact/compat"

export function useEvent<K extends keyof WindowEventMap>(
  event: K,
  callback: (this: Window, ev: WindowEventMap[K]) => any,
) {
  useEffect(() => {
    window.addEventListener(event, callback)

    return () => window.removeEventListener(event, callback)
  })
}
