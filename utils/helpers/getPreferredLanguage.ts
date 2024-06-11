import { langCookieName } from "@/i18n/settings"
import { cookies, headers } from "next/headers"
import { Langs } from "./../../types/Main"

function getLang(acceptLanguage: string): string {
  if (!acceptLanguage) {
    return "ko" // 기본값
  }

  const languages = acceptLanguage
    .split(",")
    .map((lang) => {
      const [language, qValue] = lang.trim().split(";q=")
      return {
        language: language.split("-")[0], // 첫 번째 부분만 사용
        q: qValue ? parseFloat(qValue) : 1.0,
      }
    })
    .sort((a, b) => b.q - a.q)

  return languages[0].language
}

export default async function getPreferredLanguage() {
  const headersList = headers()
  let lang = "ko"
  const cookie = cookies().get(langCookieName)?.value

  if (cookie) {
    lang = cookie
  } else {
    const acceptLanguage = headersList.get("Accept-Language")
    lang = acceptLanguage ? getLang(acceptLanguage) : "ko"
  }

  return lang as Langs
}
