import { customAlphabet } from "nanoid"

const getConfirmationNum = customAlphabet("ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789", 10)

export default function getConfirmationId() {
  return `RT-${getConfirmationNum()}`
}
