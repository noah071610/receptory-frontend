"use client"

import IconBtn from "@/components/IconBtn"
import { useEditorStore } from "@/store/editor"
import { EditStage } from "@/types/Edit"
import { faCheck, faRotateLeft, faRotateRight, faSave } from "@fortawesome/free-solid-svg-icons"
import classNames from "classNames"
import { useEffect, useState } from "react"
import style from "./style.module.scss"
const cx = classNames.bind(style)

const headers = [
  {
    value: "init",
  },
  {
    value: "form",
  },
  {
    value: "rending",
  },
]

export default function Header() {
  const { stage, setStage, setSelectedSection, selectedSection, setRevert, revert, revertIndex } = useEditorStore()
  const [isSaving, setIsSaving] = useState(false)

  const [prevScrollPos, setPrevScrollPos] = useState(0)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.scrollY
      setVisible(prevScrollPos > currentScrollPos || currentScrollPos < 100)
      setPrevScrollPos(currentScrollPos)
    }

    window.addEventListener("scroll", handleScroll)

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [prevScrollPos, visible])

  const onClickStage = (v: EditStage) => {
    setSelectedSection({ payload: null })
    setStage(v)
  }

  const onClickSave = () => {
    setIsSaving(true)
    setTimeout(() => {
      setIsSaving(false)
    }, 3000)
  }

  const onClickRevert = (type: "do" | "undo") => {
    setRevert(type)
  }

  return (
    <>
      <header className={cx(style.header, { [style.visible]: visible })}>
        <div></div>
        <div className={cx(style.inner)}>
          {headers.map((v) => (
            <div key={`header_${v.value}`} className={cx(style.list)}>
              <button
                onClick={() => onClickStage(v.value as EditStage)}
                className={cx({ [style.active]: v.value === stage })}
              >
                <span>{v.value}</span>
              </button>
            </div>
          ))}
        </div>
        <div className={cx(style.right)}>
          <IconBtn
            disabled={revert.length <= 1 || revertIndex <= 0}
            onclick={() => onClickRevert("undo")}
            size={35}
            iconClassName={style.rollback}
            icon={faRotateLeft}
          />
          <IconBtn
            disabled={revert.length - 1 === revertIndex}
            onclick={() => onClickRevert("do")}
            size={35}
            iconClassName={style.rollback}
            icon={faRotateRight}
          />
          {isSaving ? (
            <IconBtn iconClassName={style.saving} size={35} icon={faCheck} />
          ) : (
            <IconBtn onclick={onClickSave} size={35} icon={faSave} />
          )}
        </div>
        <div
          style={{ width: stage === "init" ? "33%" : stage === "form" ? "66%" : "95%" }}
          className={cx(style.progress)}
        ></div>
      </header>
      <div className={cx(style.ghost)} />
    </>
  )
}
