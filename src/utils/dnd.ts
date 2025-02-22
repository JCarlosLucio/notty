import {
  closestCenter,
  closestCorners,
  type CollisionDetection,
  MouseSensor as LibMouseSensor,
  PointerSensor as LibPointerSensor,
  pointerWithin,
  TouchSensor as LibTouchSensor,
} from "@dnd-kit/core";
import { type MouseEvent, type PointerEvent, type TouchEvent } from "react";

// Block DnD event propagation if element have "data-no-dnd" attribute
// ex. <SomeComponent data-no-dnd="true" />
// https://github.com/clauderic/dnd-kit/issues/477
const handler = ({
  nativeEvent: event,
}: MouseEvent | TouchEvent | PointerEvent) => {
  let cur = event.target as HTMLElement;

  while (cur) {
    if (cur.dataset?.noDnd) {
      return false;
    }
    cur = cur.parentElement!;
  }

  return true;
};

export class MouseSensor extends LibMouseSensor {
  static activators = [
    { eventName: "onMouseDown", handler },
  ] as (typeof LibMouseSensor)["activators"];
}

export class TouchSensor extends LibTouchSensor {
  static activators = [
    { eventName: "onTouchStart", handler },
  ] as (typeof LibTouchSensor)["activators"];
}

export class PointerSensor extends LibPointerSensor {
  static activators = [
    { eventName: "onPointerDown", handler },
  ] as (typeof LibPointerSensor)["activators"];
}

// Fixed DNDKIT Error: Maximum update depth exceeded. When dragging notes over/between 2 Lists, it detects both as lists and jumps between them until crash.
// https://github.com/clauderic/dnd-kit/issues/900
export const customCollisionDetectionAlgorithm: CollisionDetection = (args) => {
  const closestCornersCollisions = closestCorners(args);
  const closestCenterCollisions = closestCenter(args);
  const pointerWithinCollisions = pointerWithin(args);

  if (
    closestCornersCollisions.length > 0 &&
    closestCenterCollisions.length > 0 &&
    pointerWithinCollisions.length > 0
  ) {
    return pointerWithinCollisions;
  }

  return [];
};
