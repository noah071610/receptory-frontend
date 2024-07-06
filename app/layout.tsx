import Init from "@/containers/global/Init"
import "@/styles/global.scss"
import getPreferredLanguage from "@/utils/helpers/getPreferredLanguage"
import { config } from "@fortawesome/fontawesome-svg-core"
import "@fortawesome/fontawesome-svg-core/styles.css"
import { dir } from "i18next"
import { Prompt } from "next/font/google"
import localFont from "next/font/local"

// import LocizeBackend from 'i18next-locize-backend'

import "swiper/css"
import "swiper/css/free-mode"
import "swiper/css/navigation"

config.autoAddCss = false

const pretendard = localFont({
  src: [
    {
      path: "../libs/fonts/Pretendard-Regular.woff",
      weight: "400",
    },
    {
      path: "../libs/fonts/Pretendard-SemiBold.woff",
      weight: "600",
    },
    {
      path: "../libs/fonts/Pretendard-Bold.woff",
      weight: "700",
    },
  ],
  display: "swap",
})

const prompt = Prompt({
  weight: ["400", "600", "700"],
  subsets: ["thai"],
  display: "swap",
})

async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const lang = await getPreferredLanguage()

  return (
    <html className={lang === "th" ? prompt.className : pretendard.className} lang={lang} dir={dir(lang)}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <meta name="keywords" content="form, survey, marketing, vote, insight, analytics, chart" />
      </head>
      <body suppressHydrationWarning={true}>
        <Init>
          <main>{children}</main>
        </Init>
      </body>
    </html>
  )
}

export default RootLayout
