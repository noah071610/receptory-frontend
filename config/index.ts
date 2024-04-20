import axios, { AxiosError } from "axios"

export const _url = {
  client: process.env.NODE_ENV === "production" ? process.env.NEXT_PUBLIC_CLIENT_URL : "http://localhost:3000",
  server: process.env.NODE_ENV === "production" ? process.env.NEXT_PUBLIC_SERVER_URL : "http://localhost:5555",
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
    return `url('${url}') center / cover`
  } else {
    return `url('${url}')`
  }
}

export const queryKey = {
  user: ["user"],
}

export const noImageUrl = "/images/post/no-image.png"
export const noThumbnailUrl = "/images/post/noThumbnail.png"
