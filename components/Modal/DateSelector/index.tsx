"use client"

import { useTranslation } from "@/i18n/client"
import { useEditorStore } from "@/store/editor"
import classNames from "classNames"
import dayjs from "dayjs"
import ModalLayout from ".."
import style from "./style.module.scss"

const cx = classNames.bind(style)

export const DateSelector = () => {
  const { t } = useTranslation()
  const { selectedSection, setValue, setActive } = useEditorStore()
  const selectedSpecificDates = selectedSection?.options?.selectedSpecificDates ?? []
  const onClickDate = (v: Date) => {
    setValue({ payload: [v] })
    setActive({ key: "modal", payload: { type: null } })
  }

  return (
    <ModalLayout modalStyle={style.content}>
      <ul>
        {selectedSpecificDates.map((v: Date, i: number) => (
          <li key={`date_${i}`}>
            <button onClick={() => onClickDate(v)}>{dayjs(v).format("DD/MM/YYYY")}</button>
          </li>
        ))}
      </ul>
    </ModalLayout>
  )
}

export default DateSelector
