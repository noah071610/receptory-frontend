"use client"

import Input from "@/components/Input"
import { SectionType } from "@/types/Edit"
import getContrastTextColor from "@/utils/styles/getContrastTextColor"
import cs from "classNames/bind"
import { memo, useMemo } from "react"
import { useTranslation } from "react-i18next"
import style from "./style.module.scss"
const cx = cs.bind(style)

function LinkBtn({ section, isDisplayMode }: { section: SectionType; isDisplayMode?: boolean }) {
  const { t } = useTranslation(["edit-page"])
  const text = section.value
  const { backgroundColor } = section.style
  const { link } = section.data
  const textColor = useMemo(() => getContrastTextColor(backgroundColor ?? "rgba(0,0,0,1)"), [backgroundColor])

  return (
    <div className={cx("layout")}>
      <div className={cx("btn-wrapper")}>
        <a href={isDisplayMode ? link : undefined} style={{ backgroundColor }} className={cx("link")}>
          <Input
            type="input"
            displayMode={isDisplayMode && "span"}
            inputType="btn"
            isOptional={false}
            style={{ color: textColor }}
            value={text}
            section={section}
          />
        </a>
      </div>
      {!isDisplayMode && (
        <div className={cx("options")}>
          <h4>
            <span>{t("linkSetting")}</span>
          </h4>
          <Input
            type="input"
            inputType={`LinkPlaceholder`}
            className={cx("link-input")}
            isOptional={false}
            maxLength={100}
            dataKey={"link"}
            value={link}
            section={section}
          />
        </div>
      )}
    </div>
  )
}

export default memo(LinkBtn)
