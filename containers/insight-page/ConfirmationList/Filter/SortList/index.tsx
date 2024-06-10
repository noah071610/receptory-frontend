"use client"

import { formSectionList } from "@/config/editorFooter"
import { useInsightStore } from "@/store/insight"
import { SectionType } from "@/types/Edit"
import { faAddressCard, faArrowDownShortWide, faArrowUpShortWide } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import cs from "classNames/bind"
import { useTranslation } from "react-i18next"
import style from "./style.module.scss"
const cx = cs.bind(style)

const SortList = ({ formSections }: { formSections?: SectionType[] }) => {
  const { curSort, setCurSort } = useInsightStore(["curSort", "setCurSort"])

  const { t } = useTranslation(["insight-page"])

  const sortList = [
    "createdAt",
    ...(formSections
      ?.filter(({ type }) => type === "time" || type === "calendar")
      .map((v) => (v.type === "calendar" ? "startDate" : "startTime")) ?? []),
  ]

  const selectCurMenu = (type: string) => {
    if (type === curSort.sort) return
    setCurSort({ key: "sort", payload: type })
  }

  const onClickOrderby = (type: "desc" | "asc") => {
    if (type === curSort.orderby) return
    setCurSort({ key: "orderby", payload: type })
  }

  return (
    <div className={cx("sort-wrapper", "divide")}>
      <div className={cx("sort-list")}>
        {sortList.map((sort) => (
          <button
            key={`sort-list-${sort}`}
            className={cx({ active: curSort.sort === sort })}
            onClick={() => selectCurMenu(sort)}
          >
            <FontAwesomeIcon icon={formSectionList.find(({ value }) => value === sort)?.icon ?? faAddressCard} />
            <span>{t(sort)}</span>
          </button>
        ))}
      </div>
      <div className={cx("sort-list")}>
        {["desc", "asc"].map((orderby) => (
          <button
            key={`sort-list-${orderby}`}
            className={cx({ active: curSort.orderby === orderby })}
            onClick={() => onClickOrderby(orderby as "desc" | "asc")}
          >
            <FontAwesomeIcon icon={orderby === "desc" ? faArrowDownShortWide : faArrowUpShortWide} />
            <span>{t(orderby)}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

export default SortList
