import { API, checkToken } from "@/config"
import { Langs } from "@/types/Main"

export async function getTemplates(lang: Langs) {
  const response = await API.get(`/website/templates?lang=${lang}`)

  return response.data
}

export async function getTemplateText(lang: Langs, type: "template") {
  if (checkToken()) {
    try {
      const response = await API.get(`/website/template-text?lang=${lang}&type=${type}`)

      return response.data
    } catch {
      // return "serverError"
    }
  }
}

export async function setTemplate(data: { text: string; lang: Langs }) {
  if (checkToken()) {
    try {
      const response = await API.post(`/website/template`, data)

      return response.data
    } catch (err) {
      return err
    }
  }
}

export async function selectTemplate(templateId: string) {
  if (checkToken()) {
    try {
      const response = await API.post(`/website/template/use?templateId=${templateId}`)

      return response.data
    } catch (err) {
      return err
    }
  }
}
