"use client"

import { formSectionList } from "@/config/editorFooter"
import { useInsightStore } from "@/store/insight"
import { SectionType } from "@/types/Edit"
import hasString from "@/utils/helpers/hasString"
import { dateToString } from "@/utils/helpers/setDate"
import { faAddressCard, faCheckSquare, faClose } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import cs from "classnames/bind"
import { useTranslation } from "react-i18next"
import style from "./style.module.scss"
const cx = cs.bind(style)

const filterSubList = {
  calendar: ["specificDate", "anyDate"],
  time: ["specificTime", "anytime"],
}

const FilterList = ({ formSections }: { formSections?: SectionType[] }) => {
  const { curFilter, setCurFilter, setCurFilterAll } = useInsightStore(["curFilter", "setCurFilter", "setCurFilterAll"])
  const { t } = useTranslation(["insight-page"])
  const hasAnyTypeInSection = {
    calendar: !!formSections?.find((v) => v.type === "calendar")?.options?.addAnyDate,
    time: !!formSections?.find((v) => v.type === "time")?.options?.addAnytime,
  }

  const filterList = [
    "none",
    "createdAt",
    ...(formSections?.filter(({ type }) => type === "time" || type === "calendar").map((v) => v.type) ?? []),
  ]

  const selectCurSubMenu = (type: string) => {
    if (type === curFilter.type) return
    switch (type) {
      case "specificDate":
      case "specificTime":
        setCurFilter({ key: "isAnyDateOrAnytime", payload: false })
        break
      case "anyDate":
      case "anytime":
        setCurFilter({ key: "isAnyDateOrAnytime", payload: true })
        break
      default:
        break
    }
  }

  const selectCurMenu = (type: string) => {
    if (type === curFilter.type) return
    switch (type) {
      case "calendar":
      case "createdAt":
        setCurFilterAll({
          endQuery: dateToString(new Date()),
          startQuery: dateToString(new Date()),
          isAnyDateOrAnytime: false,
          type,
        })
        break
      case "time":
        setCurFilterAll({
          endQuery: "00:00",
          startQuery: "00:00",
          isAnyDateOrAnytime: false,
          type,
        })
        break
      default:
        setCurFilterAll({
          endQuery: "",
          startQuery: "",
          isAnyDateOrAnytime: false,
          type,
        })
        break
    }
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
      {((curFilter.type === "calendar" && hasAnyTypeInSection.calendar) ||
        (curFilter.type === "time" && hasAnyTypeInSection.time)) && (
        <div className={cx("sort-list")}>
          {filterSubList[curFilter.type]?.map((type, i) => (
            <button
              key={`sort-list-${type}`}
              className={cx({
                active: (i === 0 && !curFilter.isAnyDateOrAnytime) || (i === 1 && curFilter.isAnyDateOrAnytime),
              })}
              onClick={() => selectCurSubMenu(type)}
            >
              <FontAwesomeIcon icon={faCheckSquare} />
              <span>{t(type)}</span>
            </button>
          ))}
        </div>
      )}
      {(curFilter.type === "calendar" || curFilter.type === "createdAt") && (
        <div className={cx("date-time-filter")}>
          <input
            disabled={curFilter.isAnyDateOrAnytime}
            onChange={(e) => onChangeDateTime("startQuery", e)}
            value={curFilter.startQuery}
            type="date"
          />
          <input
            disabled={curFilter.isAnyDateOrAnytime || !hasString(curFilter.startQuery)}
            onChange={(e) => onChangeDateTime("endQuery", e)}
            value={curFilter.endQuery}
            type="date"
          />
        </div>
      )}
      {curFilter.type === "time" && (
        <div className={cx("date-time-filter")}>
          <input
            disabled={curFilter.isAnyDateOrAnytime}
            onChange={(e) => onChangeDateTime("startQuery", e)}
            value={curFilter.startQuery}
            type="time"
          />
          <input
            disabled={curFilter.isAnyDateOrAnytime || !hasString(curFilter.startQuery)}
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
