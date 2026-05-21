// utils/navigationRef.js
import { createRef } from "react";

export const navigationRef = createRef();

export function setNavigationRef(ref) {
  navigationRef.current = ref;
}

export function getCurrentRoute() {
  return navigationRef.current?.getCurrentRoute();
}
