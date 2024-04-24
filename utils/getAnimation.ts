import { AnimationTypes } from "@/types/Edit"

export const getAnimation = (type: AnimationTypes, delay: number) => {
  let temp = ""
  switch (type) {
    case "none":
      temp = "none"
      break
    case "fadeIn":
      temp = `${type} 600ms ${delay}ms forwards`
      break
    case "fadeUp":
      temp = `${type} 1000ms ${delay}ms cubic-bezier(.11,.83,.13,1) forwards`
      break
    case "flip":
      temp = `${type} 800ms ${delay}ms forwards`
      break
    case "bounce":
      temp = `${type} 1000ms ${delay}ms forwards`
      break
    case "scaleUp":
      temp = `${type} 700ms ${delay}ms cubic-bezier(.11,.83,.13,1) forwards`
      break
    default:
      temp = "none"
      break
  }
  return { animation: temp, opacity: type === "none" ? 1 : 0 }
}
