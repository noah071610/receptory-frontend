"use client"

import Input from "@/components/Input"
import { SectionType } from "@/types/Edit"
import cs from "classNames/bind"
import { memo } from "react"
import { useTranslation } from "react-i18next"
import style from "./style.module.scss"
const cx = cs.bind(style)

function OptionTitleInputs({ section, isDisplayMode }: { section: SectionType; isDisplayMode?: boolean }) {
  const { t } = useTranslation(["edit-page"])

  return (
    <div className={cx("edit-inputs")}>
      <h4>
        <span>{t("editTitle")}</span>
      </h4>
      <Input
        type="input"
        className={cx("title")}
        inputType="titleInput"
        isOptional={false}
        value={section.data.title}
        dataKey="title"
        section={section}
      />
      <Input
        type="input"
        className={cx("description")}
        inputType="descriptionInput"
        isOptional={true}
        value={section.data.description}
        dataKey="description"
        section={section}
      />
    </div>
  )
}
export default memo(OptionTitleInputs)
