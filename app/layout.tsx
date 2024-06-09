import Init from "@/containers/global/Init"
import "@/styles/global.scss"
import { config } from "@fortawesome/fontawesome-svg-core"
import "@fortawesome/fontawesome-svg-core/styles.css"
import { dir } from "i18next"
import { Metadata } from "next"
import localFont from "next/font/local"
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

export const metadata: Metadata = {
  title: "Receptory",
  description: "",
}

async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html className={pretendard.className} lang={"ko"} dir={dir("ko")}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        {/* <meta name="keywords" content="퀴즈, 게임, 투표, 픽, 월드컵, 이상형 월드컵" /> todo */}
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
