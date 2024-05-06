"use client"

import { useTranslation } from "@/i18n/client"
import { useEditorStore } from "@/store/editor"
import setDate from "@/utils/setDate"
import classNames from "classNames"
import ModalLayout from ".."
import style from "./style.module.scss"

const cx = classNames.bind(style)

export const DateSelector = () => {
  const { t } = useTranslation()
  const { selectedSection, setValue, setActive } = useEditorStore()
  const specificDates = selectedSection?.collection ?? []
  const { addAnyDate } = selectedSection?.options ?? {}
  const onClickDate = ({ specificStartDate, specificEndDate }: { specificStartDate: Date; specificEndDate?: Date }) => {
    setValue({
      payload: {
        selectedStartDate: specificStartDate,
        selectedEndDate: specificEndDate,
      },
    })
    setActive({ key: "modal", payload: { type: null } })
  }

  const onClickAnyDate = () => {
    setValue({
      payload: {
        selectedStartDate: "anyDate",
        selectedEndDate: undefined,
      },
    })
    setActive({ key: "modal", payload: { type: null } })
  }

  return (
    <ModalLayout modalStyle={style.content}>
      <ul>
        {specificDates.map(({ specificStartDate, specificEndDate }, i: number) => (
          <li key={`date_${i}`}>
            <button onClick={() => onClickDate({ specificStartDate, specificEndDate })}>
              <span>{setDate(specificStartDate)}</span>
              {specificEndDate && <span>{" ~ "}</span>}
              {specificEndDate && <span>{setDate(specificEndDate)}</span>}
            </button>
          </li>
        ))}
      </ul>

      {addAnyDate && (
        <div className={cx(style["btn-wrapper"])}>
          <button onClick={onClickAnyDate}>
            <span>{t("pickAnyDate")}</span>
          </button>
        </div>
      )}
    </ModalLayout>
  )
}

export default DateSelector
