"use client"
import { queryClientConfig } from "@/config"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { PropsWithChildren, useState } from "react"
import { CookiesProvider } from "react-cookie"
import { Toaster } from "sonner"
import Refresh from "./Refresh"

const Init: React.FC<PropsWithChildren> = ({ children }) => {
  const [queryClientStore] = useState(() => new QueryClient(queryClientConfig))

  return (
    <CookiesProvider>
      <QueryClientProvider client={queryClientStore}>
        <Refresh />
        {children}
        {/* <ReactQueryDevtools /> */}
        <Toaster />
      </QueryClientProvider>
    </CookiesProvider>
  )
}

export default Init
