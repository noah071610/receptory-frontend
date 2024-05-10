"use client"

import FormUserInput from "@/components/FormUserInput"
import { useTranslation } from "@/i18n/client"
import { SectionType } from "@/types/Edit"
import setDateFormat from "@/utils/helpers/setDate"
import { faCalendar } from "@fortawesome/free-regular-svg-icons"
import { memo } from "react"
import style from "./style.module.scss"

import { useMainStore } from "@/store/main"
import cs from "classNames/bind"
const cx = cs.bind(style)

function PageCalender({ section }: { section: SectionType }) {
  const { t } = useTranslation()
  const {
    date: { selectedStartDate, selectedEndDate },
    setModal,
  } = useMainStore()

  const onClickOpenModal = () => {
    setModal({ section, type: "date" })
  }

  return (
    <div className={cx("layout")}>
      <FormUserInput
        icon={faCalendar}
        onClick={onClickOpenModal}
        title={section.data.title}
        description={section.data.description}
      >
        {!selectedStartDate && t("날짜 입력")}
        {selectedStartDate && (
          <span>{selectedStartDate === "anyDate" ? t("anyDate") : setDateFormat(selectedStartDate)}</span>
        )}
        {selectedEndDate && <span>{" ~ "}</span>}
        {selectedEndDate && <span>{setDateFormat(selectedEndDate)}</span>}
      </FormUserInput>
    </div>
  )
}

export default memo(PageCalender)
