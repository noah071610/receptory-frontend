"use client"

import Input from "@/components/Input"
import { useTranslation } from "@/i18n/client"
import { SectionType } from "@/types/Edit"
import classNames from "classNames"
import { memo } from "react"
import style from "./style.module.scss"
const cx = classNames.bind(style)

function OptionTitleInputs({ section }: { section: SectionType }) {
  const { t } = useTranslation()

  return (
    <div className={cx(style["edit-inputs"])}>
      <h4>{t("타이틀 수정")}</h4>
      <Input
        className={cx(style.title)}
        inputType="title"
        isOptional={false}
        value={section.data.title}
        dataKey="title"
      />
      <Input
        className={cx(style.description)}
        inputType="description"
        isOptional={true}
        value={section.data.description}
        dataKey="description"
      />
    </div>
  )
}
export default memo(OptionTitleInputs)
