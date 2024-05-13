"use client"

import FormUserInput from "@/components/FormUserInput"
import { useTranslation } from "@/i18n/client"
import { SectionType } from "@/types/Edit"
import { faCalendar } from "@fortawesome/free-regular-svg-icons"
import { memo } from "react"
import style from "./style.module.scss"

import NumberRange from "@/components/NumberRange"
import { useMainStore } from "@/store/main"
import cs from "classNames/bind"
import { useParams } from "next/navigation"
const cx = cs.bind(style)

function PageCalender({ section }: { section: SectionType }) {
  const { lang } = useParams()
  const { t } = useTranslation()
  const { setUserPick, userPick, setModal } = useMainStore()
  const { value } = userPick[section.id] ?? {}

  const onClickOpenModal = () => {
    setModal({ section, type: "date" })
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
        icon={faCalendar}
        onClick={onClickOpenModal}
        title={section.data.title}
        description={section.data.description}
        isActive={value && value.length > 0}
        resetEvent={reset}
      >
        {value?.length > 0 && <NumberRange start={value[0].text} end={value[1] && value[1].text} />}
      </FormUserInput>
    </div>
  )
}

export default memo(PageCalender)
