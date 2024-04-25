import { useEffect, useState } from "react"

export const useProgressiveImage = (src: string, isVisible: boolean) => {
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")

  useEffect(() => {
    if (isVisible) {
      const img = new Image()
      img.src = src
      img.onload = () => {
        if (img.naturalHeight > 0) setStatus("success")
      }
      img.onerror = () => {
        setStatus("error")
      }
    }
  }, [src, isVisible])

  return status
}
