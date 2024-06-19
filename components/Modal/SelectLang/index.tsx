"use client"

import { useTranslation } from "react-i18next"
import ModalLayout from ".."
import style from "./style.module.scss"

import { changeLanguage } from "@/actions/page"
import { addSave } from "@/actions/save"
import { langText, queryKey } from "@/config"
import { toastError, toastSuccess } from "@/config/toast"
import { langCookieName } from "@/i18n/settings"
import { useMainStore } from "@/store/main"
import { Langs } from "@/types/Main"
import { UserType } from "@/types/User"
import { getAnimation } from "@/utils/styles/getAnimation"
import { faFilePen, faMagicWandSparkles } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useQueryClient } from "@tanstack/react-query"
import cs from "classnames/bind"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Cookies } from "react-cookie"

const cookies = new Cookies()

const cx = cs.bind(style)

export const SelectLang = ({
  targetPageId,
  setIsLoading,
  initLang,
  user,
  isAddPage,
  isChangeSiteLang,
}: {
  targetPageId?: string
  setIsLoading: (b: boolean) => void
  initLang?: Langs
  user: UserType
  isChangeSiteLang?: boolean
  isAddPage?: boolean
}) => {
  const queryClient = useQueryClient()
  const { push, refresh } = useRouter()
  const { setModal } = useMainStore(["pageLang", "setModal"])
  const [selectedLang, setSelectedLang] = useState<null | Langs>(initLang ?? null)
  const { t } = useTranslation(["modal"])
  const [noDelay, setNoDelay] = useState(false)
  const [isOnPageTypeSelect, setIsOnPageTypeSelect] = useState(isAddPage ?? false)

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
          toastSuccess("changeLang")
          setIsLoading(false)
          setModal({ section: null, type: null })
        }, 500)
      } else {
        // 에러가 발생했어요
        toastError("unknown")
        setIsLoading(false)
      }
    } else {
      if (isChangeSiteLang) {
        cookies.set(langCookieName, selectedLang ?? "ko", { path: "/" })
        setTimeout(() => {
          refresh()
          setIsLoading(false)
          setModal({ section: null, type: null })

          if (typeof window === "object") {
            window.location.reload()
          }
        }, 500)
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
          // 에러가 발생했어요
          toastError("unknown")
          setIsLoading(false)
        }
      }
    }
  }

  const onClickType = (type: "template" | "basic") => {
    if (type === "template") {
      setModal({ section: null, type: null })
      push("/template")
    } else {
      setIsOnPageTypeSelect(false)
      setNoDelay(true)
    }
  }

  return (
    <ModalLayout modalStyle={style["add-save-content"]}>
      <h1>{isOnPageTypeSelect ? t("selectPageType") : t("selectLang")}</h1>
      {isOnPageTypeSelect ? (
        <div className={cx("select-page-type")}>
          <div
            onClick={() => onClickType("template")}
            style={getAnimation({ type: "fadeUp", delay: 350 })}
            className={cx("card")}
          >
            <div className={cx("left")}>
              <div className={cx("icon")}>
                <FontAwesomeIcon icon={faMagicWandSparkles} />
              </div>
            </div>
            <div className={cx("content")}>
              <h3>{t("makeWithTemplate")}</h3>
              <p>{t("makeWithTemplateDescription")}</p>
            </div>
          </div>
          <div
            onClick={() => onClickType("basic")}
            style={getAnimation({ type: "fadeUp", delay: 450 })}
            className={cx("card")}
          >
            <div className={cx("left")}>
              <div className={cx("icon")}>
                <FontAwesomeIcon icon={faFilePen} />
              </div>
            </div>
            <div className={cx("content")}>
              <h3>{t("makeWithBasic")}</h3>
              <p>{t("makeWithBasicDescription")}</p>
            </div>
          </div>
        </div>
      ) : (
        <div className={cx("grid")}>
          {[
            { value: "ko", src: "/images/icons/ko.png" },
            { value: "ja", src: "/images/icons/ja.png" },
            { value: "th", src: "/images/icons/th.png" },
            { value: "en", src: "/images/icons/en.png" },
          ].map(({ value, src }, i) => (
            <button
              className={cx("btn", {
                active: selectedLang === value,
              })}
              key={`lang-${value}`}
              onClick={() => onClickRatio(value as Langs)}
              style={getAnimation({ type: "fadeUp", delay: (noDelay ? 30 : 400) + i * 100 })}
            >
              <Image width={35} height={35} src={src} alt={value} />
              <span className={cx("name")}>{langText[value as Langs]}</span>
            </button>
          ))}
        </div>
      )}
      {!isOnPageTypeSelect && (
        <div className={cx("btn-wrapper")}>
          <button disabled={!selectedLang} className={cx({ inactive: !selectedLang })} onClick={onClickAddSave}>
            {t(initLang ? "changeLanguage" : "addSave")}
          </button>
        </div>
      )}
    </ModalLayout>
  )
}

export default SelectLang
