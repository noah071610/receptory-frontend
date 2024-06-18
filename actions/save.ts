import { API } from "@/config"
import { Langs } from "@/types/Main"
import { SaveListType, SaveUpdateType } from "@/types/Page"
import { refreshUser } from "./user"

export async function addSave(lang: Langs): Promise<SaveListType | undefined> {
  if (API.defaults.headers.common["Authorization"]?.toString().includes("Bearer ")) {
    // 완벽. 가져와
    const response = await API.post(`/save?lang=${lang}`)

    return response.data
  }
}

export async function getSaves() {
  if (API.defaults.headers.common["Authorization"]?.toString().includes("Bearer ")) {
    // 완벽. 가져와
    const response = await API.get(`/save/list`)

    return response.data
  } else {
    // 잉? 리프레쉬 해줘야겠네
    const user = await refreshUser()
    return user
  }
}

export async function getSave(pageId: string) {
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

export async function save(payload: SaveUpdateType) {
  if (API.defaults.headers.common["Authorization"]?.toString().includes("Bearer ")) {
    // 완벽. 가져와
    try {
      const response = await API.put(`/save`, payload)

      return response.data
    } catch (err) {
      await refreshUser()
      await API.put(`/save`, payload)
      return "no"
    }
  }
}

export async function deleteSave(pageId: string) {
  if (API.defaults.headers.common["Authorization"]?.toString().includes("Bearer ")) {
    // 완벽. 가져와
    const response = await API.delete(`/save?pageId=${pageId}`)

    return response.data
  }
}

export async function checkCustomLink(pageId: string, customLink: string) {
  if (API.defaults.headers.common["Authorization"]?.toString().includes("Bearer ")) {
    try {
      const response = await API.get(`/page/check-link?pageId=${pageId}&customLink=${customLink}`)

      return response.data
    } catch {
      // return "serverError"
    }
  }
}
