"use client"

import Input from "@/components/Input"
import { useTranslation } from "@/i18n/client"
import { SectionType } from "@/types/Edit"
import hasString from "@/utils/hasString"
import { faChevronCircleDown } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import classNames from "classNames"
import { memo, useMemo, useState } from "react"
import style from "./style.module.scss"

const cx = classNames.bind(style)

const GoogleMapExplain = ({ isOpen }: { isOpen: boolean }) => {
  const { t } = useTranslation()
  return (
    <div className={cx(style.explain, { [style.isOpen]: isOpen })}>
      <img src="" alt="explain-1" />
      <span>{t("1. 구글맵에서 위치를 찾아주세요.")}</span>
      <img src="" alt="explain-2" />
      <span>{t("2. 공유하기를 누르세요.")}</span>
      <img src="" alt="explain-3" />
      <span>{t("3. HTML 복사 버튼을 눌러 복사를 하고 코드를 넣어주세요.")}</span>
    </div>
  )
}

function Map({ section }: { section: SectionType }) {
  const [isOpen, setIsOpen] = useState(false)
  const { t } = useTranslation()

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
    <div className={cx(style["map"])}>
      {mapCode ? (
        <iframe
          className={cx(style.iframe)}
          src={mapCode}
          allowFullScreen={true}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      ) : (
        <div className={cx(style.empty)}></div>
      )}
      <div className={cx(style["input-wrapper"])}>
        <h3 className={cx(style["input-title"])}>{t("임베드 코드 입력")}</h3>
        <Input className={cx(style.input)} inputType="map" isOptional={false} value={section.value} />
        <div
          onClick={() => {
            setIsOpen((b) => !b)
          }}
          className={cx(style["explain-title"], { [style.isOpen]: isOpen })}
        >
          <h3>{t("임베드 코드 삽입 방법")}</h3>
          <div className={cx(style.icon)}>
            <FontAwesomeIcon icon={faChevronCircleDown} />
          </div>
        </div>
        <GoogleMapExplain isOpen={isOpen} />
      </div>
    </div>
  )
}

export default memo(Map)
