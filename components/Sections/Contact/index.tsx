"use client"

import { useTranslation } from "@/i18n/client"
import { SectionType } from "@/types/Edit"
import { getAnimation } from "@/utils/styles/getAnimation"
import cs from "classNames/bind"
import dynamic from "next/dynamic"
import Image from "next/image"
import { useParams } from "next/navigation"
import { memo, useMemo } from "react"
import style from "./style.module.scss"
const cx = cs.bind(style)

const Providers = dynamic(() => import("./Providers/index"), {
  ssr: true,
})

function Contact({ section, isDisplayMode }: { section: SectionType; isDisplayMode?: boolean }) {
  const { lang } = useParams()
  const { t } = useTranslation()

  const btnList = useMemo(() => section.list.filter((v) => v.isActive), [section.list])

  return (
    <div className={cx("contact")}>
      <div className={cx("main")}>
        <div className={cx("btn-list")}>
          {btnList.map((v, i) => {
            switch (v.type) {
              case "call":
                return (
                  <a
                    style={getAnimation({ type: section.style.animation, delay: i * 130 })}
                    href={`tel:${v.value}`}
                    key={`btn_${v.type}`}
                  >
                    <Image width={30} height={30} src={`/images/icons/${v.type}.png`} alt={v.type} />
                  </a>
                )
              default:
                return (
                  <button
                    style={getAnimation({ type: section.style.animation, delay: i * 130 })}
                    // onClick={() => v.onClick(v.value)} todo:
                    key={`btn_${v.type}`}
                  >
                    <Image width={30} height={30} src={`/images/icons/${v.type}.png`} alt={v.type} />
                  </button>
                )
            }
          })}
        </div>
      </div>
      {!isDisplayMode && <Providers section={section} />}
    </div>
  )
}
export default memo(Contact)
