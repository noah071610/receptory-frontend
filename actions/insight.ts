import { API, checkToken } from "@/config"

export async function getInsight(pageId: string) {
  if (checkToken()) {
    try {
      const response = await API.get(`/insight?pageId=${pageId}`)

      return response.data
    } catch {
      // return "serverError"
    }
  }
}

export async function getConfirmations(data: {
  cursor: any
  pageId: string
  searchInput: string
  curFilter: {
    type: string
    startQuery: string
    endQuery: string
    isAnyDateOrAnytime: boolean
  }
  curSort: {
    orderby: string
    sort: string
  }
}) {
  if (checkToken()) {
    try {
      const response = await API.post(`/insight/confirmations`, data)

      return response.data
    } catch {
      // return "serverError"
    }
  }
}
