export const fallbackLng = "ko"
export const languages = [fallbackLng, "en", "ja", "th"]
export const defaultNS = "translation"
export const langCookieName = "i18next-lang"

export function getOptions(lng = fallbackLng, ns = defaultNS) {
  return {
    debug: false,
    supportedLngs: languages,
    // preload: languages,
    fallbackLng,
    lng,
    fallbackNS: defaultNS,
    defaultNS,
    ns,
    // backend: {
    //   projectId: '01b2e5e8-6243-47d1-b36f-963dbb8bcae3'
    // }
  }
}