"use client"

import Input from "@/components/Input"
import OptionRatio from "@/components/OptionRatio"
import { useEditorStore } from "@/store/editor"
import { SectionType } from "@/types/Edit"
import { enforceMinMax, onlyNumberFilter } from "@/utils/inputHelper"
import classNames from "classNames"
import { useParams } from "next/navigation"
import { memo, useEffect } from "react"
import { PhoneInput } from "react-international-phone"
import "react-international-phone/style.css"
import TextareaAutosize from "react-textarea-autosize"
import style from "./style.module.scss"

const cx = classNames.bind(style)

const countryMap: { [key: string]: any } = {
  kr: ["South Korea", "kr", "82", "... .... ...."],
  jp: ["Japan", "jp", "81", ".. .... ...."],
  th: ["Thailand", "th", "66"],
  us: ["United States", "us", "1", "(...) ...-....,0"],
}

function FormInput({ section }: { section: SectionType }) {
  const { lang } = useParams()
  const { setValue, setSelectedSection, setOptions, selectedSection } = useEditorStore()
  const [min, max] = [section.options.min, section.options.max]
  const phoneNumberCountry = section.options.phoneNumberCountry
  const design = section.design

  const onChangeInput = (e: any) => {
    if (selectedSection?.id !== section.id) {
      setSelectedSection({ payload: section })
    }
    if (design === "number") {
      if (parseInt(e.target.value) < min) {
        return setValue({ payload: min })
      }
      if (parseInt(e.target.value) > max) {
        return setValue({ payload: max })
      }
    } else if (design === "text") {
      if (e.target.value.length > max) {
        return
      }
    }
    setValue({ payload: e.target.value })
  }

  const onChangePhoneInput = (value: any) => {
    if (selectedSection?.id !== section.id) {
      setSelectedSection({ payload: section })
    }
    setValue({ payload: value })
  }

  const onChangeMinMax = (type: "min" | "max", e: any) => {
    if (selectedSection?.id !== section.id) {
      setSelectedSection({ payload: section })
    }
    if (parseInt(e.target.value) < parseInt(e.target.min)) {
      return setOptions({ payload: parseInt(e.target.min), key: type })
    }
    if (parseInt(e.target.value) > parseInt(e.target.max)) {
      return setOptions({ payload: parseInt(e.target.max), key: type })
    }
    setOptions({ payload: e.target.value, key: type })
  }

  useEffect(() => {
    setValue({ payload: "" })
  }, [section.design])
  useEffect(() => {
    if (phoneNumberCountry !== "all") {
      setValue({ payload: phoneNumberCountry })
    } else {
      setValue({ payload: "" })
    }
  }, [phoneNumberCountry])

  return (
    <div className={cx(style.layout)}>
      <div className={cx(style["input-wrapper"])}>
        <label className={cx(style["input-title"])}>
          <h2>{section.data.title}</h2>
          <p>{section.data.description}</p>
        </label>
        {design !== "country" && (
          <div className={cx(style["input-content"])}>
            {design === "text" && (
              <input className={cx(style["input"])} type="text" value={section.value} onChange={onChangeInput} />
            )}
            {design === "number" && (
              <input
                className={cx(style["input"])}
                type="number"
                onKeyDown={onlyNumberFilter}
                value={section.value}
                onChange={onChangeInput}
              />
            )}
            {design === "email" && (
              <input
                type="email"
                autoComplete="email"
                name="email"
                id="email"
                required
                className={cx(style["input"])}
                value={section.value}
                onChange={onChangeInput}
              />
            )}
            {design === "textarea" && (
              <TextareaAutosize
                className={cx(style["textarea"])}
                value={section.value}
                maxRows={5}
                maxLength={max}
                onChange={onChangeInput}
              />
            )}
          </div>
        )}
        {design === "country" && (
          <PhoneInput
            className={cx(style.country)}
            value={section.value}
            defaultCountry={lang === "ko" ? "kr" : (lang as string)}
            hideDropdown={phoneNumberCountry !== "all"}
            forceDialCode={phoneNumberCountry !== "all"}
            onChange={(phone) => onChangePhoneInput(phone)}
          />
        )}
      </div>
      <div className={cx(style.options)}>
        <div className={cx(style["edit-inputs"])}>
          <h4>타이틀 수정</h4>
          <Input
            className={cx(style.title)}
            inputType="title"
            isOptional={false}
            value={section.data.title}
            dataKey="title"
          />
          <Input
            className={cx(style.description)}
            inputType="description"
            isOptional={true}
            value={section.data.description}
            dataKey="description"
          />
        </div>
        {design !== "country" && (
          <div>
            <h4>최대 글자수 조정</h4>
            <div className={cx(style["minMax-wrapper"])}>
              <input
                className={cx(style.minMax)}
                onKeyDown={onlyNumberFilter}
                onKeyUp={enforceMinMax}
                type="number"
                min={0}
                value={section.options.min}
                onChange={(e) => onChangeMinMax("min", e)}
              />
              <span>{" ~ "}</span>
              <input
                className={cx(style.minMax)}
                onKeyDown={onlyNumberFilter}
                onKeyUp={enforceMinMax}
                type="number"
                min={1}
                max={9999999}
                value={section.options.max}
                onChange={(e) => onChangeMinMax("max", e)}
              />
            </div>
          </div>
        )}
        {design === "country" && (
          <OptionRatio
            optionsArr={["all", "+82", "+81", "+66", "+1"]}
            section={section}
            targetKey="phoneNumberCountry"
          />
        )}
      </div>
    </div>
  )
}

export default memo(FormInput)
