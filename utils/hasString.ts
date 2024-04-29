import { isObject } from "lodash"

export default function hasString(str: string | null | undefined) {
  if (isObject(str)) return false
  return !!str?.trim()
}
