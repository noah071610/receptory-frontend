"use client"

import { getUser } from "@/actions/user"
import { getTemplateText, setTemplate } from "@/actions/website"
import { _url } from "@/config"
import { Langs } from "@/types/Main"
import cs from "classnames/bind"
import { useRouter } from "next/navigation"
import { useLayoutEffect, useState } from "react"
import style from "./style.module.scss"
const cx = cs.bind(style)

function parseTextToObjects(text: string) {
  const lines = text.split("\n")
  const result = []
  let currentTitle = ""
  let currentIds = []

  for (const line of lines) {
    if (line.startsWith("### ")) {
      // 새로운 타이틀을 만나면, 이전 타이틀과 ids를 저장
      if (currentTitle) {
        result.push({ category: currentTitle, ids: currentIds })
      }
      // 새로운 타이틀을 설정하고 ids 초기화
      currentTitle = line.slice(4).trim()
      currentIds = []
    } else if (line.trim()) {
      // 빈 줄이 아닌 경우 id로 간주하고 추가
      currentIds.push(line.trim())
    }
  }

  // 마지막 타이틀과 ids를 저장
  if (currentTitle) {
    result.push({ category: currentTitle, ids: currentIds })
  }

  return result
}

const AdminPage = () => {
  const [templates, setTemplates] = useState<{
    text: string
    lang: Langs
  }>({
    text: "",
    lang: "ko",
  })

  const [isAdmin, setIsAdmin] = useState(false)
  const { back } = useRouter()

  const onChangeTextarea = (e: any) => {
    setTemplates((prev) => ({
      ...prev,
      text: e.target.value,
    }))
  }

  const onClickChangeLang = async (v: Langs) => {
    const data = await getTemplateText(v, "template")
    if (data) {
      setTemplates(data)
    }
  }
  const onClickOpenPage = (id: string) => {
    window.open(`${_url.client}/page/${id}`)
  }
  const onClickSubmit = async () => {
    const res = await setTemplate(templates)
    if (res.msg === "error.noPost") {
      alert(`${res.data}의 값이 없음`)
      return
    }
    if (res === "ok") {
      alert("템플릿 제출 완료")
    } else {
      alert("에러발생")
    }
  }

  useLayoutEffect(() => {
    const fetchData = async () => {
      const user = await getUser()

      // 검증
      if (user?.userId) {
        if (user.userId === process.env.NEXT_PUBLIC_ADMIN_ID) {
          const data = await getTemplateText("ko", "template")
          if (data) {
            setTemplates(data)
            setIsAdmin(true)
          } else {
            alert("잘못된 엑세스 입니다")
            return back()
          }
        } else {
          back()
        }
      } else {
        back()
      }
    }
    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const tempList = parseTextToObjects(templates.text)
  return (
    isAdmin && (
      <div className={cx("main")}>
        <div className={cx("content")}>
          <textarea value={templates.text} onChange={onChangeTextarea} />
          <h3>선택된 언어</h3>
          <div className={cx("langs")}>
            {["ko", "ja", "en", "th"].map((v) => (
              <button
                onClick={() => onClickChangeLang(v as Langs)}
                className={cx("btn", { active: templates.lang === v })}
                key={`langbtn-${v}`}
              >
                {v}
              </button>
            ))}
          </div>
          <h3>선택된 페이지</h3>
          {tempList.map(({ category, ids }, i) => (
            <div className={cx("preview")} key={`ct-${category}-${i}`}>
              <h4>{category}</h4>
              <div className={cx("selected-page")}></div>
              {ids.map((id, j) => (
                <button className={cx("btn")} onClick={() => onClickOpenPage(id)} key={`selectPage-${id}-${j}`}>
                  {id}
                </button>
              ))}
            </div>
          ))}
          <h3>제출 하기</h3>
          <button onClick={onClickSubmit} className={cx("submit")}>
            제출하기
          </button>
        </div>
      </div>
    )
  )
}

export default AdminPage
