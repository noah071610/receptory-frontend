"use client"

import ModalLayout from ".."
import style from "./style.module.scss"

import { deleteSave } from "@/actions/save"
import { deleteUser } from "@/actions/user"
import { queryKey } from "@/config"
import { toastError, toastSuccess } from "@/config/toast"
import { useMainStore } from "@/store/main"
import { useQueryClient } from "@tanstack/react-query"
import cs from "classnames/bind"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useTranslation } from "react-i18next"
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
  const { push } = useRouter()
  const { setModal } = useMainStore(["pageLang", "setModal"])
  const { t } = useTranslation(["modal"])
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
          return toastError("mustPickFeedback")
        }
        if (confirmInitText !== confirmText) {
          setIsLoading(false)
          // invalidDeleteConfirmText
          return toastError("invalidDeleteConfirmText")
        }
        const isOk = await deleteUser(selectedOption)
        if (isOk) {
          alert(t("thankForUsing"))
          setModal({
            section: null,
            type: null,
          })
          return push("/login")
        }
      }

      case "deletePage":
        if (!value) {
          toastError("unknown")
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
            toastSuccess("deploy")
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
