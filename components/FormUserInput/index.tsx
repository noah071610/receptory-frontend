"use client"

import { IconDefinition } from "@fortawesome/fontawesome-svg-core"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import cs from "classNames/bind"
import { ReactNode, memo } from "react"
import style from "./style.module.scss"
const cx = cs.bind(style)

function FormUserInput({
  title,
  description,
  onClick,
  children,
  icon,
  inputStyle,
  isMultiple,
}: {
  title: string
  description: string
  onClick?: () => void
  children: ReactNode
  icon: IconDefinition
  inputStyle?: string
  isMultiple?: boolean
}) {
  return (
    <div className={cx("input-wrapper")}>
      <label className={cx("title")}>
        <h2>{title}</h2>
        <p>{description}</p>
      </label>
      <div onClick={onClick} className={cx("input")}>
        <div className={cx("content")}>
          {inputStyle ? children : <div className={cx("text", { isMultiple })}>{children}</div>}
          {inputStyle !== "textarea" && (
            <button className={cx("icon")}>
              <FontAwesomeIcon icon={icon} />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
export default memo(FormUserInput)
