"use client"

import Input from "@/components/Input"
import { useTranslation } from "react-i18next"
import style from "./style.module.scss"

import { SectionType } from "@/types/Edit"
import cs from "classnames/bind"
const cx = cs.bind(style)

export default function EmbedForm({ value, section }: { value: string; section: SectionType }) {
  const { t } = useTranslation(["edit-page"])

  return (
    <div className={cx("options")}>
      <h4 className={cx("input-title")}>
        <span>{t("putEmbedUrl")}</span>
      </h4>
      <Input
        type="input"
        className={cx("input")}
        inputType="<iframe src= ..."
        maxLength={99999}
        isOptional={false}
        value={value}
        section={section}
      />

      {/* <div
        onClick={() => {
          setIsOpen((b) => !b)
        }}
        className={cx("explain-title", { isOpen: isOpen })}
      >
        <h4>
          <span>{t("임베드 코드 삽입 방법")}</span>
        </h4>
        <div className={cx("icon")}>
          <FontAwesomeIcon icon={faChevronCircleDown} />
        </div>
      </div>

      <div className={cx("explain", { isOpen: isOpen })}>
        <img src="" alt="explain-1" />
        <span>{t("1. 구글맵에서 위치를 찾아주세요. // todo:")}</span>
        <img src="" alt="explain-2" />
        <span>{t("2. 공유하기를 누르세요.")}</span>
        <img src="" alt="explain-3" />
        <span>{t("3. HTML 복사 버튼을 눌러 복사를 하고 코드를 넣어주세요.")}</span>
      </div> */}
    </div>
  )
}
