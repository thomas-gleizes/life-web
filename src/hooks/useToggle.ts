import { useState } from "preact/hooks"

export function useToggle(initialValue: boolean): [boolean, (value?: boolean) => void] {
  const [value, setValue] = useState<boolean>(initialValue)

  const toggle = (value?: boolean) => {
    setValue((prev) => (value === undefined ? !prev : value))
  }

  return [value, toggle]
}
