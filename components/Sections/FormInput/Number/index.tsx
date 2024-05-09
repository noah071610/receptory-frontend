"use client"

import FormUserInput from "@/components/FormUserInput"
import OptionTitleInputs from "@/components/Options/OptionTitleInputs"
import { useEditorStore } from "@/store/editor"
import { SectionType } from "@/types/Edit"
import { enforceMinMax, onlyNumberFilter } from "@/utils/inputHelper"
import { fa1 } from "@fortawesome/free-solid-svg-icons"
import { useParams } from "next/navigation"
import { memo, useEffect } from "react"
import "react-international-phone/style.css"
import style from "./style.module.scss"

import cs from "classNames/bind"
const cx = cs.bind(style)

function Number({ section, isDisplayMode }: { section: SectionType; isDisplayMode?: boolean }) {
  const { lang } = useParams()
  const { setValue, setSelectedSection, setOptions, selectedSection } = useEditorStore()
  const { min, max } = section.options
  const globalMax = 9999999
  const activeSection = () => {
    if (selectedSection?.id !== section.id) {
      setSelectedSection({ payload: section })
    }
  }

  const onChangeInput = (e: any) => {
    activeSection()
    if (parseInt(e.target.value) < min) {
      return setValue({ payload: min })
    }
    if (parseInt(e.target.value) > max) {
      return setValue({ payload: max })
    }
    setValue({ payload: e.target.value })
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
    setValue({ payload: 0 })
  }, [min, max])

  return (
    <div className={cx("layout")}>
      <div className={cx("input-wrapper")}>
        <FormUserInput
          icon={fa1}
          title={section.data.title}
          description={section.data.description}
          inputStyle={"number"}
        >
          <input
            className={cx("input")}
            type="number"
            onKeyDown={onlyNumberFilter}
            value={section.value}
            onChange={onChangeInput}
          />
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
                min={0}
                max={section.options.max - 1}
                value={section.options.min}
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
                value={section.options.max}
                onChange={(e) => onChangeMinMax("max", e)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default memo(Number)
