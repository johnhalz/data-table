import { createContext, useContext, useEffect, useRef } from 'react'

/**
 * Replaces the Vue build's provide/inject: `DataTable` and `MiniTable` each provide one
 * object; children read it with `useDT()`. Values are plain (no refs) — the provider
 * re-renders on every state change, so readers always see the current value.
 */
export const DTContext = createContext(null)

export function useDT() {
  return useContext(DTContext) ?? {}
}

/** Resolved font stack of the nearest table, so nested tables inherit it. */
export const DTFontContext = createContext(null)

/** Calls `handler` on a pointerdown outside `ref.current`. Replaces the Vue `onClickOutside`. */
export function useClickOutside(ref, handler) {
  const handlerRef = useRef(handler)
  handlerRef.current = handler
  useEffect(() => {
    const listener = (e) => {
      const el = ref.current
      if (el && !e.composedPath().includes(el)) handlerRef.current(e)
    }
    document.addEventListener('pointerdown', listener, true)
    return () => document.removeEventListener('pointerdown', listener, true)
  }, [ref])
}
