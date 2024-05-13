"use client"

import { SectionType } from "@/types/Edit"
import { useParams, useRouter } from "next/navigation"
import { memo, useEffect, useMemo } from "react"

import style from "../style.module.scss"

import { useTranslation } from "@/i18n/client"
import { useMainStore } from "@/store/main"
import hasString from "@/utils/helpers/hasString"
import setDateFormat from "@/utils/helpers/setDate"
import cs from "classNames/bind"
const cx = cs.bind(style)

const confirmationIdExample = 12345678912

function PageConfirm({ section, isEditor }: { section: SectionType; isEditor?: boolean }) {
  const { lang } = useParams()
  const { t } = useTranslation()
  const { back } = useRouter()
  const { userPick } = useMainStore()
  const { title, description } = section.data

  const confirmationArr = useMemo(() => {
    const pickArr = Object.entries(userPick).toSorted((a, b) => a[1].index - b[1].index)
    if (!pickArr?.length) return []
    return pickArr.map(([id, { title, value, type }]) => {
      let text = value.map((v) => v.text).join(type === "select" ? " , " : " ~ ")
      if (!hasString(text)) text = "empty"
      return {
        title,
        text,
        type: section.type,
      }
    })
  }, [userPick])

  useEffect(() => {
    if (confirmationArr?.length <= 0 && !isEditor) {
      back()
    }
  }, [isEditor, confirmationArr])

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
                  <span>{confirmationIdExample}</span>
                </div>
              </li>
              <li>
                <h2>
                  <span>{"확정 일시"}</span>
                </h2>
                <div className={cx("value")}>
                  <span>{setDateFormat(new Date(), lang)}</span>
                </div>
              </li>
            </ul>
          </div>
          {!isEditor && confirmationArr?.length > 0 ? (
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
