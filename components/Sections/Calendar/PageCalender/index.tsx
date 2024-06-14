"use client"

import FormUserInput from "@/components/FormUserInput"
import { SectionType } from "@/types/Edit"
import { faCalendar } from "@fortawesome/free-regular-svg-icons"
import { memo } from "react"
import { useTranslation } from "react-i18next"
import style from "./style.module.scss"

import NumberRange from "@/components/NumberRange"
import { useMainStore } from "@/store/main"
import { stringToDate } from "@/utils/helpers/setDate"
import cs from "classNames/bind"
const cx = cs.bind(style)

function PageCalender({ section }: { section: SectionType }) {
  const { setSelected, selected, setModal, pageLang } = useMainStore([
    "setSelected",
    "selected",
    "setModal",
    "pageLang",
  ])
  const { t } = useTranslation(["edit-page"])

  const { value } = selected[section.index - 1] ?? {}

  const onClickOpenModal = () => {
    setModal({ section, type: section.options.specificDate ? "dateSelect" : "date" })
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
        icon={faCalendar}
        onClick={onClickOpenModal}
        title={section.data.title}
        description={section.data.description}
        isActive={value && value.length > 0}
        resetEvent={reset}
      >
        {value?.length > 0 ? (
          <NumberRange
            start={value[0].text}
            end={value[1] && value[1].text}
            formatter={(date: string) => {
              if (!date.match(/-/g)) return t("anyDate")
              return stringToDate(date, pageLang ?? undefined)
            }}
          />
        ) : (
          ""
        )}
      </FormUserInput>
    </div>
  )
}

export default memo(PageCalender)
