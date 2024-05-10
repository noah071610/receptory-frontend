"use client"

import FormUserInput from "@/components/FormUserInput"
import OptionTitleInputs from "@/components/Options/OptionTitleInputs"
import { useEditorStore } from "@/store/editor"
import { SectionType } from "@/types/Edit"
import { enforceMinMax, onlyNumberFilter } from "@/utils/helpers/inputHelper"
import { faPencil } from "@fortawesome/free-solid-svg-icons"
import { useParams } from "next/navigation"
import { memo, useEffect } from "react"
import "react-international-phone/style.css"
import TextareaAutosize from "react-textarea-autosize"
import style from "./style.module.scss"

import { useMainStore } from "@/store/main"
import cs from "classNames/bind"
const cx = cs.bind(style)

function Text({ section }: { section: SectionType }) {
  const { lang } = useParams()
  const { setUserPick, userPick } = useMainStore()
  const value = userPick[section.id]?.value ?? ""
  const { setOptions } = useEditorStore()
  const { max } = section.options
  const design = section.design
  const globalMax = design === "text" ? 50 : 500

  const onChangeInput = (e: any) => {
    if (e.target.value.length > max) {
      return
    }
    setUserPick({ section, payload: e.target.value })
  }

  const onChangeMax = (e: any) => {
    setOptions({ payload: e.target.value, key: "max" })
  }

  useEffect(() => {
    setUserPick({ section, payload: "" })
  }, [section.design, max])

  useEffect(() => {
    setOptions({ payload: globalMax, key: "max" })
  }, [section.design])

  const onBlur = () => {
    if (!max || max < 10) {
      setOptions({ payload: 10, key: "max" })
    }
    if (max > globalMax) {
      setOptions({ payload: globalMax, key: "max" })
    }
  }

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
            <input className={cx("input")} type="text" value={value} onChange={onChangeInput} />
          ) : (
            <TextareaAutosize
              className={cx("textarea")}
              value={value}
              maxRows={5}
              maxLength={max}
              onChange={onChangeInput}
            />
          )}
        </FormUserInput>
      </div>
      <div className={cx("options")}>
        <OptionTitleInputs section={section} />
        <div>
          <h4>최대 글자수 조정</h4>
          <div className={cx("minMax-wrapper")}>
            <input
              className={cx("minMax")}
              onKeyDown={onlyNumberFilter}
              onKeyUp={enforceMinMax}
              onBlur={onBlur}
              type="number"
              min={1}
              max={globalMax}
              value={section.options.max}
              onChange={onChangeMax}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default memo(Text)
