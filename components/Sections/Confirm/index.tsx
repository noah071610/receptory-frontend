"use client"

import { SectionType } from "@/types/Edit"
import { memo } from "react"

import style from "./style.module.scss"

import Input from "@/components/Input"
import { useTranslation } from "@/i18n/client"
import { useEditorStore } from "@/store/editor"
import { useMainStore } from "@/store/main"
import { setDateFormat } from "@/utils/helpers/setDate"
import cs from "classNames/bind"
const cx = cs.bind(style)

function Confirm({ section }: { section: SectionType }) {
  const { pageLang } = useMainStore(["pageLang"])
  const { t } = useTranslation(pageLang, ["edit-page"])
  const { pageOptions } = useEditorStore(["pageOptions"])
  const { title, description } = section.data

  return (
    <div className={cx("layout")}>
      <div className={cx("confirm-wrapper")}>
        <div className={cx("confirm")}>
          <div className={cx("top")}>
            <Input
              type="input"
              inputType="titleInput"
              className={cx("title-input")}
              isOptional={false}
              maxLength={18}
              dataKey={"title"}
              value={title}
              section={section}
            />
            <Input
              type="textarea"
              inputType="descriptionInput"
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
                  <span>{t("confirmationIdExample")}</span>
                </div>
              </li>
              <li>
                <h2>
                  <span>{"확정 일시"}</span>
                </h2>
                <div className={cx("value")}>
                  <span>{setDateFormat({ date: new Date(), lang: pageOptions.lang, isTime: true })}</span>
                </div>
              </li>
            </ul>
          </div>
          <ul className={cx("picks")}>
            <div className={cx("no-list")}>
              <img src="/images/icons/hello.png" alt="hello" />
              <span>유저가 제출하면 예시처럼 표시돼요</span>
            </div>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default memo(Confirm)
