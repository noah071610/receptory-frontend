import { AnimationTypes } from "@/types/Edit"

export const getAnimation = (type: AnimationTypes, delay: number) => {
  switch (type) {
    case "none":
      return "none"
    case "fadeIn":
      return `${type} 600ms ${delay}ms forwards`
    case "fadeUp":
      return `${type} 1000ms ${delay}ms cubic-bezier(.11,.83,.13,1) forwards`
    case "flip":
      return `${type} 800ms ${delay}ms forwards`
    case "bounce":
      return `${type} 1000ms ${delay}ms forwards`
    case "scaleUp":
      return `${type} 700ms ${delay}ms cubic-bezier(.11,.83,.13,1) forwards`

    default:
      return "none"
  }
}
