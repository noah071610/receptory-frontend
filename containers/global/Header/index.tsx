"use client"

import { useEditorStore } from "@/store/editor"
import { EditStage } from "@/types/Edit"
import classNames from "classNames"
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
  const { stage, setStage, setSelectedSection } = useEditorStore()

  const onClickStage = (v: EditStage) => {
    setSelectedSection({ payload: null })
    setStage(v)
  }

  return (
    <>
      <header className={cx(style.header)}>
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
        <div
          style={{ width: stage === "init" ? "33%" : stage === "form" ? "66%" : "95%" }}
          className={cx(style.progress)}
        ></div>
      </header>
      <div className={cx(style.ghost)} />
    </>
  )
}
