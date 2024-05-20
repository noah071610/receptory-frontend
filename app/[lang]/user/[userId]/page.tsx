"use client"

import { addSave, getSaves } from "@/actions/save"
import { getUser } from "@/actions/user"
import PageLoading from "@/components/Loading/LoadingPage"
import ConfirmHard from "@/components/Modal/ConfirmHard"
import { queryKey } from "@/config"
import { toastError } from "@/config/toast"
import PageCard from "@/containers/user-page/PageCard"
import Profile from "@/containers/user-page/Profile"
import style from "@/containers/user-page/style.module.scss"
import { useMainStore } from "@/store/main"
import { Langs } from "@/types/Main"
import { SaveListType } from "@/types/Page"
import { UserType } from "@/types/User"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import cs from "classNames/bind"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
const cx = cs.bind(style)

const UserPage = () => {
  const queryClient = useQueryClient()
  const { modal, setModal } = useMainStore()
  const { push, back } = useRouter()
  const { lang, userId } = useParams()
  const queryUserId = userId as string
  const [isLoading, setIsLoading] = useState(false)

  const { data: user, isFetched: isFetchedUserQuery } = useQuery<UserType>({
    queryKey: queryKey.user,
    queryFn: getUser,
  })
  const { data: saves, isError } = useQuery<SaveListType[]>({
    queryKey: queryKey.save.list,
    queryFn: getSaves,
    enabled: user?.userId === queryUserId,
  })

  useEffect(() => {
    if (isFetchedUserQuery) {
      // 로그인 요청을 이미 보냄. 이제부터 판별 시작

      // 로그인 안했네?
      if (!user) return push("/login")

      // 남의 페이지를 왜 들어가? 미친놈 아님? ㅡㅡ
      if (user?.userId !== queryUserId) {
        alert("잘못된 접근입니다.")
        return back()
      }
    }
  }, [user, userId, isFetchedUserQuery])

  useEffect(() => {
    if (isError) {
      toastError("저장 데이터를 불러오는데에 에러가 발생했어요")
    }
  }, [isError])

  useEffect(() => {
    // 잘못된 url 접근 차단
    if (typeof userId !== "string") return back()
  }, [userId])

  const onClickAddSave = async () => {
    if (user?.userId) {
      if (saves && saves.length >= 2) {
        return toastError("페이지는 최대 2개까지 만들 수 있어요")
      }
      setIsLoading(true)
      const newSave = await addSave(lang as Langs)
      if (newSave) {
        await queryClient.invalidateQueries({ queryKey: queryKey.save.list })
        setTimeout(() => {
          push(`/edit/${user.userId}/${newSave.pageId}`)
        }, 500)
      } else {
        setIsLoading(false)
      }
    }
  }

  const onClickMain = (e: any) => {
    const closestElement = e.target.closest("[data-global-closer]")

    if (!closestElement && modal.type) {
      setModal({ section: null, type: null }) // main store (유저용)
    }
  }

  return (
    user && (
      <>
        <div onClick={onClickMain} className={cx("main")}>
          <div className={cx("content")}>
            <Profile user={user} />
            <ul className={cx("page-list")}>
              {(!saves || saves.length <= 0) && (
                <li className={cx("no-list")}>
                  <img src="/images/icons/crying.png" alt="crying" />
                  <span>만들어진 페이지가 없어요</span>
                </li>
              )}
              {saves &&
                saves.map((save, i) => <PageCard i={i} userId={user?.userId} save={save} key={`user-save-${i}`} />)}

              <div className={cx("add-list")}>
                <button onClick={onClickAddSave} className={cx("add")}>
                  <span>새로운 페이지 추가</span>
                </button>
              </div>
            </ul>
          </div>
          <PageLoading isLoading={isLoading} />
          {modal.type === "confirmHard" && modal.payload && <ConfirmHard confirmInitText={modal.payload} />}
        </div>
      </>
    )
  )
}

export default UserPage
