import { isObject } from "lodash"

export default function hasString(str: string | null | undefined) {
  if (isObject(str) || typeof str === "undefined") return false
  return !!str?.trim()
}
