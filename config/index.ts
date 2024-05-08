import axios, { AxiosError } from "axios"
import { colors } from "./colors"

export const _url = {
  client: process.env.NODE_ENV === "production" ? process.env.NEXT_PUBLIC_CLIENT_URL : "http://localhost:3000",
  server: process.env.NODE_ENV === "production" ? process.env.NEXT_PUBLIC_SERVER_URL : "http://localhost:5555/api",
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

export const getImageUrl = ({ isCenter, url }: { url: string; isCenter?: boolean }) => {
  if (isCenter) {
    return `url('${url}') no-repeat center/cover`
  } else {
    return `url('${url}') no-repeat center/contain, ${colors.border}`
  }
}

export const queryKey = {
  user: ["user"],
  save: {
    edit: ["save", "edit"],
    list: ["save", "list"],
  },
}

export const noImageUrl = "/images/post/no-image.png"
export const noThumbnailUrl = "/images/post/noThumbnail.png"
