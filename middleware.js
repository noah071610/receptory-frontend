import { NextResponse } from "next/server"
import acceptLanguage from "accept-language"
import { cookieName, fallbackLng, languages } from "./i18n/settings"

acceptLanguage.languages(languages)

export function middleware(req, res) {
  let lang
  if (!lang) lang = acceptLanguage.get(req.headers.get("Accept-Language"))

  if (!lang) lang = fallbackLng

  return NextResponse.next()
}
