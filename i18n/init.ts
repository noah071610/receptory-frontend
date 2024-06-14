"use client"

import i18next from "i18next"
import LanguageDetector from "i18next-browser-languagedetector"
import resourcesToBackend from "i18next-resources-to-backend"
import { initReactI18next } from "react-i18next"
import { getOptions, languages } from "./settings"

const runsOnServerSide = typeof window === "undefined"

// on client side the normal singleton is ok
i18next
  .use(initReactI18next)
  .use(LanguageDetector)
  .use(resourcesToBackend((language: any, namespace: any) => import(`./locales/${language}/${namespace}.json`)))
  .init({
    ...getOptions(),
    lng: undefined,
    preload: runsOnServerSide ? languages : [],
    ns: ["messages"],
  })

export default i18next
