"use client"

import SectionLayout from "@/components/Sections/display"
import { useEditorStore } from "@/store/editor"
import { faClose } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import cs from "classnames/bind"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"
import { sectionMap } from "../sectionMap"
import style from "./style.module.scss"
const cx = cs.bind(style)

export default function Preview() {
  const { t } = useTranslation(["edit-page"])
  const { homeSections, formSections, confirmSections, stage, active, setActive } = useEditorStore([
    "homeSections",
    "formSections",
    "confirmSections",
    "stage",
    "active",
    "setActive",
  ])

  const sections = useMemo(() => {
    switch (stage) {
      case "home":
        return homeSections
      case "form":
        return formSections
      default:
        return confirmSections
    }
  }, [homeSections, formSections, confirmSections, stage])

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
          {sections.map((v, i) => (
            <SectionLayout
              style={{ paddingBottom: v.style?.paddingBottom }}
              id={v.id}
              index={i}
              noPadding={v.type === "thumbnail" || v.type === "slider"}
              key={`${v.id}`}
            >
              {sectionMap[v.type](v, true)}
            </SectionLayout>
          ))}
          {stage === "form" && (
            <div className={cx("submit")}>
              <button>{t("submit")}</button>
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
