"use client"

import { useTranslation } from "react-i18next"
import ModalLayout from ".."
import style from "./style.module.scss"

import { deleteSave } from "@/actions/save"
import { deleteUser } from "@/actions/user"
import { queryKey } from "@/config"
import { toastError, toastSuccess } from "@/config/toast"
import { useMainStore } from "@/store/main"
import { useQueryClient } from "@tanstack/react-query"
import cs from "classNames/bind"
import { useParams, useRouter } from "next/navigation"
import { useState } from "react"
import { Trans } from "react-i18next"
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
  const { lang } = useParams()
  const { push } = useRouter()
  const queryClient = useQueryClient()
  const { t } = useTranslation()
  const { setModal } = useMainStore()
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
          return toastError("mustPickFeedback")
        }
        if (confirmInitText !== confirmText) {
          setIsLoading(false)
          return toastError("invalidConfirmText")
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
          toastError("에러가 발생했어요. 나중에 다시 시도해주세요.")
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
      <h1>정말로 삭제하시겠어요?</h1>
      <div className={cx("description")}>
        <p>
          삭제를 진행하면 다시 되돌릴 수 없습니다. <br /> 괜찮으시다면 아래의 글자를 그대로 적고 확인을 눌러주세요.{" "}
          <br />
        </p>
        {confirmInitText === "deleteAccount" && (
          <p>
            <Trans i18nKey="deleteAccount"></Trans>
          </p>
        )}
      </div>

      <p>
        <span className={cx("confirm-text")}>
          {"* "}
          {confirmInitText}
        </span>
      </p>
      <input placeholder={confirmInitText} value={confirmText} onChange={onChangeInput} type="text"></input>
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
          disabled={confirmText !== confirmInitText || (confirmInitText === "deleteAccount" && !selectedOption)}
          className={cx({
            inactive: confirmText !== confirmInitText || (confirmInitText === "deleteAccount" && !selectedOption),
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
