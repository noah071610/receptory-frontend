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
import { SaveListType } from "@/types/Page"
import { useQuery } from "@tanstack/react-query"
import cs from "classNames/bind"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
const cx = cs.bind(style)

const UserPage = () => {
  const { user } = usePageValidator({ isAuth: true })
  const { modal, setModal } = useMainStore()
  const { lang, userId } = useParams()
  const queryUserId = userId as string
  const [isLoading, setIsLoading] = useState(false)

  const { data: saves, isError } = useQuery<SaveListType[]>({
    queryKey: queryKey.save.list,
    queryFn: getSaves,
    enabled: user?.userId === queryUserId,
  })

  useEffect(() => {
    if (isError) {
      toastError("저장 데이터를 불러오는데에 에러가 발생했어요")
    }
  }, [isError])

  const onClickAddSave = async () => {
    if (user?.userId) {
      if (saves && saves.length >= 2) {
        return toastError("페이지는 최대 2개까지 만들 수 있어요")
      }
      setModal({ section: null, type: "selectLang" })
    }
  }

  return (
    user && (
      <UserPageLayout>
        <Profile user={user} />
        <ul className={cx("page-list")}>
          {(!saves || saves.length <= 0) && (
            <li className={cx("no-list")}>
              <img src="/images/icons/crying.png" alt="crying" />
              <span>만들어진 페이지가 없어요</span>
            </li>
          )}
          {saves && saves.map((save, i) => <PageCard i={i} userId={user?.userId} save={save} key={`user-save-${i}`} />)}

          <div className={cx("add-list")}>
            <button onClick={onClickAddSave} className={cx("add")}>
              <span>새로운 페이지 추가</span>
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
