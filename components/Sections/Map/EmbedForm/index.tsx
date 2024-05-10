"use client"

import Input from "@/components/Input"
import { useTranslation } from "@/i18n/client"
import { faChevronCircleDown } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import style from "./style.module.scss"

import cs from "classNames/bind"
import { useState } from "react"
const cx = cs.bind(style)

export default function EmbedForm({ value }: { value: string }) {
  const [isOpen, setIsOpen] = useState(false)
  const { t } = useTranslation()
  return (
    <div className={cx("input-wrapper")}>
      <h3 className={cx("input-title")}>{t("임베드 코드 입력")}</h3>
      <Input
        type="input"
        className={cx("input")}
        inputType="<iframe src= ..."
        maxLength={99999}
        isOptional={false}
        value={value}
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

      <div className={cx("explain", { isOpen: isOpen })}>
        <img src="" alt="explain-1" />
        <span>{t("1. 구글맵에서 위치를 찾아주세요.")}</span>
        <img src="" alt="explain-2" />
        <span>{t("2. 공유하기를 누르세요.")}</span>
        <img src="" alt="explain-3" />
        <span>{t("3. HTML 복사 버튼을 눌러 복사를 하고 코드를 넣어주세요.")}</span>
      </div>
    </div>
  )
}
