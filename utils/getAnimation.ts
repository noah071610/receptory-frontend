import { AnimationTypes } from "@/types/Edit"

export const getAnimation = (type: AnimationTypes | undefined, delay: number, speed?: number) => {
  let temp = ""
  if (!type) return { animation: "none", opacity: 1 }

  switch (type) {
    case "none":
      temp = "none"
      break
    case "fadeIn":
      temp = `${type} ${speed ?? 600}ms ${delay}ms forwards`
      break
    case "fadeUp":
      temp = `${type} ${speed ?? 1000}ms ${delay}ms cubic-bezier(.11,.83,.13,1) forwards`
      break
    case "flip":
      temp = `${type} ${speed ?? 800}ms ${delay}ms forwards`
      break
    case "bounce":
      temp = `${type} ${speed ?? 1000}ms ${delay}ms forwards`
      break
    case "scaleUp":
      temp = `${type} ${speed ?? 700}ms ${delay}ms cubic-bezier(.11,.83,.13,1) forwards`
      break
    default:
      temp = "none"
      break
  }
  return { animation: temp, opacity: type === "none" ? 1 : 0 }
}
