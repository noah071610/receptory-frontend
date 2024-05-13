import { customAlphabet, nanoid } from "nanoid"

const getNumber = customAlphabet("123456789ABC", 12)

export default function getId(onlyNumber?: boolean) {
  return onlyNumber ? getNumber() : nanoid(12)
}
