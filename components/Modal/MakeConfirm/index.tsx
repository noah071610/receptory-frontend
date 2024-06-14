"use client"

import { useTranslation } from "react-i18next"
import ModalLayout from ".."
import style from "./style.module.scss"

import { submit } from "@/actions/page"
import IconBtn from "@/components/IconBtn"
import { toastError, toastSuccess } from "@/config/toast"
import { useMainStore } from "@/store/main"
import { PageStage } from "@/types/Main"
import { copyTextToClipboard } from "@/utils/copy"
import { faClipboard } from "@fortawesome/free-solid-svg-icons"
import cs from "classNames/bind"
import { useParams, usePathname, useRouter } from "next/navigation"
import { useState } from "react"
const cx = cs.bind(style)

export const MakePassword = ({
  confirmId,
  setIsConfirm,
  setIsConfirming,
  setPageStage,
}: {
  confirmId: string
  setIsConfirm: (b: boolean) => void
  setIsConfirming: (b: boolean) => void
  setPageStage: (stage: PageStage) => void
}) => {
  const pathname = usePathname()
  const { replace } = useRouter()
  const { pageId } = useParams()
  const { setModal, selected } = useMainStore(["pageLang", "setModal", "selected"])
  const { t } = useTranslation(["modal"])
  const [password, setPassword] = useState({
    password: "",
    confirmPassword: "",
  })
  const onChangeInput = (e: any, type: "password" | "confirmPassword") => {
    setPassword((v) => ({ ...v, [type]: e.target.value }))
  }

  const onSubmitForm = async (e: any) => {
    e.preventDefault()
    if (typeof pageId !== "string") {
      // 잘못된 접근입니다.
      return toastError("invalidAccess")
    }
    if (password.password !== password.confirmPassword) {
      // 비밀번호가 일치하지 않습니다.
      return toastError("notSamePassword")
    }

    if (password.password.length < 5) {
      // 패스워드는 최소 5글자 이상을 입력해주세요.
      return toastError("safeConfirmPassword")
    }
    setIsConfirming(true)

    const isOk = await submit({ pageId, confirmId, password: password.password, selected })

    if (isOk) {
      setTimeout(() => {
        setIsConfirming(false)
        setIsConfirm(true)
        setPassword({
          password: "",
          confirmPassword: "",
        })
        setModal({ section: null, type: null })
        setPageStage("confirm")
      }, 1000)
    } else {
      setIsConfirming(false)
    }
  }

  const onClickCopy = () => {
    copyTextToClipboard(confirmId)
    toastSuccess("copyConfirmId")
  }

  return (
    <ModalLayout modalStyle={style["confirm-hard-content"]}>
      <h1>{t("enterPassword")}</h1>
      <p dangerouslySetInnerHTML={{ __html: t("confirmPasswordDescription") }} className={cx("desc")}></p>
      <form onSubmit={onSubmitForm}>
        <label className={cx("title")}>
          <h2>{t("confirmationNumber")}</h2>
          <p>{t("confirmationNumberDescription")}</p>
        </label>
        <div className={cx("confirmId")}>
          <div className={cx("input")}>{confirmId}</div>
          <div className={cx("clip-board")}>
            <IconBtn onclick={onClickCopy} icon={faClipboard} size={30} />
          </div>
        </div>
        <label htmlFor="password" className={cx("title")}>
          <h2>{t("setPassword")}</h2>
        </label>
        <input
          placeholder={t("enterPasswordPlaceholder")}
          value={password.password}
          onChange={(e) => onChangeInput(e, "password")}
          type="password"
          autoComplete="new-password"
        ></input>
        <input
          className={cx("confirmPassword")}
          placeholder={t("confirmPasswordPlaceholder")}
          value={password.confirmPassword}
          onChange={(e) => onChangeInput(e, "confirmPassword")}
          type="password"
          autoComplete="new-password"
        ></input>
        <div className={cx("btn-wrapper")}>
          <button
            disabled={!password.password || !password.confirmPassword}
            className={cx({
              inactive: !password.password || !password.confirmPassword,
            })}
            type="submit"
          >
            <span>{t("submitSetting")}</span>
          </button>
        </div>
      </form>
    </ModalLayout>
  )
}

export default MakePassword
