"use client"

import NumberRange from "@/components/NumberRange"
import { useTranslation } from "react-i18next"
import ModalLayout from ".."
import style from "./style.module.scss"

import { useMainStore } from "@/store/main"
import { SectionType } from "@/types/Edit"
import { stringToDate } from "@/utils/helpers/setDate"
import cs from "classNames/bind"
const cx = cs.bind(style)

export const DateSelector = ({ section }: { section: SectionType }) => {
  const { t } = useTranslation()
  const { setModal, setSelected, pageLang } = useMainStore()
  const specificDates = section.collection
  const { addAnyDate } = section.options
  const onClickDate = ({
    specificStartDate,
    specificEndDate,
  }: {
    specificStartDate: string
    specificEndDate?: string
  }) => {
    setSelected({
      section,
      value: specificEndDate
        ? [
            { key: "startDate", text: specificStartDate },
            { key: "endDate", text: specificEndDate },
          ]
        : [{ key: "startDate", text: specificStartDate }],
    })
    setModal({ section: null, type: null })
  }

  const onClickAnyDate = () => {
    setSelected({
      section,
      value: [{ key: "anyDate", text: t("anyDate") }],
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
                formatter={(stringDate: string) => {
                  return stringToDate(stringDate, pageLang ?? undefined)
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
