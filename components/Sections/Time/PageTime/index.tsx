"use client"

import FormUserInput from "@/components/FormUserInput"
import { SectionType } from "@/types/Edit"
import { faClock } from "@fortawesome/free-regular-svg-icons"
import { memo } from "react"
import { useTranslation } from "react-i18next"
import style from "./style.module.scss"

import NumberRange from "@/components/NumberRange"
import { useMainStore } from "@/store/main"
import cs from "classNames/bind"
const cx = cs.bind(style)

function Time({ section }: { section: SectionType }) {
  const { t } = useTranslation()
  const { setModal, userPick, setUserPick } = useMainStore()
  const { value } = userPick[section.id] ?? {}

  const onClickOpenModal = () => {
    setModal({ type: "time", section })
  }

  const reset = () => {
    setUserPick({
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
