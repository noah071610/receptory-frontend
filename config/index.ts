import axios, { AxiosError } from "axios"

const STALE_TIME = 1000 * 60 * 60 // 60 minutes
export const domain = process.env.NEXT_PUBLIC_DOMAIN
export const port = process.env.NEXT_PUBLIC_PORT
export const serverPort = process.env.NEXT_PUBLIC_SERVER_PORT

export const _url = {
  client: process.env.NODE_ENV === "production" ? `https://${domain}` : `http://localhost:${port}`,
  server: process.env.NODE_ENV === "production" ? `https://api.${domain}/api` : `http://localhost:${serverPort}/api`,
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
  admin: ["admin"],
  page: (pageId: string) => ["page", pageId],
  insight: (pageId: string) => ["insight", pageId],
  insightSearch: (pageId: string) => ["insightSearch", pageId],
  save: {
    list: ["save", "list"],
  },
}

export const noImageUrl = "/images/noImage.png"
export const thumbnailUrl = "/images/thumbnail.png"

export const userPlan = ["free", "semiPremium", "premium"]

export const langText = {
  ko: "한국어",
  en: "English",
  th: "ภาษาไทย",
  ja: "日本語",
}
