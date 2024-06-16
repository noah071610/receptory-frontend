import { API } from "@/config"
import { Cookies } from "react-cookie"

const cookies = new Cookies()

export async function getInsight(pageId: string) {
  if (API.defaults.headers.common["Authorization"]?.toString().includes("Bearer ")) {
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
  }
  curSort: {
    orderby: string
    sort: string
  }
}) {
  if (API.defaults.headers.common["Authorization"]?.toString().includes("Bearer ")) {
    try {
      const response = await API.post(`/insight/confirmations`, data)

      return response.data
    } catch {
      // return "serverError"
    }
  }
}
