import { colors } from "@/config/colors"
import { getAnimation } from "@/utils/styles/getAnimation"
import { useState } from "react"

const errorMessage = {
  noEmptyText: "",
}

export const useError = ({ delay, type }: { delay?: number; type: string }) => {
  const [error, setError] = useState<{
    type: string | null
    message: string | null
  }>({
    type: null,
    message: null,
  })

  const onError = (customType?: string) => {
    setError({
      type: customType ?? type,
      message: customType ?? type,
    })
    if (typeof delay === "number") {
      setTimeout(() => {
        setError({
          type: null,
          message: null,
        })
      }, delay)
    }
  }

  const setErrorClear = () => {
    setError((prev) => ({
      type: null,
      message: prev.message,
    }))
    setTimeout(() => {
      setError({
        type: null,
        message: null,
      })
    }, 300)
  }

  return {
    isError: !!error.type,
    setErrorClear,
    errorMessage: error.message,
    onError,
    errorStyle: {
      borderColor: colors.red,
      ...getAnimation({ type: "headShake", delay: 0 }),
      color: colors.red,
    },
    animation: getAnimation({ type: "headShake", delay: 0 }),
  }
}
