"use client";

import { useEffect, useRef, useCallback } from "react";
import { DEMO_SCRIPT, DEMO_DURATION } from "./demoScript";
import { useSceneStore } from "./store";

// Hook that replays the scripted timeline.
// To swap in live WebSocket events later, replace this hook
// with one that listens on a WS connection and calls
// store.applyEvent(parsedMessage) directly.

export function useDemoRunner() {
  const applyEvent = useSceneStore((s) => s.applyEvent);
  const setElapsed = useSceneStore((s) => s.setElapsed);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const startRef = useRef<number>(0);
  const rafRef = useRef<number>(0);

  const clearTimers = useCallback(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
    cancelAnimationFrame(rafRef.current);
  }, []);

  const start = useCallback(() => {
    clearTimers();
    startRef.current = performance.now();

    DEMO_SCRIPT.forEach((event) => {
      const timer = setTimeout(() => applyEvent(event), event.at);
      timersRef.current.push(timer);
    });

    // Elapsed tracker for progress bar
    const tick = () => {
      const elapsed = performance.now() - startRef.current;
      setElapsed(elapsed);
      if (elapsed < DEMO_DURATION + 1000) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };
    rafRef.current = requestAnimationFrame(tick);
  }, [applyEvent, setElapsed, clearTimers]);

  useEffect(() => {
    start();
    return clearTimers;
  }, [start, clearTimers]);
}
