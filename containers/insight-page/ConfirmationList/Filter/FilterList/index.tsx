"use client"

import { formSectionList } from "@/config/editorFooter"
import { useInsightStore } from "@/store/insight"
import { SectionType } from "@/types/Edit"
import hasString from "@/utils/helpers/hasString"
import { faAddressCard, faClose } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import cs from "classnames/bind"
import { useTranslation } from "react-i18next"
import style from "./style.module.scss"
const cx = cs.bind(style)

const FilterList = ({ formSections }: { formSections?: SectionType[] }) => {
  const { curFilter, setCurFilter, setCurFilterAll } = useInsightStore(["curFilter", "setCurFilter", "setCurFilterAll"])

  const { t } = useTranslation(["insight-page"])

  const filterList = [
    "none",
    "createdAt",
    ...(formSections?.filter(({ type }) => type === "time" || type === "calendar").map((v) => v.type) ?? []),
  ]

  const selectCurMenu = (type: string) => {
    if (type === curFilter.type) return
    setCurFilterAll({
      endQuery: "",
      startQuery: "",
      type,
    })
  }

  const onChangeDateTime = (key: "startQuery" | "endQuery", e: any) => {
    setCurFilter({ key, payload: e.target.value })
  }

  return (
    <div className={cx("sort-wrapper")}>
      <div className={cx("sort-list")}>
        {filterList.map((type) => (
          <button
            key={`sort-list-${type}`}
            className={cx({ active: curFilter.type === type })}
            onClick={() => selectCurMenu(type)}
          >
            <FontAwesomeIcon
              icon={
                formSectionList.find(({ value }) => value === type)?.icon ?? (type === "none" ? faClose : faAddressCard)
              }
            />
            <span>{t(type)}</span>
          </button>
        ))}
      </div>
      {(curFilter.type === "calendar" || curFilter.type === "createdAt") && (
        <div className={cx("date-time-filter")}>
          <input onChange={(e) => onChangeDateTime("startQuery", e)} value={curFilter.startQuery} type="date" />
          <input
            disabled={!hasString(curFilter.startQuery)}
            onChange={(e) => onChangeDateTime("endQuery", e)}
            value={curFilter.endQuery}
            type="date"
          />
        </div>
      )}
      {curFilter.type === "time" && (
        <div className={cx("date-time-filter")}>
          <input onChange={(e) => onChangeDateTime("startQuery", e)} value={curFilter.startQuery} type="time" />
          <input
            disabled={!hasString(curFilter.startQuery)}
            onChange={(e) => onChangeDateTime("endQuery", e)}
            value={curFilter.endQuery}
            type="time"
          />
        </div>
      )}
    </div>
  )
}

export default FilterList
