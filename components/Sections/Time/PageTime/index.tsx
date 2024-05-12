"use client"

import FormUserInput from "@/components/FormUserInput"
import { useTranslation } from "@/i18n/client"
import { SectionType } from "@/types/Edit"
import { faClock } from "@fortawesome/free-regular-svg-icons"
import { memo } from "react"
import style from "./style.module.scss"

import { useMainStore } from "@/store/main"
import hasString from "@/utils/helpers/hasString"
import cs from "classNames/bind"
const cx = cs.bind(style)

function Time({ section }: { section: SectionType }) {
  const { t } = useTranslation()
  const {
    setModal,
    setTime,
    time: { selectedStartTime, selectedEndTime },
  } = useMainStore()

  const onClickOpenModal = () => {
    setModal({ type: "time", section })
  }

  const reset = () => {
    setTime({
      payload: {
        selectedEndTime: null,
        selectedStartTime: null,
      },
    })
  }

  return (
    <div className={cx("layout")}>
      <FormUserInput
        icon={faClock}
        onClick={onClickOpenModal}
        title={section.data.title}
        description={section.data.description}
        isActive={!!hasString(selectedStartTime)}
        resetEvent={reset}
      >
        {!selectedStartTime && t("날짜 입력")}
        {!!selectedStartTime && <span>{selectedStartTime === "anytime" ? t("anytime") : selectedStartTime}</span>}
        {!!selectedEndTime && <span>{" ~ "}</span>}
        {!!selectedEndTime && <span>{selectedEndTime}</span>}
      </FormUserInput>
    </div>
  )
}

export default memo(Time)
