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
import i18next from "@/i18n/init"
import UserPageLayout from "@/layout/UserPageLayout"
import { useMainStore } from "@/store/main"
import { Langs } from "@/types/Main"
import { SaveListType } from "@/types/Page"
import { useQuery } from "@tanstack/react-query"
import cs from "classNames/bind"
import { useParams } from "next/navigation"
import { useEffect, useLayoutEffect, useState } from "react"
import { useTranslation } from "react-i18next"
const cx = cs.bind(style)

const UserPage = ({ lang }: { lang: Langs }) => {
  const { t } = useTranslation(["user-page"])
  const { user } = usePageValidator({ isAuth: true })
  const { modal, setModal, setPageLang } = useMainStore(["modal", "setModal", "setPageLang"])
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
        return toastError("maximumPage")
      }
      setModal({ section: null, type: "selectLang" })
    }
  }

  useLayoutEffect(() => {
    if (i18next) {
      i18next.changeLanguage(lang)
    }
    setPageLang(lang)
  }, [lang, setPageLang])

  return (
    user && (
      <UserPageLayout>
        <Profile lang={lang} user={user} />
        <div className={cx("page-list-wrapper")}>
          <ul className={cx("page-list")}>
            {(!saves || saves.length <= 0) && (
              <li className={cx("no-list")}>
                <img src="/images/icons/crying.png" alt="crying" />
                <span>{t("noPage")}</span>
              </li>
            )}
            {saves &&
              saves.map((save, i) => (
                <PageCard lang={lang} i={i} userId={user?.userId} save={save} key={`user-save-${i}`} />
              ))}
          </ul>

          <div className={cx("add-list")}>
            <button onClick={onClickAddSave} className={cx("add")}>
              <span>{t("addPage")}</span>
            </button>
          </div>
        </div>

        <PageLoading isLoading={isLoading} />
        {modal.type === "confirmHard" && modal.payload && (
          <ConfirmHard setIsLoading={setIsLoading} confirmInitText={modal.payload.text} value={modal.payload?.value} />
        )}
        {modal.type === "selectLang" && (
          <SelectLang
            targetPageId={modal?.payload?.pageId}
            initLang={modal?.payload?.lang}
            isChangeSiteLang={modal?.payload?.isChangeSiteLang}
            user={user}
            setIsLoading={setIsLoading}
          />
        )}
      </UserPageLayout>
    )
  )
}

export default UserPage
