import { API, checkToken } from "@/config"
import { Langs } from "@/types/Main"
import { SaveListType, SaveUpdateType } from "@/types/Page"
import { refreshUser } from "./user"

export async function addSave(lang: Langs): Promise<SaveListType | undefined> {
  if (checkToken()) {
    // 완벽. 가져와
    const response = await API.post(`/save?lang=${lang}`)

    return response.data
  }
}

export async function getSaves() {
  if (checkToken()) {
    // 완벽. 가져와
    const response = await API.get(`/save/list`)
    return response.data
  }
}

export async function getSave(pageId: string) {
  if (checkToken()) {
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
  await refreshUser()
  if (checkToken()) {
    // 완벽. 가져와
    const response = await API.put(`/save`, payload)

    return response.data
  }
}

export async function deleteSave(pageId: string) {
  if (checkToken()) {
    // 완벽. 가져와
    const response = await API.delete(`/save?pageId=${pageId}`)

    return response.data
  }
}

export async function checkCustomLink(pageId: string, customLink: string) {
  if (checkToken()) {
    try {
      const response = await API.get(`/page/check-link?pageId=${pageId}&customLink=${customLink}`)

      return response.data
    } catch {
      // return "serverError"
    }
  }
}
