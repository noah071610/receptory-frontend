"use client"

import { IconDefinition } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import cs from "classnames/bind"
import style from "./style.module.scss"
const cx = cs.bind(style)

function IconBtn({
  className,
  disabled = false,
  iconClassName,
  icon,
  onclick,
}: {
  className?: string
  iconClassName?: string
  icon: IconDefinition
  onclick?: any
  disabled?: boolean
}) {
  return (
    <div className={cx("btn-wrapper", className)}>
      <button onClick={onclick} className={cx(iconClassName, "icon")} disabled={disabled} type="button">
        <FontAwesomeIcon icon={icon} />
      </button>
    </div>
  )
}
export default IconBtn
