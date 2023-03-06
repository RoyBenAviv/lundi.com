import { RefObject, useEffect } from "react";




function useOnClickOutside<T extends HTMLElement>(
  ref: RefObject<T>,
  handler: (event: Event) => void
) {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent | any) => {
      const targetEl = ref.current;
      if (targetEl) {
        const clickedX = event.clientX || event.touches[0].clientX;
        const clickedY = event.clientY || event.touches[0].clientY;
        const rect = targetEl.getBoundingClientRect();
        const targetElTop = rect.top;
        const targetElBottom = rect.top + rect.height;
        const targetElLeft = rect.left;
        const targetElRight = rect.left + rect.width;

        if (
          // check X Coordinate
          targetElLeft < clickedX &&
          clickedX < targetElRight &&
          // check Y Coordinate
          targetElTop < clickedY &&
          clickedY < targetElBottom
        ) {
          return;
        }

        // trigger event when the clickedX,Y is outside of the targetEl
        handler(event);
      }
    };

    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);

    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, handler]);
}

export default useOnClickOutside;