"use client"

import SectionLayout from "@/components/Sections/display"
import { useEditorStore } from "@/store/editor"
import { faClose } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import cs from "classNames/bind"
import { useMemo } from "react"
import { sectionMap } from "../sectionMap"
import style from "./style.module.scss"
const cx = cs.bind(style)

export default function Preview() {
  const { initSections, formSections, stage, active, setActive } = useEditorStore()

  const sections = useMemo(
    () => (stage === "init" ? initSections : stage === "form" ? formSections : []),
    [initSections, formSections, stage]
  )
  const onClickPreviewClose = () => {
    setActive({
      key: "modal",
      payload: {
        type: null,
      },
    })
  }

  return (
    <div data-closer="preview" className={cx("preview", { active: active.modal.type === "preview" })}>
      <div className={cx("phone")}>
        <div className={cx("content")}>
          {sections.map((v) => (
            <SectionLayout id={v.id} noPadding={v.type === "thumbnail" || v.type === "slider"} key={`${v.id}`}>
              {sectionMap[v.type](v, true)}
            </SectionLayout>
          ))}
          {stage === "form" && (
            <div className={cx("submit")}>
              <button>{"제출하기"}</button>
            </div>
          )}
        </div>
      </div>
      <div className={cx("btn-wrapper")}>
        <button onClick={onClickPreviewClose}>
          <FontAwesomeIcon icon={faClose} />
        </button>
      </div>
    </div>
  )
}
