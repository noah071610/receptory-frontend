"use client"

import NumberRange from "@/components/NumberRange"
import { useTranslation } from "@/i18n/client"
import ModalLayout from ".."
import style from "./style.module.scss"

import { useMainStore } from "@/store/main"
import { SectionType } from "@/types/Edit"
import setDateFormat from "@/utils/helpers/setDate"
import cs from "classNames/bind"
import { useParams } from "next/navigation"
const cx = cs.bind(style)

export const DateSelector = ({ section }: { section: SectionType }) => {
  const { lang } = useParams()
  const { t } = useTranslation()
  const { setModal, setDate } = useMainStore()
  const specificDates = section.collection
  const { addAnyDate } = section.options
  const onClickDate = ({ specificStartDate, specificEndDate }: { specificStartDate: Date; specificEndDate?: Date }) => {
    setDate({
      payload: {
        selectedStartDate: specificStartDate,
        selectedEndDate: specificEndDate ?? null,
      },
    })
    setModal({ section: null, type: null })
  }

  const onClickAnyDate = () => {
    setDate({
      payload: {
        selectedStartDate: "anyDate",
        selectedEndDate: null, // undefined 도 가능
      },
    })
    setModal({ section: null, type: null })
  }

  return (
    <ModalLayout modalStyle={style.content}>
      <ul>
        {specificDates.map(({ specificStartDate, specificEndDate }, i: number) => (
          <li key={`date_${i}`}>
            <button onClick={() => onClickDate({ specificStartDate, specificEndDate })}>
              <NumberRange
                start={specificStartDate}
                end={specificEndDate}
                formatter={(date: Date) => {
                  return setDateFormat(date, lang)
                }}
              />
            </button>
          </li>
        ))}
      </ul>

      {addAnyDate && (
        <div className={cx("btn-wrapper")}>
          <button className={cx("anyDate")} onClick={onClickAnyDate}>
            <span>{t("pickAnyDate")}</span>
          </button>
        </div>
      )}
    </ModalLayout>
  )
}

export default DateSelector
