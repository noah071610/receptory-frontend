"use client"
import { refreshUser } from "@/actions/user"
import { _url } from "@/config"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { PropsWithChildren, useEffect, useState } from "react"
import { CookiesProvider } from "react-cookie"

const STALE_TIME = 1000 * 60 * 60 // 60 minutes

export const queryClientConfig = {
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: STALE_TIME,
      baseURL: _url.server,
      retry: 0,
      retryDelay: 1000,
    },
  },
}

const Init: React.FC<PropsWithChildren> = ({ children }) => {
  const [queryClientStore] = useState(() => new QueryClient(queryClientConfig))
  useEffect(() => {
    const fetchData = async () => {
      await refreshUser()
      // if (user) {
      //   await queryClient.setQueryData(queryKey.user, user)
      // }
    }
    fetchData()
  }, [])

  return (
    <CookiesProvider>
      <QueryClientProvider client={queryClientStore}>
        {children}
        {/* <ReactQueryDevtools /> */}
      </QueryClientProvider>
    </CookiesProvider>
  )
}

export default Init
