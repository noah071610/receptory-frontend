"use client"

import { IconDefinition } from "@fortawesome/fontawesome-svg-core"
import { faClose } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import cs from "classnames/bind"
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
  isActive,
  resetEvent,
  onFocus,
  noTitle,
}: {
  title: string
  description: string
  onClick?: () => void
  resetEvent: () => void
  children: ReactNode
  icon: IconDefinition
  inputStyle?: string
  isMultiple?: boolean
  isActive?: boolean
  onFocus?: () => void
  noTitle?: boolean
}) {
  return (
    <div className={cx("input-wrapper")}>
      {!noTitle && (
        <label className={cx("title")}>
          <h2>{title}</h2>
          <p>{description}</p>
        </label>
      )}
      <div className={cx("input")}>
        <div className={cx("content", { active: isActive, isTextarea: inputStyle === "textarea" })}>
          {inputStyle ? (
            children
          ) : (
            <div onClick={onClick} className={cx("text")}>
              {children}
            </div>
          )}
          {inputStyle !== "textarea" && (
            <button onClick={isActive ? resetEvent : onClick ?? onFocus} className={cx("icon-wrapper")}>
              <div className={cx("icon", "before")}>
                <FontAwesomeIcon icon={icon} />
              </div>
              <div className={cx("icon", "after")}>
                <FontAwesomeIcon icon={faClose} />
              </div>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
export default memo(FormUserInput)
