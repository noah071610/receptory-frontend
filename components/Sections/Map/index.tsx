"use client"

import Input from "@/components/Input"
import { useTranslation } from "@/i18n/client"
import { SectionType } from "@/types/Edit"
import hasString from "@/utils/hasString"
import { faChevronCircleDown } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { memo, useMemo, useState } from "react"
import style from "./style.module.scss"

import cs from "classNames/bind"
const cx = cs.bind(style)

const GoogleMapExplain = ({ isOpen }: { isOpen: boolean }) => {
  const { t } = useTranslation()
  return (
    <div className={cx("explain", { isOpen: isOpen })}>
      <img src="" alt="explain-1" />
      <span>{t("1. 구글맵에서 위치를 찾아주세요.")}</span>
      <img src="" alt="explain-2" />
      <span>{t("2. 공유하기를 누르세요.")}</span>
      <img src="" alt="explain-3" />
      <span>{t("3. HTML 복사 버튼을 눌러 복사를 하고 코드를 넣어주세요.")}</span>
    </div>
  )
}

function Map({ section, isDisplayMode }: { section: SectionType; isDisplayMode?: boolean }) {
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
    <div className={cx("map")}>
      {mapCode ? (
        <iframe
          className={cx("iframe")}
          src={mapCode}
          allowFullScreen={true}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      ) : (
        <div className={cx("empty")}></div>
      )}
      {!isDisplayMode && (
        <div className={cx("input-wrapper")}>
          <h3 className={cx("input-title")}>{t("임베드 코드 입력")}</h3>
          <Input
            type="input"
            className={cx("input")}
            inputType="<iframe src= ..."
            maxLength={99999}
            isOptional={false}
            value={section.value}
          />
          <div
            onClick={() => {
              setIsOpen((b) => !b)
            }}
            className={cx("explain-title", { isOpen: isOpen })}
          >
            <h3>{t("임베드 코드 삽입 방법")}</h3>
            <div className={cx("icon")}>
              <FontAwesomeIcon icon={faChevronCircleDown} />
            </div>
          </div>
          <GoogleMapExplain isOpen={isOpen} />
        </div>
      )}
    </div>
  )
}

export default memo(Map)
