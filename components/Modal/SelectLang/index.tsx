"use client"

import { useTranslation } from "react-i18next"
import ModalLayout from ".."
import style from "./style.module.scss"

import { changeLanguage } from "@/actions/page"
import { addSave } from "@/actions/save"
import { queryKey } from "@/config"
import { toastError, toastSuccess } from "@/config/toast"
import { useMainStore } from "@/store/main"
import { Langs } from "@/types/Main"
import { UserType } from "@/types/User"
import { useQueryClient } from "@tanstack/react-query"
import cs from "classNames/bind"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useState } from "react"
const cx = cs.bind(style)

export const SelectLang = ({
  targetPageId,
  setIsLoading,
  initLang,
  user,
}: {
  targetPageId?: string
  setIsLoading: (b: boolean) => void
  initLang?: Langs
  user: UserType
}) => {
  const queryClient = useQueryClient()
  const { push, back } = useRouter()
  const { setModal } = useMainStore()
  const [selectedLang, setSelectedLang] = useState<null | Langs>(initLang ?? null)
  const { t } = useTranslation()

  const onClickRatio = (v: Langs) => {
    setSelectedLang(v)
  }
  const onClickAddSave = async () => {
    setIsLoading(true)
    if (!selectedLang || (initLang && initLang === selectedLang)) {
      setIsLoading(false)
      setModal({ section: null, type: null })
      return
    }

    if (targetPageId) {
      // 기존 페이지의 언어 변경
      const isOk = await changeLanguage({ pageId: targetPageId, lang: selectedLang })
      if (isOk) {
        await queryClient.invalidateQueries({ queryKey: queryKey.save.list })
        await queryClient.invalidateQueries({ queryKey: queryKey.page(targetPageId) })
        setTimeout(() => {
          toastSuccess("언어를 변경했어요")
          setIsLoading(false)
          setModal({ section: null, type: null })
        }, 500)
      } else {
        toastError("에러가 발생했어요")
        setIsLoading(false)
      }
    } else {
      const newSave = await addSave(selectedLang as Langs)
      if (newSave) {
        await queryClient.invalidateQueries({ queryKey: queryKey.save.list })
        setTimeout(() => {
          setIsLoading(false)
          setModal({ section: null, type: null })
          push(`/edit/${user.userId}/${newSave.pageId}`)
        }, 500)
      } else {
        toastError("에러가 발생했어요")
        setIsLoading(false)
      }
    }
  }

  return (
    <ModalLayout modalStyle={style["add-save-content"]}>
      <h1>페이지의 언어를 선택해주세요</h1>
      <div className={cx("grid")}>
        {[
          { value: "ko", src: "/images/icons/ko.png" },
          { value: "ja", src: "/images/icons/ja.png" },
          { value: "th", src: "/images/icons/th.png" },
          { value: "en", src: "/images/icons/en.png" },
        ].map(({ value, src }) => (
          <button
            className={cx("btn", {
              active: selectedLang === value,
            })}
            key={`lang-${value}`}
            onClick={() => onClickRatio(value as Langs)}
          >
            <Image width={35} height={35} src={src} alt={value} />
            <span className={cx("name")}>{value}</span>
          </button>
        ))}
      </div>
      <div className={cx("btn-wrapper")}>
        <button disabled={!selectedLang} className={cx({ inactive: !selectedLang })} onClick={onClickAddSave}>
          {t(initLang ? "changeLanguage" : "addSave")}
        </button>
      </div>
    </ModalLayout>
  )
}

export default SelectLang
