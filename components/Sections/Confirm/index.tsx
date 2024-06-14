"use client"

import { SectionType } from "@/types/Edit"
import { memo, useMemo } from "react"

import style from "./style.module.scss"

import Input from "@/components/Input"
import { useEditorStore } from "@/store/editor"
import getConfirmationId from "@/utils/helpers/getConfirmationId"
import { setDateFormat } from "@/utils/helpers/setDate"
import cs from "classnames/bind"
import { useTranslation } from "react-i18next"
const cx = cs.bind(style)

function Confirm({ section, isDisplayMode }: { section: SectionType; isDisplayMode?: boolean }) {
  const { t } = useTranslation(["edit-page"])
  const { pageOptions } = useEditorStore(["pageOptions"])
  const { title, description } = section.data

  const exampleId = useMemo(() => getConfirmationId(), [])

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
              displayMode={isDisplayMode && "h1"}
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
              displayMode={isDisplayMode && "p"}
              value={description}
              section={section}
            />
            <ul className={cx("info")}>
              <li>
                <h2>
                  <span>{t("confirmationId")}</span>
                </h2>
                <div className={cx("value")}>
                  <span>{exampleId + " (Example)"}</span>
                </div>
              </li>
              <li>
                <h2>
                  <span>{t("confirmationDate")}</span>
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
              <span>{t("confirmExampleDescription")}</span>
            </div>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default memo(Confirm)
