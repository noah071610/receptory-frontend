"use client"

import FormUserInput from "@/components/FormUserInput"
import OptionTitleInputs from "@/components/Options/OptionTitleInputs"
import { useEditorStore } from "@/store/editor"
import { SectionType } from "@/types/Edit"
import { faEnvelope } from "@fortawesome/free-solid-svg-icons"
import { useParams } from "next/navigation"
import { memo, useEffect } from "react"
import "react-international-phone/style.css"
import style from "./style.module.scss"

import cs from "classNames/bind"
const cx = cs.bind(style)

function Text({ section, isDisplayMode }: { section: SectionType; isDisplayMode?: boolean }) {
  const { lang } = useParams()
  const { setValue, setSelectedSection, selectedSection } = useEditorStore()
  const { min, max } = section.options
  const activeSection = () => {
    if (selectedSection?.id !== section.id) {
      setSelectedSection({ payload: section })
    }
  }

  const onChangeInput = (e: any) => {
    activeSection()
    if (e.target.value.length > max) {
      return
    }
    setValue({ payload: e.target.value })
  }

  useEffect(() => {
    setValue({ payload: "" })
  }, [min, max])

  return (
    <div className={cx("layout")}>
      <div className={cx("input-wrapper")}>
        <FormUserInput
          icon={faEnvelope}
          title={section.data.title}
          description={section.data.description}
          inputStyle={"email"}
        >
          <input
            type="email"
            autoComplete="email"
            name="email"
            id="email"
            required
            className={cx("input")}
            value={section.value}
            onChange={onChangeInput}
          />
        </FormUserInput>
      </div>
      {!isDisplayMode && (
        <div className={cx("options")}>
          <OptionTitleInputs section={section} />
        </div>
      )}
    </div>
  )
}

export default memo(Text)
