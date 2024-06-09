"use client"

import FormUserInput from "@/components/FormUserInput"
import { useTranslation } from "@/i18n/client"
import { SectionType } from "@/types/Edit"
import { faList } from "@fortawesome/free-solid-svg-icons"
import { memo } from "react"
import style from "./style.module.scss"

import { _useMainStore } from "@/store/main"
import cs from "classNames/bind"
const cx = cs.bind(style)

function PageSelectList({ section }: { section: SectionType }) {
  const { t } = useTranslation("ko")
  const { setModal, selected, setSelected } = _useMainStore()
  const { value } = selected[section.index - 1] ?? {}

  const toggleSelect = () => {
    setModal({ section, type: "select" })
  }
  const reset = () => {
    setSelected({ section, value: [] })
  }

  return (
    <div className={cx("layout")}>
      <FormUserInput
        icon={faList}
        onClick={toggleSelect}
        title={section.data.title}
        description={section.data.description}
        isMultiple={true}
        isActive={value && value.length > 0}
        resetEvent={reset}
      >
        {value?.length > 0 ? (
          value.map(({ text }, i) => (
            <span key={`select-${i}`}>
              {i > 0 ? " , " : ""}
              {text}
            </span>
          ))
        ) : (
          <span>{t("none")}</span>
        )}
      </FormUserInput>
    </div>
  )
}

export default memo(PageSelectList)
