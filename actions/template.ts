import { API } from "@/config"

export async function getTemplate({ pageId }: { pageId: string }) {
  const response = await API.get(`/template?pageId=${pageId}`)

  return response.data
}
