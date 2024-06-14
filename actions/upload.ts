import { API, _url } from "@/config"
import axios from "axios"
import { Cookies } from "react-cookie"

const cookies = new Cookies()

export async function uploadImages(formData: FormData): Promise<string[] | undefined> {
  const cookie = cookies.get(process.env.NEXT_PUBLIC_COOKIE_NAME ?? "")

  if (cookie) {
    if (API.defaults.headers.common["Authorization"]?.toString().includes("Bearer ")) {
      // 완벽. 가져와
      const response = await axios.post(`/upload/images`, formData, {
        withCredentials: true,
        baseURL: _url.server,
        headers: {
          Accept: "application/json",
          "Content-Type": "multipart/form-data",
        },
      })

      return response.data
    }
  }
}
