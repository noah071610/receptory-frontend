import { API } from "@/config"
import { Langs } from "@/types/Main"
import { SaveListType, SaveUpdateType } from "@/types/Page"
import { Cookies } from "react-cookie"

const cookies = new Cookies()

export async function addSave(lang: Langs): Promise<SaveListType | undefined> {
  const cookie = cookies.get(process.env.NEXT_PUBLIC_COOKIE_NAME ?? "")

  if (cookie) {
    if (API.defaults.headers.common["Authorization"]?.toString().includes("Bearer ")) {
      // 완벽. 가져와
      const response = await API.post(`/save?lang=${lang}`)

      return response.data
    }
  }
}

export async function getSave(pageId: string) {
  const cookie = cookies.get(process.env.NEXT_PUBLIC_COOKIE_NAME ?? "")

  if (cookie) {
    if (API.defaults.headers.common["Authorization"]?.toString().includes("Bearer ")) {
      // 완벽. 가져와
      const response = await API.get(`/save?pageId=${pageId}`)

      return response.data
    }
  }
}

export async function save(payload: SaveUpdateType) {
  const cookie = cookies.get(process.env.NEXT_PUBLIC_COOKIE_NAME ?? "")

  if (cookie) {
    if (API.defaults.headers.common["Authorization"]?.toString().includes("Bearer ")) {
      // 완벽. 가져와
      const response = await API.put(`/save`, payload)

      return response.data
    }
  }
}
