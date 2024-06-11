import { langCookieName } from "@/i18n/settings"
import type { NextApiRequest, NextApiResponse } from "next"
import { cookies, headers } from "next/headers"

function getPreferredLanguage(acceptLanguage: string): string {
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

export default function GET(req: NextApiRequest, res: NextApiResponse) {
  const headersList = headers()
  const acceptLanguage = headersList.get("Accept-Language")
  const lang = acceptLanguage ? getPreferredLanguage(acceptLanguage) : "ko"

  if (!cookies().get(langCookieName)) {
    cookies().set(langCookieName, lang)
  }
  res.status(200).json({ language: acceptLanguage })
}
