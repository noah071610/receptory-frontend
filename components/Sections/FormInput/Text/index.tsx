"use client"

import FormUserInput from "@/components/FormUserInput"
import OptionTitleInputs from "@/components/Options/OptionTitleInputs"
import { useEditorStore } from "@/store/editor"
import { SectionType } from "@/types/Edit"
import { enforceMinMax, onlyNumberFilter } from "@/utils/inputHelper"
import { faPencil } from "@fortawesome/free-solid-svg-icons"
import { useParams } from "next/navigation"
import { memo, useEffect } from "react"
import "react-international-phone/style.css"
import TextareaAutosize from "react-textarea-autosize"
import style from "./style.module.scss"

import cs from "classNames/bind"
const cx = cs.bind(style)

function Text({ section, isDisplayMode }: { section: SectionType; isDisplayMode?: boolean }) {
  const { lang } = useParams()
  const { setValue, setSelectedSection, setOptions, selectedSection } = useEditorStore()
  const { max } = section.options
  const design = section.design
  const globalMax = design === "text" ? 50 : 500
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

  const onChangeMax = (e: any) => {
    activeSection()
    setOptions({ payload: e.target.value, key: "max" })
  }

  useEffect(() => {
    setValue({ payload: "" })
  }, [section.design, max])

  useEffect(() => {
    setOptions({ payload: 50, key: "max" })
  }, [section.design])

  return (
    <div className={cx("layout")}>
      <div className={cx("input-wrapper")}>
        <FormUserInput
          icon={faPencil}
          title={section.data.title}
          description={section.data.description}
          inputStyle={design}
        >
          {design === "text" ? (
            <input className={cx("input")} type="text" value={section.value} onChange={onChangeInput} />
          ) : (
            <TextareaAutosize
              className={cx("textarea")}
              value={section.value}
              maxRows={5}
              maxLength={max}
              onChange={onChangeInput}
            />
          )}
        </FormUserInput>
      </div>
      {!isDisplayMode && (
        <div className={cx("options")}>
          <OptionTitleInputs section={section} />
          <div>
            <h4>최대 글자수 조정</h4>
            <div className={cx("minMax-wrapper")}>
              <input
                className={cx("minMax")}
                onKeyDown={onlyNumberFilter}
                onKeyUp={enforceMinMax}
                type="number"
                min={1}
                max={globalMax}
                value={section.options.max}
                onChange={onChangeMax}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default memo(Text)
