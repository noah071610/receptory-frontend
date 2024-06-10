"use client"

import ModalLayout from ".."
import style from "./style.module.scss"

import { deleteSave } from "@/actions/save"
import { deleteUser } from "@/actions/user"
import { queryKey } from "@/config"
import { toastError, toastSuccess } from "@/config/toast"
import { useTranslation } from "@/i18n/client"
import { useMainStore } from "@/store/main"
import { useQueryClient } from "@tanstack/react-query"
import cs from "classNames/bind"
import { useRouter } from "next/navigation"
import { useState } from "react"
const cx = cs.bind(style)

const optionArr = [
  "dontLikeSite",
  "missingFeatures",
  "movingToAnother",
  "privacyConcerns",
  "notUsingAnymore",
  "tooExpensive",
  "techIssues",
  "contentNotGood",
  "badCustomerSupport",
  "tooComplicated",
]

export const ConfirmHard = ({
  confirmInitText,
  value,
  setIsLoading,
}: {
  confirmInitText: string
  value?: string
  setIsLoading: (b: boolean) => void
}) => {
  // todo:
  const { push } = useRouter()
  const { setModal, pageLang } = useMainStore(["pageLang", "setModal"])
  const { t } = useTranslation(pageLang, ["modal", "messages"])
  const queryClient = useQueryClient()
  const [selectedOption, setSelectedOption] = useState("")
  const [confirmText, setConfirmText] = useState("")
  const onChangeInput = (e: any) => {
    setConfirmText(e.target.value)
  }
  const onClickDelete = async () => {
    setIsLoading(true)
    switch (confirmInitText) {
      case "deleteAccount": {
        if (!setSelectedOption) {
          setIsLoading(false)
          // mustPickFeedback
          return toastError(t("error.mustPickFeedback", { ns: "messages" }))
        }
        if (confirmInitText !== confirmText) {
          setIsLoading(false)
          // invalidDeleteConfirmText
          return toastError(t("error.invalidDeleteConfirmText", { ns: "messages" }))
        }
        const isOk = await deleteUser(selectedOption)
        if (isOk) {
          alert("이용해주셔서 감사합니다.")
          setModal({
            section: null,
            type: null,
          })
          return push("/login")
        }
      }

      case "deletePage":
        if (!value) {
          toastError(t("error.unknown", { ns: "messages" }))
          setIsLoading(false)
          return setModal({
            section: null,
            type: null,
          })
        }
        const isOk = await deleteSave(value)
        if (isOk) {
          setTimeout(() => {
            queryClient.invalidateQueries({ queryKey: queryKey.save.list })
            queryClient.invalidateQueries({ queryKey: queryKey.page(value) })
            setIsLoading(false)
            toastSuccess("페이지를 삭제했어요.")
            setModal({
              section: null,
              type: null,
            })
          }, 1000)
        }
        break

      default:
        break
    }
  }
  const handleSelectChange = (event: any) => {
    setSelectedOption(event.target.value)
  }

  return (
    <ModalLayout modalStyle={style["confirm-hard-content"]}>
      <h1>{t("confirmDeleteTitle")}</h1>
      <div className={cx("description")}>
        <p dangerouslySetInnerHTML={{ __html: t("confirmDeleteDescription") }}></p>
      </div>

      <p>
        <span className={cx("confirm-text")}>
          {"* "}
          {t(confirmInitText)}
        </span>
      </p>
      <input placeholder={t(confirmInitText)} value={confirmText} onChange={onChangeInput} type="text"></input>
      {confirmInitText === "deleteAccount" && (
        <select value={selectedOption} onChange={handleSelectChange}>
          <option value="" disabled>
            {t("whyYouDelete")}
          </option>
          {optionArr.map((value) => (
            <option key={value} value={value}>
              {t(value)}
            </option>
          ))}
        </select>
      )}
      <div className={cx("btn-wrapper")}>
        <button
          disabled={confirmText !== t(confirmInitText) || (confirmInitText === "deleteAccount" && !selectedOption)}
          className={cx({
            inactive: confirmText !== t(confirmInitText) || (confirmInitText === "deleteAccount" && !selectedOption),
          })}
          onClick={onClickDelete}
        >
          {t("delete")}
        </button>
      </div>
    </ModalLayout>
  )
}

export default ConfirmHard
