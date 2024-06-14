"use client"
import { SectionListType, SectionType } from "@/types/Edit"
import hasString from "@/utils/helpers/hasString"
import { useTranslation } from "react-i18next"
import ModalLayout from ".."
import style from "./style.module.scss"

import { useMainStore } from "@/store/main"
import { SelectedValueType } from "@/types/Main"
import cs from "classnames/bind"
import { useState } from "react"
import BasicList from "./List/Basic"
import ThumbList from "./List/Thumb"
const cx = cs.bind(style)

export const SelectList = ({ section }: { section: SectionType }) => {
  const { setModal, setSelected } = useMainStore(["pageLang", "setSelected", "setModal"])
  const { t } = useTranslation(["edit-page"])

  const selectList = section.list.filter((v) => hasString(v.data.title))
  const design = section.design ?? "basic"
  const [userSelectedList, setUserSelectedList] = useState<SelectedValueType[]>([])
  const { addSelectNone, isMultiple } = section.options

  const onChangeSelect = (selectedList: SectionListType) => {
    const target = {
      key: selectedList.id,
      text: selectedList.data?.title ?? "",
      description: selectedList.data.description,
      src: selectedList.src,
    }
    if (isMultiple) {
      if (userSelectedList.findIndex(({ key }) => key === target.key) >= 0) {
        setUserSelectedList((prev) => prev.filter(({ key }) => key !== target.key))
      } else {
        setUserSelectedList((prev) => [...prev, target])
      }
    } else {
      setUserSelectedList([target])
    }
  }

  const onClickNone = () => {
    setSelected({ section, value: [{ key: "noneSelect", text: t("noneSelect") }] })
    setModal({ section: null, type: null })
  }

  const onClickSubmitMultiple = () => {
    setSelected({ section, value: userSelectedList })
    setModal({ section: null, type: null })
  }

  return (
    <ModalLayout modalStyle={style.content}>
      {selectList?.length > 0 ? (
        <>
          {design !== "thumbnail" && (
            <ul className={cx("list-wrapper", "basic-list-wrapper")}>
              {selectList.map((v, i) => (
                <BasicList
                  key={`basic-list-${v.id}`}
                  userSelectedList={userSelectedList}
                  v={v}
                  i={i}
                  design={design}
                  onChangeSelect={onChangeSelect}
                />
              ))}
            </ul>
          )}
          {design === "thumbnail" && (
            <ul className={cx("list-wrapper", "thumb-list-wrapper")}>
              {selectList.map((v, i) => (
                <ThumbList
                  key={`thumb-list-${v.id}`}
                  userSelectedList={userSelectedList}
                  v={v}
                  i={i}
                  onChangeSelect={onChangeSelect}
                />
              ))}
            </ul>
          )}
        </>
      ) : (
        <div className={cx("no-list")}>
          <img src="/images/icons/crying.png" alt="crying" />
          <span>{t("noList")}</span>
        </div>
      )}
      <div className={cx("btn-wrapper")}>
        <button
          disabled={userSelectedList.length <= 0}
          className={cx("select-multiple")}
          onClick={onClickSubmitMultiple}
        >
          <span>{t("선택 하기")}</span>
        </button>
        {addSelectNone && (
          <button className={cx("select-none")} onClick={onClickNone}>
            <span>{t("선택 없음")}</span>
          </button>
        )}
      </div>
    </ModalLayout>
  )
}

export default SelectList
