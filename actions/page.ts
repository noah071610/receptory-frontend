import { API, checkToken } from "@/config"
import { Langs, SelectedType } from "@/types/Main"
import { SaveContentType } from "@/types/Page"
import { convertContent } from "@/utils/editor/saveContentFromEditor"
import { refreshUser } from "./user"

export async function getPage({ pageId }: { pageId: string }) {
  const response = await API.get(`/page?pageId=${pageId}`)

  return response.data
}

export async function getPageLink({ pageId }: { pageId: string }) {
  const response = await API.get(`/page/link?pageId=${pageId}`)

  return response.data
}

export async function getSitemapPages() {
  try {
    const response = await API.get(`/page/all`)
    if (!response.data) return []
    return response.data
  } catch {
    return []
  }
}

export async function submit(data: { selected: SelectedType[]; confirmId: string; pageId: string; password: string }) {
  try {
    const response = await API.post(`/page/submit`, data)

    return response.data
  } catch (err: any) {
    alert(err.message)
  }
}

export async function findReservation(data: { pageId: string; confirmId: string; password: string }) {
  try {
    const response = await API.post(`/page/find-reservation`, data)

    return { msg: "ok", data: response.data }
  } catch (err: any) {
    return { msg: err.message }
  }
}

export async function deploy({ content, pageId, lang }: { content: SaveContentType; pageId: string; lang: Langs }) {
  const data = convertContent({ content, pageId, lang })
  await refreshUser()
  if (checkToken()) {
    const response = await API.post(`/page`, data)

    return response.data
  }
}

export async function inactivePage({ pageId }: { pageId: string }) {
  if (checkToken()) {
    const response = await API.patch(`/page/inactive?pageId=${pageId}`)

    return response.data
  }
}

export async function changeLanguage({ pageId, lang }: { pageId: string; lang: Langs }) {
  if (checkToken()) {
    const response = await API.patch(`/page/lang?pageId=${pageId}&lang=${lang}`)

    return response.data
  }
}
