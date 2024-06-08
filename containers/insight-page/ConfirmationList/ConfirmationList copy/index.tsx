"use client"

import { AnalyserConfirmation } from "@/types/Insight"
import { SelectedType } from "@/types/Main"
import hasString from "@/utils/helpers/hasString"
import { setDateFormat, stringToDate } from "@/utils/helpers/setDate"
import { faChevronDown } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import cs from "classNames/bind"
import { useEffect, useMemo, useState } from "react"
import style from "./style.module.scss"
const cx = cs.bind(style)

const Confirmation = ({ searchInput, v }: { searchInput: string; v: AnalyserConfirmation }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [content, setContent] = useState<null | any>(null)
  const onClickOpen = () => {
    setIsOpen((b) => !b)
  }

  useEffect(() => {
    if (isOpen && !content) {
      setContent(JSON.parse(v.content))
    }
  }, [isOpen])

  const confirmationArr = useMemo(() => {
    const selected: SelectedType[] = JSON.parse(v.content)
    console.log(selected)

    if (!selected?.length) return []
    return selected.map(({ value, type, title }, i) => {
      let text = value
        .map((v) => (type === "calendar" ? stringToDate(v.text, undefined) : v.text))
        .join(type === "select" ? " , " : " ~ ")
      if (!hasString(text)) text = "empty"
      return {
        title,
        text,
        type,
      }
    })
  }, [v.content])

  const highlightText = (text: string) => {
    if (!hasString(searchInput)) return text
    const parts = text.split(new RegExp(`(${searchInput})`, "gi"))
    return parts.map((part: string, index: number) =>
      part === searchInput ? (
        <span className={cx("point")} key={index}>
          {part}
        </span>
      ) : (
        part
      )
    )
  }

  return (
    <div className={cx("list")}>
      <div className={cx("top")}>
        <button onClick={onClickOpen} className={cx("opener", { isOpen })}>
          <FontAwesomeIcon icon={faChevronDown} />
        </button>
        <p>
          <span>{highlightText(v.confirmId)}</span>
          {/* <div style={{ backgroundColor: v.isConfirmed ? colors.green : colors.red }} className={cx("circle")}></div> */}
        </p>
        <span>{setDateFormat({ date: v.createdAt, lang: "ko", isTime: true })}</span>
      </div>
      {isOpen && (
        <div className={cx("main")}>
          <ul className={cx("picks")}>
            {confirmationArr.map(({ title, text, type }, i) => {
              return (
                <li key={`pick-${type}-${i}`} className={cx("info-list")}>
                  <h5>
                    <span>{title}</span>
                  </h5>
                  <div className={cx("value")}>
                    <span>{highlightText(text)}</span>
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
      )}
    </div>
  )
}

export default Confirmation
