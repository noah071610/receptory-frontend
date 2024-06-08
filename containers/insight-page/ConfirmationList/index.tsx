"use client"

import { getConfirmations } from "@/actions/insight"
import { formSectionList } from "@/config/editorFooter"
import { useInsightStore } from "@/store/insight"
import { SectionType } from "@/types/Edit"
import { AnalyserConfirmation, SelectChartLabel } from "@/types/Insight"
import hasString from "@/utils/helpers/hasString"
import {
  faAddressCard,
  faArrowDownShortWide,
  faArrowUpShortWide,
  faClose,
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useInfiniteQuery } from "@tanstack/react-query"
import cs from "classNames/bind"
import { useParams } from "next/navigation"
import { useEffect, useMemo, useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import Confirmation from "./ConfirmationList copy"
import style from "./style.module.scss"
const cx = cs.bind(style)

const ConfirmationList = ({
  list,
  selectChartArr,
  choicesChartArr,
  formSections,
}: {
  list: any
  formSections?: SectionType[]
  selectChartArr: SelectChartLabel[]
  choicesChartArr: SelectChartLabel[]
}) => {
  const { curFilter, setCurFilter, setCurFilterAll, isFilterUpdate, setIsFilterUpdate } = useInsightStore()
  const { pageId } = useParams()
  const { t } = useTranslation()

  const [searchInput, setSearchInput] = useState({
    temp: "",
    query: "",
  })
  const [curSort, setCurSort] = useState({
    orderby: "createdAt",
    sort: "desc",
  })

  console.log(curFilter)

  const { data, refetch } = useInfiniteQuery<AnalyserConfirmation[], Error>({
    queryKey: ["projects"],
    queryFn: ({ pageParam }) =>
      getConfirmations({
        cursor: pageParam,
        pageId: pageId as string,
        curFilter,
        curSort,
        searchInput: searchInput.query,
      }),
    initialPageParam: 0,
    getNextPageParam: (_, pages) => pages.length,
    // initialData:list,
  })

  const filterList = [
    "none",
    "createdAt",
    ...(formSections?.filter(({ type }) => type === "time" || type === "calendar").map((v) => v.type) ?? []),
  ]
  const sortList = [
    "createdAt",
    ...(formSections
      ?.filter(({ type }) => type === "time" || type === "calendar")
      .map((v) => (v.type === "calendar" ? "startDate" : "startTime")) ?? []),
  ]

  const inputRef = useRef<HTMLInputElement>(null)

  const onChangeInput = (str: string) => {
    setSearchInput((prev) => ({
      ...prev,
      temp: str,
    }))
  }
  const onFocus = () => {
    if (inputRef?.current) {
      inputRef.current.focus()
    }
  }

  const selectCurMenu = (type: string, isSort?: boolean) => {
    if (isSort) {
      if (type === curSort.orderby) return
      setCurSort((prev) => ({
        sort: prev.sort,
        orderby: type,
      }))
    } else {
      if (type === curFilter.type) return
      setCurFilterAll({
        endQuery: "",
        startQuery: "",
        type,
      })
    }
  }

  const onClickOrderby = (type: "desc" | "asc") => {
    if (type === curSort.sort) return
    setCurSort((prev) => ({
      orderby: prev.orderby,
      sort: type,
    }))
  }

  const onChangeDateTime = (key: "startQuery" | "endQuery", e: any) => {
    setCurFilter({ key, payload: e.target.value })
  }

  const isReadyToFilter = useMemo(() => {
    switch (curFilter.type) {
      case "none":
        return true
      case "calendar":
      case "createdAt":
      case "time":
        return !!curFilter.startQuery
      default:
        break
    }
  }, [curFilter])

  const onClickSubmitFilter = () => {
    setSearchInput((prev) => ({
      query: prev.temp,
      temp: prev.temp,
    }))
    refetch()
  }

  const handleKeyPress = (e: any) => {
    if (e.key === "Enter") {
      onClickSubmitFilter()
    }
  }

  useEffect(() => {
    if (isFilterUpdate) {
      refetch()
      setIsFilterUpdate(false)
    }
  }, [isFilterUpdate])

  const lists = data?.pages.flat()

  return (
    <div className={cx("layout")}>
      <div className={cx("search")}>
        {/* <button className={cx("slide-btn")}>
          <div className={cx("bar")}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </button> */}
        <div className={cx("input")}>
          <div className={cx("content", { active: searchInput.temp.trim().length > 0 })}>
            <input
              placeholder="예약 번호 및 키워드로 찾기"
              ref={inputRef}
              type="text"
              value={searchInput.temp}
              onChange={(e) => onChangeInput(e.target.value)}
              onKeyDown={handleKeyPress}
            />
            <button
              onClick={searchInput.temp.trim().length > 0 ? onClickSubmitFilter : onFocus}
              className={cx("icon-wrapper")}
            >
              <div className={cx("icon")}>
                <FontAwesomeIcon icon={faMagnifyingGlass} />
              </div>
            </button>
          </div>
        </div>
        <div className={cx("sort-wrapper", "divide")}>
          <div className={cx("sort-list")}>
            {sortList.map((orderby) => (
              <button
                key={`sort-list-${orderby}`}
                className={cx({ active: curSort.orderby === orderby })}
                onClick={() => selectCurMenu(orderby, true)}
              >
                <FontAwesomeIcon icon={formSectionList.find(({ value }) => value === orderby)?.icon ?? faAddressCard} />
                <span>{orderby}</span>
              </button>
            ))}
          </div>
          <div className={cx("sort-list")}>
            {["desc", "asc"].map((type) => (
              <button
                key={`sort-list-${type}`}
                className={cx({ active: curSort.sort === type })}
                onClick={() => onClickOrderby(type as "desc" | "asc")}
              >
                <FontAwesomeIcon icon={type === "desc" ? faArrowDownShortWide : faArrowUpShortWide} />
                <span>{type}</span>
              </button>
            ))}
          </div>
        </div>

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
                    formSectionList.find(({ value }) => value === type)?.icon ??
                    (type === "none" ? faClose : faAddressCard)
                  }
                />
                <span>{type}</span>
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

        <div className={cx("btn-wrapper")}>
          <button onClick={onClickSubmitFilter} disabled={!isReadyToFilter}>
            <span>적용하기</span>
          </button>
        </div>
      </div>
      <div className={cx("list-container")}>
        {lists && lists?.length > 0 ? (
          lists.map((v, i) => <Confirmation v={v} searchInput={searchInput.query} key={`list-${i}`} />)
        ) : (
          <div className={cx("no-list")}>
            <img src="/images/icons/disappointed.png" alt="disappointed" />
            <span>검색 결과가 없네요</span>
          </div>
        )}
      </div>
    </div>
  )
}

export default ConfirmationList
