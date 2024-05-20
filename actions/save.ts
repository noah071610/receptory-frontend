import { API } from "@/config"
import { Langs } from "@/types/Main"
import { SaveListType, SaveUpdateType } from "@/types/Page"
import { Cookies } from "react-cookie"
import { refreshUser } from "./user"

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

export async function getSaves() {
  const cookie = cookies.get(process.env.NEXT_PUBLIC_COOKIE_NAME ?? "")

  if (cookie) {
    if (API.defaults.headers.common["Authorization"]?.toString().includes("Bearer ")) {
      // 완벽. 가져와
      const response = await API.get(`/save/list`)

      return response.data
    } else {
      // 잉? 리프레쉬 해줘야겠네
      const user = await refreshUser()
      return user
    }
  } else {
    // 아예 초기 유저인듯
    return null
  }
}

export async function getSave(pageId: string) {
  const cookie = cookies.get(process.env.NEXT_PUBLIC_COOKIE_NAME ?? "")

  if (cookie) {
    if (API.defaults.headers.common["Authorization"]?.toString().includes("Bearer ")) {
      // 완벽. 가져와
      try {
        const response = await API.get(`/save?pageId=${pageId}`)

        return response.data
      } catch {
        return "notFound"
      }
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

export async function deleteSave(pageId: string) {
  const cookie = cookies.get(process.env.NEXT_PUBLIC_COOKIE_NAME ?? "")

  if (cookie) {
    if (API.defaults.headers.common["Authorization"]?.toString().includes("Bearer ")) {
      // 완벽. 가져와
      const response = await API.delete(`/save?pageId=${pageId}`)

      return response.data
    }
  }
}
