"use client"

import { useEditorStore } from "@/store/editor"
import { IconDefinition } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import classNames from "classNames"
import style from "./style.module.scss"
const cx = classNames.bind(style)

function IconBtn({
  className,
  disabled = false,
  iconClassName,
  size,
  icon,
  onclick,
}: {
  className?: string
  iconClassName?: string
  size: number
  icon: IconDefinition
  onclick?: any
  disabled?: boolean
}) {
  const { setActive, addList, selectedSection, setSelectedSection } = useEditorStore()

  return (
    <div className={cx(style["btn-wrapper"], className)}>
      <button
        onClick={onclick}
        style={{ width: `${size}px`, height: `${size}px` }}
        className={cx(iconClassName, style.icon)}
        disabled={disabled}
      >
        <FontAwesomeIcon icon={icon} />
      </button>
    </div>
  )
}
export default IconBtn
