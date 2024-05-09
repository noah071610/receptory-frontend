import Init from "@/containers/global/Init"
import "@/styles/global.scss"
import { Langs } from "@/types/Main"
import { config } from "@fortawesome/fontawesome-svg-core"
import "@fortawesome/fontawesome-svg-core/styles.css"
import { dir } from "i18next"
import { Metadata } from "next"
import { Prompt } from "next/font/google"
import localFont from "next/font/local"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import "swiper/css"
import "swiper/css/free-mode"
import "swiper/css/navigation"
import "swiper/css/thumbs"

config.autoAddCss = false

const pretendard = localFont({
  src: [
    {
      path: "../../libs/fonts/Pretendard-Regular.woff",
      weight: "400",
    },
    {
      path: "../../libs/fonts/Pretendard-SemiBold.woff",
      weight: "600",
    },
    {
      path: "../../libs/fonts/Pretendard-Bold.woff",
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

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
}

export default async function RootLayout({
  children,
  params: { lang },
}: Readonly<{
  children: React.ReactNode
  params: {
    lang: Langs
  }
}>) {
  return (
    <html className={lang === "th" ? prompt.className : pretendard.className} lang={lang} dir={dir(lang)}>
      <head>
        {/* eslint-disable-next-line @next/next/no-sync-scripts */}
        <script src="https://developers.kakao.com/sdk/js/kakao.js"></script>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        {/* <meta name="keywords" content="퀴즈, 게임, 투표, 픽, 월드컵, 이상형 월드컵" /> todo */}
      </head>
      <body suppressHydrationWarning={true}>
        <Init>
          <main>{children}</main>
          <ToastContainer />
        </Init>
      </body>
    </html>
  )
}
