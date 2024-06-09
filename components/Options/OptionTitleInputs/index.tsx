"use client"

import Input from "@/components/Input"
import { useTranslation } from "@/i18n/client"
import { useMainStore } from "@/store/main"
import { SectionType } from "@/types/Edit"
import cs from "classNames/bind"
import { memo } from "react"
import style from "./style.module.scss"
const cx = cs.bind(style)

function OptionTitleInputs({ section, isDisplayMode }: { section: SectionType; isDisplayMode?: boolean }) {
  const { pageLang } = useMainStore(["pageLang"])
  const { t } = useTranslation(pageLang, ["edit-page"])

  return (
    <div className={cx("edit-inputs")}>
      <h4>
        <span>{t("editTitle")}</span>
      </h4>
      <Input
        type="input"
        className={cx("title")}
        inputType="title"
        isOptional={false}
        value={section.data.title}
        dataKey="title"
        section={section}
      />
      <Input
        type="input"
        className={cx("description")}
        inputType="description"
        isOptional={true}
        value={section.data.description}
        dataKey="description"
        section={section}
      />
    </div>
  )
}
export default memo(OptionTitleInputs)
