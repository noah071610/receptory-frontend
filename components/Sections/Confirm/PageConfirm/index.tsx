"use client"

import { SectionType } from "@/types/Edit"
import { memo, useMemo } from "react"

import style from "../style.module.scss"

import { useTranslation } from "@/i18n/client"
import { useMainStore } from "@/store/main"
import hasString from "@/utils/helpers/hasString"
import { stringToDate } from "@/utils/helpers/setDate"
import cs from "classNames/bind"
const cx = cs.bind(style)

function PageConfirm({ section }: { section: SectionType }) {
  const { pageLang, selected, curConfirmationId, confirmDate } = useMainStore([
    "pageLang",
    "selected",
    "curConfirmationId",
    "confirmDate",
  ])
  const { t } = useTranslation(pageLang, ["edit-page"])
  const { title, description } = section.data

  const confirmationArr = useMemo(() => {
    if (!selected?.length) return []
    return selected.map(({ value, type, title }, i) => {
      let text = value
        .map((v) => (type === "calendar" ? stringToDate(v.text, pageLang ?? undefined) : v.text))
        .join(type === "select" ? " , " : " ~ ")
      if (!hasString(text)) text = "empty"
      return {
        title,
        text,
        type: section.type,
      }
    })
  }, [selected])

  return (
    <div className={cx("layout")}>
      <div className={cx("confirm-wrapper")}>
        <div className={cx("confirm")}>
          <div className={cx("top")}>
            {hasString(title) && <h1>{title}</h1>}
            {hasString(description) && <p>{description}</p>}
            <ul className={cx("info")}>
              <li>
                <h2>
                  <span>{"예약 번호"}</span>
                </h2>
                <div className={cx("value")}>
                  <span>{curConfirmationId ?? "접수번호 없음"}</span>
                </div>
              </li>
              <li>
                <h2>
                  <span>{"확정 일시"}</span>
                </h2>
                <div className={cx("value")}>
                  <span>{confirmDate ?? "날짜 없음"}</span>
                </div>
              </li>
            </ul>
          </div>
          {confirmationArr?.length > 0 ? (
            <ul className={cx("picks")}>
              {confirmationArr.map(({ title, text, type }, i) => {
                return (
                  <li key={`pick-${type}-${i}`} className={cx("list")}>
                    <h2>
                      <span>{title}</span>
                    </h2>
                    <div className={cx("value")}>
                      <span>{text}</span>
                    </div>
                  </li>
                )
              })}
            </ul>
          ) : (
            <div className={cx("no-list")}>
              <img src="/images/icons/hello.png" alt="hello" />
              <span>유저가 제출하면 예시처럼 표시돼요</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default memo(PageConfirm)
