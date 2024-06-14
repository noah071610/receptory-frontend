"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function Home() {
  const { push } = useRouter()
  useEffect(() => {
    push("/login")
  }, [push])

  return <div></div>
}
