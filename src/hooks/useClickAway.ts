import { useEffect, useRef } from "react";

function useClickAway<T extends HTMLElement>(
  callback: (e: MouseEvent) => void,
) {
  const callbackRef = useRef<typeof callback>(); // initialize mutable ref, which stores callback
  const innerRef = useRef<T>(null); // returned to client, who marks "border" element

  // update cb on each render, so second useEffect has access to current value
  useEffect(() => {
    callbackRef.current = callback;
  });

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        innerRef.current &&
        callbackRef.current &&
        !innerRef.current.contains(e.target as Node)
      ) {
        callbackRef.current(e);
      }
    }
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []); // no dependencies -> stable click listener

  return innerRef; // convenience for client (doesn't need to init ref themselves)
}

export default useClickAway;
