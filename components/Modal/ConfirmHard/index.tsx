"use client"

import { useTranslation } from "@/i18n/client"
import ModalLayout from ".."
import style from "./style.module.scss"

import { deleteUser } from "@/actions/user"
import { toastError } from "@/config/toast"
import cs from "classNames/bind"
import { useParams } from "next/navigation"
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

export const ConfirmHard = ({ confirmInitText }: { confirmInitText: string }) => {
  const { lang } = useParams()
  const { t } = useTranslation()
  const [selectedOption, setSelectedOption] = useState("")
  const [confirmText, setConfirmText] = useState("")
  const onChangeInput = (e: any) => {
    setConfirmText(e.target.value)
  }
  const onClickDelete = async () => {
    switch (confirmInitText) {
      case "deleteAccount": {
        if (!setSelectedOption) {
          return toastError("mustPickFeedback")
        }
        if (confirmInitText !== confirmText) {
          return toastError("invalidConfirmText")
        }
        const isOk = await deleteUser(selectedOption)
        if (isOk) {
          alert("감사합니다!")
        }
      }

      case "deleteAccount":
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
          disabled={confirmText !== confirmInitText || !selectedOption}
          className={cx({ inactive: confirmText !== confirmInitText || !selectedOption })}
          onClick={onClickDelete}
        >
          {t("delete")}
        </button>
      </div>
    </ModalLayout>
  )
}

export default ConfirmHard
