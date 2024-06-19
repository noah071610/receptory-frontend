"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useEffect } from "react"

const LoginSuccess = () => {
  const { back } = useRouter()
  const search = useSearchParams()
  const userId = search.get("userId")

  useEffect(() => {
    if (!userId) {
      back()
    }

    if (userId && typeof window === "object") {
      window.close()
    }
  }, [userId, back])
  return <></>
}

export default LoginSuccess
