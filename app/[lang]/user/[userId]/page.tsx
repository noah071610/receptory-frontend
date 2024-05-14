"use client"

import { addSave } from "@/actions/save"
import { getUser, getUserSaves } from "@/actions/user"
import { queryKey } from "@/config"
import { colors } from "@/config/colors"
import { toastError } from "@/config/toast"
import style from "@/containers/user-page/style.module.scss"
import { useTranslation } from "@/i18n/client"
import { Langs } from "@/types/Main"
import { SaveListType } from "@/types/Page"
import { UserType } from "@/types/User"
import hasString from "@/utils/helpers/hasString"
import setDateFormat from "@/utils/helpers/setDate"
import { getAnimation } from "@/utils/styles/getAnimation"
import { faFire, faFlag, faGear } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useQuery } from "@tanstack/react-query"
import cs from "classNames/bind"
import { useParams, useRouter } from "next/navigation"
import { useEffect } from "react"
const cx = cs.bind(style)

const List = ({
  userId,
  i,
  save: { title, description, thumbnail, format, pageId, updatedAt },
}: {
  save: SaveListType
  i: number
  userId: number
}) => {
  const { lang } = useParams()
  const { t } = useTranslation()
  const { push } = useRouter()
  const onClickList = (type: "insight" | "edit" | "page") => {
    switch (type) {
      case "insight":
        break
      case "edit":
        push(`/edit/${userId}/${pageId}`)
        break
      case "page":
        break
    }
  }
  return (
    <li
      style={getAnimation({ type: "flip", delay: 180 * i })}
      onClick={() => onClickList("edit")}
      className={cx("list")}
    >
      <div className={cx("list-main")}>
        <div className={cx("label")}>
          <span>Gather form</span>
          <div className={cx("active")}>
            <div className={cx("circle")}>
              <div style={{ backgroundColor: format === "active" ? colors.green : colors.red }}></div>
            </div>
          </div>
        </div>
        <picture>
          <img src={thumbnail ? thumbnail : "/images/noImage.png"} alt="thumbnail" />
        </picture>
        <div className={cx("list-content")}>
          <div className={cx("title")}>
            <h2>{hasString(title) ? title : "타이틀 입력"}</h2>
            <p>{hasString(description) ? description : "타이틀 입력"}</p>
          </div>
          <div className={cx("info")}>
            <span>
              {t("최근 수정일")}
              {" : "}
              {setDateFormat(new Date(updatedAt), lang)}
            </span>
          </div>
        </div>
      </div>
    </li>
  )
}

const UserPage = () => {
  const { push, back } = useRouter()
  const { lang, userId } = useParams()
  const queryUserId = parseInt(userId as string)

  const { data: user, isFetched: isFetchedUserQuery } = useQuery<UserType>({
    queryKey: queryKey.user,
    queryFn: getUser,
  })
  const { data: saves, isError } = useQuery<SaveListType[]>({
    queryKey: queryKey.save.list,
    queryFn: getUserSaves,
    enabled: user?.userId === queryUserId,
  })

  useEffect(() => {
    if (isFetchedUserQuery) {
      // 로그인 요청을 이미 보냄. 이제부터 판별 시작

      // 로그인 안했네?
      if (!user) return push("/login")

      // 남의 페이지를 왜 들어가? 미친놈 아님? ㅡㅡ
      if (user?.userId !== queryUserId) {
        toastError("잘못된 접근입니다.")
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
    if (isNaN(queryUserId)) return back()
  }, [userId, queryUserId])

  const onClickAddSave = async () => {
    if (user?.userId) {
      const newSave = await addSave(lang as Langs)
      if (newSave) {
        push(`/edit/${user.userId}/${newSave.pageId}`)
      }
    }
  }

  return (
    user && (
      <div className={cx("main")}>
        <div className={cx("content")}>
          <div className={cx("profile")}>
            <div className={cx("background")}></div>
            <picture>
              <img src={user.userImage} alt={`${user.userImage}_profile`} />
            </picture>
            <h1>{user.userName}</h1>
            <span className={cx("plan")}>{user.plan}</span>
            <ul>
              {[
                { value: "settings", icon: faGear },
                { value: "report", icon: faFlag },
                { value: "upgrade", icon: faFire },
              ].map(({ value, icon }) => (
                <li key={`user-info-${value}`}>
                  <div className={cx("icon")}>
                    <FontAwesomeIcon icon={icon} />
                  </div>
                  <span>{value}</span>
                </li>
              ))}
            </ul>
          </div>
          <ul className={cx("page-list")}>
            {(!saves || saves.length <= 0) && (
              <li className={cx("no-list")}>
                <img src="/images/icons/crying.png" alt="crying" />
                <span>만들어진 페이지가 없어요</span>
              </li>
            )}
            {saves && saves.map((save, i) => <List i={i} userId={user?.userId} save={save} key={`user-save-${i}`} />)}

            <div className={cx("add-list")}>
              <button onClick={onClickAddSave} className={cx("add")}>
                <span>새로운 페이지 추가</span>
              </button>
            </div>
          </ul>
        </div>
      </div>
    )
  )
}

export default UserPage
