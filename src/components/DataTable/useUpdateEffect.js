import { useEffect, useRef } from 'react'

/** `useEffect` that skips the mount run — the Vue build's non-immediate `watch`. */
export function useUpdateEffect(effect, deps) {
  const mounted = useRef(false)
  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true
      return
    }
    return effect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}
