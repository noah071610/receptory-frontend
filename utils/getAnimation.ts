import { AnimationTypes } from "@/types/Edit"

export const getAnimation = ({
  type,
  delay,
  speed,
  visibleAll,
}: {
  type: AnimationTypes | undefined
  delay: number
  speed?: number
  visibleAll?: boolean
}) => {
  let temp = ""
  if (!type) return { animation: "none", opacity: 1 }
  let opacity = 1
  switch (type) {
    case "none":
      temp = "none"
      break
    case "fadeIn":
      temp = `${type} ${speed ?? 600}ms ${delay}ms forwards`
      opacity = 0
      break
    case "fadeUpBig":
      temp = `${type} ${speed ?? 600}ms ${delay}ms forwards`
      opacity = 0
      break
    case "fadeUp":
      temp = `${type} ${speed ?? 1000}ms ${delay}ms cubic-bezier(.11,.83,.13,1) forwards`
      opacity = 0
      break
    case "flip":
      temp = `${type} ${speed ?? 800}ms ${delay}ms forwards`
      opacity = 0
      break
    case "bounce":
      temp = `${type} ${speed ?? 1000}ms ${delay}ms forwards`
      break
    case "scaleUp":
      temp = `${type} ${speed ?? 700}ms ${delay}ms cubic-bezier(.11,.83,.13,1) forwards`
      opacity = 0
      break
    case "fadeInRight":
      temp = `${type} ${speed ?? 700}ms ${delay}ms cubic-bezier(.11,.83,.13,1) forwards`
      opacity = 0
      break
    case "heartBeat":
      temp = `${type} ${speed ?? 700}ms ${delay}ms cubic-bezier(.11,.83,.13,1) forwards`
      break
    default:
      temp = "none"
      break
  }
  return { animation: temp, opacity: visibleAll ? 1 : opacity }
}
