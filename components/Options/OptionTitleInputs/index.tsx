"use client"

import Input from "@/components/Input"
import { useTranslation } from "@/i18n/client"
import { SectionType } from "@/types/Edit"
import cs from "classNames/bind"
import { memo } from "react"
import style from "./style.module.scss"
const cx = cs.bind(style)

function OptionTitleInputs({ section, isDisplayMode }: { section: SectionType; isDisplayMode?: boolean }) {
  const { t } = useTranslation()

  return (
    <div className={cx("edit-inputs")}>
      <h4>{t("타이틀 수정")}</h4>
      <Input className={cx("title")} inputType="title" isOptional={false} value={section.data.title} dataKey="title" />
      <Input
        className={cx("description")}
        inputType="description"
        isOptional={true}
        value={section.data.description}
        dataKey="description"
      />
    </div>
  )
}
export default memo(OptionTitleInputs)
