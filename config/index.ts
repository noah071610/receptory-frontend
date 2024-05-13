import axios, { AxiosError } from "axios"

const STALE_TIME = 1000 * 60 * 60 // 60 minutes

export const _url = {
  client: process.env.NODE_ENV === "production" ? process.env.NEXT_PUBLIC_CLIENT_URL : "http://localhost:3000",
  server: process.env.NODE_ENV === "production" ? process.env.NEXT_PUBLIC_SERVER_URL : "http://localhost:5555/api",
}

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

export const API = axios.create({
  withCredentials: true,
  baseURL: _url.server,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
})

API.interceptors.response.use(
  (response) => {
    return response
  },
  (error: AxiosError) => {
    return Promise.reject(error?.response?.data ? error.response.data : { msg: "no", data: undefined })
  }
)

export const queryKey = {
  user: ["user"],
  page: (pageId: string) => ["page", pageId],
  save: {
    edit: ["save", "edit"],
    list: ["save", "list"],
  },
}

export const noImageUrl = "/images/noImage.png"
