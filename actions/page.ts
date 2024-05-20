import { API } from "@/config"
import { Langs } from "@/types/Main"
import { SaveContentType } from "@/types/Page"
import { convertContent } from "@/utils/editor/saveContentFromEditor"
import { Cookies } from "react-cookie"

const cookies = new Cookies()

export async function getPage({ pageId }: { pageId: string }) {
  try {
    const response = await API.get(`/page?pageId=${pageId}`)

    return response.data
  } catch (err: any) {
    alert(err.message)
  }
}

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

export async function inactivePage({ pageId }: { pageId: string }) {
  const cookie = cookies.get(process.env.NEXT_PUBLIC_COOKIE_NAME ?? "")
  if (cookie) {
    if (API.defaults.headers.common["Authorization"]?.toString().includes("Bearer ")) {
      const response = await API.patch(`/page/inactive?pageId=${pageId}`)

      return response.data
    }
  }
}

export async function changeLanguage({ pageId, lang }: { pageId: string; lang: Langs }) {
  const cookie = cookies.get(process.env.NEXT_PUBLIC_COOKIE_NAME ?? "")
  if (cookie) {
    if (API.defaults.headers.common["Authorization"]?.toString().includes("Bearer ")) {
      const response = await API.patch(`/page/lang?pageId=${pageId}&lang=${lang}`)

      return response.data
    }
  }
}
