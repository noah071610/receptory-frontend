"use client"

import { useTranslation } from "react-i18next"
import ModalLayout from ".."
import style from "./style.module.scss"

import { findReservation } from "@/actions/page"
import { toastError } from "@/config/toast"
import { useMainStore } from "@/store/main"
import { Langs } from "@/types/Main"
import { setDateFormat } from "@/utils/helpers/setDate"
import cs from "classNames/bind"
import { useParams, usePathname, useRouter } from "next/navigation"
import { useState } from "react"
const cx = cs.bind(style)

export const ConfirmReservation = ({
  setIsConfirming,
  setIsConfirm,
  pageLang,
}: {
  setIsConfirming: (b: boolean) => void
  setIsConfirm: (b: boolean) => void
  pageLang: Langs
}) => {
  const pathname = usePathname()
  const { replace } = useRouter()
  const { pageId } = useParams()
  const { t } = useTranslation(["edit-page"])
  const { setModal, loadSelected, setConfirmation } = useMainStore(["setModal", "loadSelected", "setConfirmation"])
  const [input, setInput] = useState({
    confirmId: "",
    password: "",
  })
  const onChangeInput = (e: any, type: "password" | "confirmId") => {
    setInput((v) => ({ ...v, [type]: e.target.value }))
  }

  const onClickConfirm = async () => {
    if (typeof pageId !== "string") {
      // 잘못된 접근입니다.
      return toastError("InvalidAccess")
    }
    setIsConfirming(true)

    const { msg, data } = await findReservation({
      pageId,
      confirmId: input.confirmId,
      password: input.password,
    })

    const { saveSelected, createdAt } = data ?? {}

    if (saveSelected && createdAt) {
      setConfirmation({
        curConfirmationId: input.confirmId,
        confirmDate: setDateFormat({ date: createdAt, lang: pageLang, isTime: true }),
      })
      loadSelected(saveSelected)
      setTimeout(() => {
        setIsConfirming(false)
        setIsConfirm(true)
        setInput({
          password: "",
          confirmId: "",
        })
        replace(`${pathname}?s=confirm`)
        setModal({ section: null, type: null })
      }, 1000)
    } else {
      toastError(msg)
      setIsConfirming(false)
    }
  }

  return (
    <ModalLayout modalStyle={style["content"]}>
      <h1>{t("checkReservation")}</h1>
      <p className={cx("desc")}>{t("reservationDescription")}</p>
      <label className={cx("title")}>
        <h2>{t("confirmationNumber")}</h2>
      </label>
      <input
        className={cx("confirmId")}
        onChange={(e) => onChangeInput(e, "confirmId")}
        value={input.confirmId}
        type="text"
      ></input>
      <label className={cx("title")}>
        <h2>{t("password")}</h2>
      </label>
      <input
        placeholder={t("enterPasswordPlaceholder")}
        value={input.password}
        onChange={(e) => onChangeInput(e, "password")}
        type="password"
      ></input>
      <div className={cx("btn-wrapper")}>
        <button
          disabled={!input.password || !input.confirmId}
          className={cx({
            inactive: !input.password || !input.confirmId,
          })}
          onClick={onClickConfirm}
        >
          {t("checkReservationButton")}
        </button>
      </div>
    </ModalLayout>
  )
}

export default ConfirmReservation
