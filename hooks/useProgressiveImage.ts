import { useEffect, useState } from "react"

export const useProgressiveImage = (src: string, isVisible: boolean, delay: number = 400) => {
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")

  useEffect(() => {
    if (isVisible) {
      const img = new Image()
      img.src = src
      img.onload = () => {
        if (img.naturalHeight > 0) {
          setTimeout(() => {
            setStatus("success")
          }, delay)
        }
      }
      img.onerror = () => {
        setTimeout(() => {
          setStatus("error")
        }, delay)
      }
    }
  }, [src, isVisible])

  return status
}
