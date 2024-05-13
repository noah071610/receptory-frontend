import { API } from "@/config"
import { Langs } from "@/types/Main"
import { SaveContentType } from "@/types/Page"
import { convertContent } from "@/utils/editor/saveContentFromEditor"
import { Cookies } from "react-cookie"

const cookies = new Cookies()

export async function deploy({ content, pageId, lang }: { content: SaveContentType; pageId: string; lang: Langs }) {
  const cookie = cookies.get(process.env.NEXT_PUBLIC_COOKIE_NAME ?? "")
  const data = convertContent({ content, pageId, lang })
  if (cookie) {
    if (API.defaults.headers.common["Authorization"]?.toString().includes("Bearer ")) {
      const response = await API.post(`/page`, data)

      return response.data
    }
  }
}
