"use client"

import FormUserInput from "@/components/FormUserInput"
import OptionTitleInputs from "@/components/Options/OptionTitleInputs"
import { useEditorStore } from "@/store/editor"
import { SectionType } from "@/types/Edit"
import { enforceMinMax, onlyNumberFilter } from "@/utils/helpers/inputHelper"
import { faListOl } from "@fortawesome/free-solid-svg-icons"
import { useParams } from "next/navigation"
import { memo, useEffect } from "react"
import "react-international-phone/style.css"
import style from "./style.module.scss"

import { useMainStore } from "@/store/main"
import cs from "classNames/bind"
const cx = cs.bind(style)

const globalMax = 9999999

function Number({ section }: { section: SectionType }) {
  const { lang } = useParams()
  const { setSelectedSection, setOptions, selectedSection } = useEditorStore()
  const { setUserPick, userPick } = useMainStore()
  const value = userPick[section.id]?.value ?? 0
  const { min, max } = section.options

  const activeSection = () => {
    if (selectedSection?.id !== section.id) {
      setSelectedSection({ payload: section })
    }
  }

  const onChangeInput = (e: any) => {
    if (parseInt(e.target.value) < min) {
      return setUserPick({ section, payload: min })
    }
    if (parseInt(e.target.value) > max) {
      return setUserPick({ section, payload: max })
    }
    setUserPick({ section, payload: e.target.value })
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
    setUserPick({ section, payload: 0 })
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

  return (
    <div className={cx("layout")}>
      <div className={cx("input-wrapper")}>
        <FormUserInput
          icon={faListOl}
          title={section.data.title}
          description={section.data.description}
          inputStyle={"number"}
        >
          <input
            className={cx("input")}
            type="number"
            onKeyDown={onlyNumberFilter}
            value={value}
            onChange={onChangeInput}
          />
        </FormUserInput>
      </div>
      <div className={cx("options")}>
        <OptionTitleInputs section={section} />
        <div>
          <h4>최대 숫자 조정</h4>
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
