"use client"

import { formSectionList } from "@/config/editorFooter"
import { SectionListTypes } from "@/types/Edit"
import {
  faArrowDownWideShort,
  faArrowUpWideShort,
  faCalendar,
  faCheck,
  faClock,
  faClose,
  faMagnifyingGlass,
  faUserAstronaut,
} from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import cs from "classNames/bind"
import { useRef, useState } from "react"
import { FreeMode } from "swiper/modules"
import { Swiper, SwiperSlide } from "swiper/react"
import style from "./style.module.scss"
const cx = cs.bind(style)

const ConfirmationList = ({ list, formSectionTypes }: { list: any; formSectionTypes?: SectionListTypes[] }) => {
  const [input, setInput] = useState("")
  const [isOpenSortMenu, setIsOpenSortMenu] = useState(false)
  const [curSort, setCurSort] = useState({
    type: "submit",
    orderby: "desc",
  })
  const sortList = ["submit", ...(formSectionTypes?.filter((v) => "calendar" === v || "time" === v) ?? [])]

  const [curFilter, setCurFilter] = useState<null | SectionListTypes>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const onClickSortMenu = () => {
    setIsOpenSortMenu((prev) => !prev)
  }
  const onChangeInput = (str: string) => {
    setInput(str)
  }
  const onFocus = () => {
    if (inputRef?.current) {
      inputRef.current.focus()
    }
  }

  const selectCurSort = (type: string) => {
    setIsOpenSortMenu(false)
    if (type === curSort.type) return
    setCurSort((prev) => ({
      type,
      orderby: prev.orderby,
    }))
  }
  const onClickFilter = (type: SectionListTypes) => {
    setCurFilter(type)
  }
  const onClickOrderby = () => {
    setCurSort((prev) => ({
      type: prev.type,
      orderby: prev.orderby === "desc" ? "asc" : "desc",
    }))
  }

  return (
    <div className={cx("list")}>
      <div className={cx("input")}>
        <div className={cx("content", { active: input.trim().length > 0 })}>
          <input
            placeholder="예약 번호로 찾기"
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => onChangeInput(e.target.value)}
          />
          <button onClick={input.trim().length > 0 ? () => onChangeInput("") : onFocus} className={cx("icon-wrapper")}>
            <div className={cx("icon", "before")}>
              <FontAwesomeIcon icon={faMagnifyingGlass} />
            </div>
            <div className={cx("icon", "after")}>
              <FontAwesomeIcon icon={faClose} />
            </div>
          </button>
        </div>
      </div>
      <h4>정렬</h4>
      <div className={cx("sort-wrapper")}>
        <div className={cx("sort-select")}>
          <button className={cx("btn", "active")} onClick={onClickSortMenu}>
            <FontAwesomeIcon
              icon={curSort.type === "submit" ? faUserAstronaut : curSort.type === "calendar" ? faCalendar : faClock}
            />
            <span>{curSort.type}</span>
          </button>
          {isOpenSortMenu && (
            <div className={cx("sort-list")}>
              {sortList.map((type) => (
                <button className={cx({ active: curSort.type === type })} onClick={() => selectCurSort(type)}>
                  <FontAwesomeIcon
                    icon={type === "submit" ? faUserAstronaut : type === "calendar" ? faCalendar : faClock}
                  />
                  <span>{type}</span>
                </button>
              ))}
            </div>
          )}
        </div>
        <button className={cx("btn", "orderby")} onClick={onClickOrderby}>
          <FontAwesomeIcon icon={curSort.orderby === "asc" ? faArrowUpWideShort : faArrowDownWideShort} />
          <span>{curSort.orderby}</span>
        </button>
      </div>

      <h4>필터</h4>
      <Swiper className={cx("slider")} spaceBetween={5} slidesPerView={"auto"} modules={[FreeMode]}>
        {formSectionTypes?.map((type) => {
          return (
            <SwiperSlide className={cx("slide")} key={`filter-${type}`}>
              <button className={cx("btn", { active: type === curFilter })} onClick={() => onClickFilter(type)}>
                <FontAwesomeIcon icon={formSectionList.find(({ value }) => value === type)?.icon ?? faCheck} />
                <span>{type}</span>
              </button>
            </SwiperSlide>
          )
        })}
      </Swiper>
    </div>
  )
}

export default ConfirmationList
