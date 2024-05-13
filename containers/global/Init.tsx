"use client"
import { refreshUser } from "@/actions/user"
import { queryClientConfig } from "@/config"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { PropsWithChildren, useEffect, useState } from "react"
import { CookiesProvider } from "react-cookie"
import { Toaster } from "sonner"

const Init: React.FC<PropsWithChildren> = ({ children }) => {
  const [queryClientStore] = useState(() => new QueryClient(queryClientConfig))
  useEffect(() => {
    const fetchData = async () => {
      await refreshUser()
    }
    fetchData()
  }, [])

  return (
    <CookiesProvider>
      <QueryClientProvider client={queryClientStore}>
        {children}
        {/* <ReactQueryDevtools /> */}
        <Toaster />
      </QueryClientProvider>
    </CookiesProvider>
  )
}

export default Init
