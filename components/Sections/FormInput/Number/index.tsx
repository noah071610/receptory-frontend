"use client"

import FormUserInput from "@/components/FormUserInput"
import OptionTitleInputs from "@/components/Options/OptionTitleInputs"
import { useEditorStore } from "@/store/editor"
import { SectionType } from "@/types/Edit"
import { enforceMinMax, onlyNumberFilter } from "@/utils/helpers/inputHelper"
import { faListOl } from "@fortawesome/free-solid-svg-icons"
import { useParams } from "next/navigation"
import { memo, useEffect, useRef } from "react"

import style from "./style.module.scss"

import { useMainStore } from "@/store/main"
import cs from "classNames/bind"
const cx = cs.bind(style)

const globalMax = 9999999

function Number({ section }: { section: SectionType }) {
  const { lang } = useParams()
  const inputRef = useRef<HTMLInputElement | null>(null)
  const { setSelectedSection, setOptions, selectedSection } = useEditorStore()
  const { setUserPickText, userPick } = useMainStore()
  const { min, max } = section.options

  const { value } = userPick[section.id] ?? {}
  const text = value ? value[0].text : ""

  const activeSection = () => {
    if (selectedSection?.id !== section.id) {
      setSelectedSection({ payload: section })
    }
  }

  const onChangeInput = (e: any) => {
    if (parseInt(e.target.value) < min) {
      return setUserPickText({ section, text: min })
    }
    if (parseInt(e.target.value) > max) {
      return setUserPickText({ section, text: max })
    }
    setUserPickText({ section, text: e.target.value })
  }

  const onChangeMinMax = (type: "min" | "max", e: any) => {
    activeSection()
    if (parseInt(e.target.value) < parseInt(e.target.min)) {
      return setOptions({ payload: parseInt(e.target.min), key: type })
    }
    if (parseInt(e.target.value) > parseInt(e.target.max)) {
      return setOptions({ payload: parseInt(e.target.max), key: type })
    }
    setOptions({ payload: e.target.value, key: type })
  }

  useEffect(() => {
    setUserPickText({ section, text: "" })
  }, [min, max])

  const onBlur = (type: "min" | "max") => {
    if (type === "max") {
      if (!max || max < 1) {
        setOptions({ payload: 1, key: "max" })
      }
      if (max > globalMax) {
        setOptions({ payload: globalMax, key: "max" })
      }
    } else {
      if (min > max - 1 || max > globalMax - 1) {
        setOptions({ payload: max - 1, key: "max" })
      }
    }
  }

  const onFocus = () => {
    if (inputRef?.current) {
      inputRef.current.focus()
    }
  }
  const reset = () => {
    setUserPickText({ section, text: "" })
    onFocus()
  }

  return (
    <div className={cx("layout")}>
      <div className={cx("input-wrapper")}>
        <FormUserInput
          icon={faListOl}
          title={section.data.title}
          description={section.data.description}
          inputStyle={"number"}
          onFocus={onFocus}
          resetEvent={reset}
          isActive={!!text}
        >
          <input
            className={cx("input")}
            type="number"
            ref={inputRef}
            onKeyDown={onlyNumberFilter}
            value={text}
            onChange={onChangeInput}
          />
        </FormUserInput>
      </div>
      <div className={cx("options")}>
        <OptionTitleInputs section={section} />
        <div>
          <h4>
            <span>최대 숫자 조정</span>
          </h4>
          <div className={cx("minMax-wrapper")}>
            <input
              className={cx("minMax")}
              onKeyDown={onlyNumberFilter}
              onKeyUp={enforceMinMax}
              type="number"
              min={0}
              max={max - 1}
              value={min}
              onBlur={() => onBlur("min")}
              onChange={(e) => onChangeMinMax("min", e)}
            />
            <span>{" ~ "}</span>
            <input
              className={cx("minMax")}
              onKeyDown={onlyNumberFilter}
              onKeyUp={enforceMinMax}
              type="number"
              min={1}
              max={globalMax}
              value={max}
              onBlur={() => onBlur("max")}
              onChange={(e) => onChangeMinMax("max", e)}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default memo(Number)
