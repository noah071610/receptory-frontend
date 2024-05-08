import { API } from "@/config"
import { Cookies } from "react-cookie"

const cookies = new Cookies()

export async function addPage() {
  const cookie = cookies.get(process.env.NEXT_PUBLIC_COOKIE_NAME ?? "")

  if (cookie) {
    if (API.defaults.headers.common["Authorization"]?.toString().includes("Bearer ")) {
      // 완벽. 가져와
      const response = await API.post(`/page`)

      return response.data
    }
  }
}
