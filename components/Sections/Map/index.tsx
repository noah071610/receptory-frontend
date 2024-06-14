"use client"

import { SectionType } from "@/types/Edit"
import hasString from "@/utils/helpers/hasString"
import { memo, useMemo } from "react"
import style from "./style.module.scss"

import cs from "classnames/bind"
import dynamic from "next/dynamic"
import { useTranslation } from "react-i18next"
const cx = cs.bind(style)

const EmbedForm = dynamic(() => import("./EmbedForm/index"), {
  ssr: true,
})

function Map({ section, isDisplayMode }: { section: SectionType; isDisplayMode?: boolean }) {
  const { t } = useTranslation(["edit-page"])

  const mapCode = useMemo(() => {
    if (hasString(section.value) && section.value.includes('<iframe src="https://www.google.com/maps/embed?pb=')) {
      let temp = section.value
      const srcRegex = /<iframe\s+src="(.+?)"/
      const match = temp.match(srcRegex)

      // 추출된 src 속성 값
      temp = match ? match[1] : ""
      if (temp) {
        return temp
      } else {
        return ""
      }
    } else {
      return ""
    }
  }, [section.value])

  return (
    <div className={cx("map")}>
      {mapCode ? (
        <iframe
          className={cx("iframe")}
          src={mapCode}
          allowFullScreen={true}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      ) : !isDisplayMode ? (
        <div className={cx("no-list")}>
          <img src="/images/icons/hello.png" alt="hello" />
          <span>{t("putGoogleMapCode")}</span>
        </div>
      ) : (
        <></>
      )}
      {!isDisplayMode && <EmbedForm section={section} value={section.value} />}
    </div>
  )
}

export default memo(Map)
