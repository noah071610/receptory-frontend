import { API } from "@/config"
import { Cookies } from "react-cookie"

const cookies = new Cookies()

export async function getTemplate({ pageId }: { pageId: string }) {
  const response = await API.get(`/template?pageId=${pageId}`)

  return response.data
}
