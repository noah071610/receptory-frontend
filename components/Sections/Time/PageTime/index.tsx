"use client"

import FormUserInput from "@/components/FormUserInput"
import { useTranslation } from "@/i18n/client"
import { SectionType } from "@/types/Edit"
import { faClock } from "@fortawesome/free-regular-svg-icons"
import { memo } from "react"
import style from "./style.module.scss"

import NumberRange from "@/components/NumberRange"
import { useMainStore } from "@/store/main"
import cs from "classNames/bind"
const cx = cs.bind(style)

function Time({ section }: { section: SectionType }) {
  const { setModal, selected, setSelected, pageLang } = useMainStore([
    "pageLang",
    "setModal",
    "selected",
    "setSelected",
  ])
  const { t } = useTranslation(pageLang, ["edit-page"])
  const { value } = selected[section.index - 1] ?? {}

  const onClickOpenModal = () => {
    setModal({ type: "time", section })
  }

  const reset = () => {
    setSelected({
      section,
      value: [],
    })
  }

  return (
    <div className={cx("layout")}>
      <FormUserInput
        icon={faClock}
        onClick={onClickOpenModal}
        title={section.data.title}
        description={section.data.description}
        isActive={value && value.length > 0}
        resetEvent={reset}
      >
        {value?.length > 0 ? <NumberRange start={value[0].text} end={value[1] && value[1].text} /> : t("none")}
      </FormUserInput>
    </div>
  )
}

export default memo(Time)
