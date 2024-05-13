"use client"

import { SectionType } from "@/types/Edit"
import { useParams } from "next/navigation"
import { memo, useMemo } from "react"

import style from "./style.module.scss"

import Input from "@/components/Input"
import { useTranslation } from "@/i18n/client"
import { useEditorStore } from "@/store/editor"
import { useMainStore } from "@/store/main"
import setDateFormat from "@/utils/helpers/setDate"
import cs from "classNames/bind"
const cx = cs.bind(style)

const confirmationIdExample = 12345678912

const getExample = (type: any, lang: any) => {
  switch (type) {
    case "calender": {
      const today = new Date()
      const anotherDay1 = today.setDate(today.getDate() + 4)
      const anotherDay2 = today.setDate(today.getDate() + 12)
      return `${setDateFormat(new Date(anotherDay1), lang)} ~ ${setDateFormat(new Date(anotherDay2), lang)}`
    }
    case "time":
      return "10:00 AM ~ 06:00 PM"
    case "select":
      return "selectExample"
    case "choices":
      return "choicesExample"
    case "textInput":
      return "textInputExample"
    case "numberInput":
      return `${Math.floor(1000 + Math.random() * 9000)}`
    case "phone":
      return "010-1234-5678"
    case "email":
      return "example@gmail.com"
    default:
      return ""
  }
}

function Confirm({ section }: { section: SectionType }) {
  const { lang } = useParams()
  const { t } = useTranslation()
  const { formSections } = useEditorStore()
  const { userPick } = useMainStore()
  const { title, description } = section.data

  const confirmationArr = useMemo(() => {
    let arr = []
    for (let i = 0; i < formSections.length; i++) {
      const section = formSections[i]
      if (["text", "title", "callout", "checkList", "thumbnail"].includes(section.type)) {
        continue
      }
      const title = section.data?.title ?? "타이틀 입력"

      let text = getExample(section.type, lang)

      arr.push({
        title,
        text,
        type: section.type,
      })
    }
    return arr
  }, [formSections])

  return (
    <div className={cx("layout")}>
      <div className={cx("confirm-wrapper")}>
        <div className={cx("confirm")}>
          <div className={cx("top")}>
            <Input
              type="input"
              inputType="title"
              className={cx("title-input")}
              isOptional={false}
              maxLength={18}
              dataKey={"title"}
              value={title}
              section={section}
            />
            <Input
              type="textarea"
              inputType="description"
              className={cx("description-input")}
              isOptional={true}
              maxLength={40}
              lineMax={3}
              dataKey={"description"}
              value={description}
              section={section}
            />
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
        </div>
      </div>
    </div>
  )
}

export default memo(Confirm)
