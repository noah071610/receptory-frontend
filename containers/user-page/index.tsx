"use client"

import { getSaves } from "@/actions/save"
import PageLoading from "@/components/Loading/LoadingPage"
import ConfirmHard from "@/components/Modal/ConfirmHard"
import SelectLang from "@/components/Modal/SelectLang"
import { queryKey } from "@/config"
import { toastError } from "@/config/toast"
import PageCard from "@/containers/user-page/PageCard"
import Profile from "@/containers/user-page/Profile"
import style from "@/containers/user-page/style.module.scss"
import { usePageValidator } from "@/hooks/usePageValidator"
import UserPageLayout from "@/layout/UserPageLayout"
import { useMainStore } from "@/store/main"
import { Langs } from "@/types/Main"
import { SaveListType } from "@/types/Page"
import { useQuery } from "@tanstack/react-query"
import cs from "classNames/bind"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
const cx = cs.bind(style)

const UserPage = ({ lang }: { lang: Langs }) => {
  const { t } = useTranslation(["user-page", "messages"])
  const { user } = usePageValidator({ isAuth: true })
  const { modal, setModal } = useMainStore(["modal", "setModal"])
  const { userId } = useParams()
  const queryUserId = userId as string
  const [isLoading, setIsLoading] = useState(false)

  const { data: saves, isError } = useQuery<SaveListType[]>({
    queryKey: queryKey.save.list,
    queryFn: getSaves,
    enabled: user?.userId === queryUserId,
  })

  useEffect(() => {
    if (isError) {
      // 예상치 못한 에러가 발생했어요
      toastError("unknown")
    }
  }, [isError, t])

  const onClickAddSave = async () => {
    if (user?.userId) {
      if (saves && saves.length >= 2) {
        // 페이지는 최대 {{number}}개까지 만들 수 있어요
        toastError("maximumPage")
      }
      setModal({ section: null, type: "selectLang" })
    }
  }

  return (
    user && (
      <UserPageLayout>
        <Profile lang={lang} user={user} />
        <ul className={cx("page-list")}>
          {(!saves || saves.length <= 0) && (
            <li className={cx("no-list")}>
              <img src="/images/icons/crying.png" alt="crying" />
              <span>{t("noPage")}</span>
            </li>
          )}
          {saves && saves.map((save, i) => <PageCard i={i} userId={user?.userId} save={save} key={`user-save-${i}`} />)}

          <div className={cx("add-list")}>
            <button onClick={onClickAddSave} className={cx("add")}>
              <span>{t("addPage")}</span>
            </button>
          </div>
        </ul>
        <PageLoading isLoading={isLoading} />
        {modal.type === "confirmHard" && modal.payload && (
          <ConfirmHard setIsLoading={setIsLoading} confirmInitText={modal.payload.text} value={modal.payload?.value} />
        )}
        {modal.type === "selectLang" && (
          <SelectLang
            targetPageId={modal?.payload?.pageId}
            initLang={modal?.payload?.lang}
            user={user}
            setIsLoading={setIsLoading}
          />
        )}
      </UserPageLayout>
    )
  )
}

export default UserPage
