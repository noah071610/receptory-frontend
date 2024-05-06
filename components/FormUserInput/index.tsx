"use client"

import { IconDefinition } from "@fortawesome/fontawesome-svg-core"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import classNames from "classNames"
import { ReactNode, memo } from "react"
import style from "./style.module.scss"
const cx = classNames.bind(style)

function FormUserInput({
  title,
  description,
  onClick,
  children,
  icon,
  inputStyle,
}: {
  title: string
  description: string
  isDisplayMode?: boolean
  onClick?: () => void
  children: ReactNode
  icon: IconDefinition
  inputStyle?: string
}) {
  return (
    <div className={cx(style["input-wrapper"])}>
      <label className={cx(style["title"])}>
        <h2>{title}</h2>
        <p>{description}</p>
      </label>
      <div onClick={onClick} className={cx(style["input"])}>
        <div className={cx(style["content"])}>
          {inputStyle ? children : <div className={cx(style.text)}>{children}</div>}
          {inputStyle !== "textarea" && (
            <button className={cx(style.icon)}>
              <FontAwesomeIcon icon={icon} />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
export default memo(FormUserInput)
