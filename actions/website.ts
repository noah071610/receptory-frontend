import { API } from "@/config"
import { Langs } from "@/types/Main"
import { Cookies } from "react-cookie"

const cookies = new Cookies()

export async function getTemplates(lang: Langs) {
  const response = await API.get(`/website/templates?lang=${lang}`)

  return response.data
}

export async function getTemplateText(lang: Langs, type: "template") {
  const cookie = cookies.get(process.env.NEXT_PUBLIC_COOKIE_NAME ?? "")

  if (cookie) {
    if (API.defaults.headers.common["Authorization"]?.toString().includes("Bearer ")) {
      try {
        const response = await API.get(`/website/template-text?lang=${lang}&type=${type}`)

        return response.data
      } catch {
        // return "serverError"
      }
    }
  }
}

export async function setTemplate(data: { text: string; lang: Langs }) {
  const cookie = cookies.get(process.env.NEXT_PUBLIC_COOKIE_NAME ?? "")

  if (cookie) {
    if (API.defaults.headers.common["Authorization"]?.toString().includes("Bearer ")) {
      try {
        const response = await API.post(`/website/template`, data)

        return response.data
      } catch (err) {
        return err
      }
    }
  }
}
