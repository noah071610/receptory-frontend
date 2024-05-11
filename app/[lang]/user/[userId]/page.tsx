"use client"

import { addSave } from "@/actions/save"
import { getUser, getUserSaves } from "@/actions/user"
import { queryKey } from "@/config"
import { colors } from "@/config/colors"
import style from "@/containers/user-page/style.module.scss"
import { Langs } from "@/types/Main"
import { SaveListType } from "@/types/Page"
import { UserType } from "@/types/User"
import { getImageUrl } from "@/utils/helpers/getImageUrl"
import hasString from "@/utils/helpers/hasString"
import setDateFormat from "@/utils/helpers/setDate"
import { faArrowUpRightFromSquare, faChartLine, faPencil } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useQuery } from "@tanstack/react-query"
import cs from "classNames/bind"
import { useParams, useRouter } from "next/navigation"
import { useEffect } from "react"
const cx = cs.bind(style)

const List = ({
  userId,
  save: { title, description, thumbnail, format, pageId },
}: {
  save: SaveListType
  userId: number
}) => {
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
    <li className={cx("list")}>
      <div
        style={{
          background: getImageUrl({ url: thumbnail ? thumbnail : "/images/noImage.png" }),
        }}
        className={cx("list-main")}
      >
        <div className={cx("list-content")}>
          <div className={cx("top")}>
            <div className={cx("title")}>
              <h2>{hasString(title) ? title : "타이틀 입력"}</h2>
              <p>{hasString(description) ? description : "타이틀 입력"}</p>
            </div>
            <div className={cx("active")}>
              <div className={cx("circle")}>
                <div style={{ backgroundColor: format === "active" ? colors.green : colors.red }}></div>
              </div>
            </div>
          </div>
          <ul className={cx("bottom")}>
            <li>
              <button onClick={() => onClickList("insight")}>
                <span>인사이트</span>
                <FontAwesomeIcon icon={faChartLine} />
              </button>
            </li>
            <li>
              <button onClick={() => onClickList("edit")}>
                <span>수정하기</span>
                <FontAwesomeIcon icon={faPencil} />
              </button>
            </li>
            <li>
              <button onClick={() => onClickList("page")}>
                <span>사이트 방문</span>
                <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
              </button>
            </li>
          </ul>
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
        alert("잘못된 접근입니다.")
        return back()
      }
    }
  }, [user, userId, isFetchedUserQuery])

  useEffect(() => {
    if (isError) {
      alert("저장 데이터를 불러오는데에 에러가 발생했어요")
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
          <h1>
            <img src="/images/icons/user.png" /> <span>안녕하세요! {user.userName}</span>
          </h1>
          <div className={cx("profile")}>
            <picture>
              <img src={user.userImage} alt={`${user.userImage}_profile`} />
            </picture>
            <div className={cx("profile-content")}>
              <span>이름 : {user.userName}</span>
              <span>소셜 로그인 : {user.provider}</span>
              <span>플랜 : {user.plan}</span>
              <span>가입일 : {setDateFormat(user.createdAt, lang)}</span>
            </div>
          </div>
          <h1>
            <img src="/images/icons/house.png" /> <span>페이지 리스트</span>
          </h1>
          <ul className={cx("page-list")}>
            {(!saves || saves.length <= 0) && (
              <li className={cx("no-list")}>
                <img src="/images/icons/crying.png" alt="crying" />
                <span>만들어진 페이지가 없어요</span>
              </li>
            )}
            {saves && saves.map((save, i) => <List userId={user?.userId} save={save} key={`user-save-${i}`} />)}

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
