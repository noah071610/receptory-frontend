"use client"

import FormUserInput from "@/components/FormUserInput"
import { useTranslation } from "@/i18n/client"
import { SectionType } from "@/types/Edit"
import { faList } from "@fortawesome/free-solid-svg-icons"
import { memo } from "react"
import style from "./style.module.scss"

import { useMainStore } from "@/store/main"
import cs from "classNames/bind"
const cx = cs.bind(style)

function PageChoices({ section }: { section: SectionType }) {
  const { t } = useTranslation()
  const { setModal, setSelects, selects } = useMainStore()

  const toggleSelect = () => {
    setModal({ section, type: "select" })
  }

  const reset = () => {
    setSelects({ payload: [] })
  }

  return (
    <div className={cx("layout")}>
      <FormUserInput
        icon={faList}
        onClick={toggleSelect}
        title={section.data.title}
        description={section.data.description}
        isMultiple={true}
        isActive={!!selects?.length}
        resetEvent={reset}
      >
        <span>
          {selects?.length > 0 ? (
            selects.map((v, i) => (
              <div className={cx("selected-list-text")} key={`select-${i}`}>
                <span>{v.title}</span>
              </div>
            ))
          ) : (
            <span>{t("none")}</span>
          )}
        </span>
      </FormUserInput>
    </div>
  )
}

export default memo(PageChoices)
