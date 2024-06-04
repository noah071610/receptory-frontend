"use client"

import { getUser } from "@/actions/user"
import Loading from "@/components/Loading"
import ImageSelector from "@/components/Modal/ImageSelector"
import SectionLayout from "@/components/Sections/index"
import { queryKey } from "@/config"
import style from "@/containers/edit-page/style.module.scss"
import { initialStates, useEditorStore } from "@/store/editor"
import { UserType } from "@/types/User"
import { useQuery } from "@tanstack/react-query"
import cs from "classNames/bind"
import { isNaN } from "lodash"
import { useParams, usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"

import { getSave } from "@/actions/save"
import PageLoading from "@/components/Loading/LoadingPage"
import ModalLoading from "@/components/Modal/ModalLoading"
import EditorFooter from "@/containers/edit-page/EditorFooter"
import Header from "@/containers/edit-page/Header"
import PageLayout from "@/containers/edit-page/PageLayout"
import Preview from "@/containers/edit-page/Preview"
import Rending from "@/containers/edit-page/Rending"
import SectionList from "@/containers/edit-page/SectionList"
import { sectionMap } from "@/containers/edit-page/sectionMap"
import { useMainStore } from "@/store/main"
import { Langs } from "@/types/Main"
import { SaveType } from "@/types/Page"
import { saveContentFromEditor } from "@/utils/editor/saveContentFromEditor"
import dynamic from "next/dynamic"
const cx = cs.bind(style)

const DatePicker = dynamic(() => import("@/components/Modal/DatePicker"), {
  ssr: true,
  loading: () => <ModalLoading />,
})
const TimePicker = dynamic(() => import("@/components/Modal/TimePicker"), {
  ssr: true,
  loading: () => <ModalLoading />,
})
const DateSelector = dynamic(() => import("@/components/Modal/DateSelector"), {
  ssr: true,
  loading: () => <ModalLoading />,
})
const SelectList = dynamic(() => import("@/components/Modal/SelectList"), {
  ssr: true,
  loading: () => <ModalLoading />,
})

const EditPage = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [isModalLoading, setIsModalLoading] = useState(false)
  const pathname = usePathname()
  const { lang } = useParams()
  const { push, back } = useRouter()
  const { userId, pageId } = useParams()
  const queryUserId = userId as string
  const { modal } = useMainStore()
  const { data: user, isFetched: isFetchedUserQuery } = useQuery<UserType>({
    queryKey: queryKey.user,
    queryFn: getUser,
  })
  const [save, setSave] = useState<null | SaveType>(null)

  const { homeSections, stage, formSections, active, loadSections, confirmSections } = useEditorStore()

  const activeModal = active.modal.type

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
    if (!save && user?.userId === queryUserId && !!pageId && typeof pageId === "string") {
      !(async function () {
        const data = await getSave(pageId)
        if (data === "notFound") {
          alert("포스트가 존재하지 않습니다.")
          return back()
        }

        if (!data.content?.homeSections || data.content?.homeSections?.length <= 0) {
          await saveContentFromEditor({
            content: initialStates,
            pageId,
            lang: lang as Langs,
            noMessage: true,
          })
          return setIsLoading(false)
        }

        // 아니면 로드 어짜피 store에서도 reducer들이 걸러줌
        loadSections(data.content)

        setTimeout(() => {
          setIsLoading(false)
        }, 1000)

        setSave(data)
      })()
    }
  }, [save, user, queryUserId, pageId])

  useEffect(() => {
    // 잘못된 url 접근 차단
    if (typeof userId !== "string") return back()
    if (isNaN(queryUserId)) return back()
    if (typeof pageId !== "string") return back()
  }, [userId, pageId, queryUserId])

  // useEffect(() => {
  //   const handleBeforeUnloadCallback = async (e: any) => {
  //     await saveContentFromEditor({
  //       content: {
  //         stage,
  //         homeSections,
  //         formSections,
  //         confirmSections,
  //         currentUsedImages,
  //         currentUsedColors,
  //         pageOptions,
  //       },
  //       pageId,
  //       lang: lang as Langs,
  //       event: e,
  //       noMessage: true,
  //     })
  //   }
  //   window.addEventListener("beforeunload", handleBeforeUnloadCallback)

  //   return () => {
  //     window.removeEventListener("beforeunload", handleBeforeUnloadCallback)
  //   }
  // }, [homeSections, formSections, pageOptions, currentUsedImages, currentUsedColors, lang, stage])

  const topSections =
    stage === "confirm" ? confirmSections.slice(0, 2) : (stage === "home" ? homeSections : formSections).slice(0, 1)

  return (
    <>
      <Header />
      <PageLayout>
        <div className={cx("main", { isRending: stage === "rending" })}>
          <div className={cx("loading-cover", { success: !isLoading })}>{isLoading && <Loading isFull={true} />}</div>
          <div className={cx("editor")}>
            {stage !== "rending" &&
              topSections?.map((v, i) => (
                <SectionLayout key={`top-${stage}-${i}`} pathname={pathname} isTopSection={true} section={v}>
                  {sectionMap[v.type](v)}
                </SectionLayout>
              ))}

            {stage === "home" && <SectionList sections={homeSections} stage={stage} />}
            {stage === "form" && <SectionList sections={formSections} stage={stage} />}
            {stage === "confirm" && <SectionList sections={confirmSections} stage={stage} />}
            {stage === "rending" && <Rending isLoading={isModalLoading} setIsLoading={setIsModalLoading} />}

            {stage !== "rending" && <EditorFooter />}
          </div>
          {stage !== "rending" && <Preview />}
        </div>

        {activeModal?.includes("image") && (
          <ImageSelector
            IsUseEmoji={!!activeModal.match(/(callout|thumbnail)/g)?.length}
            setIsLoading={setIsModalLoading}
          />
        )}
        {modal.type === "time" && modal.section && <TimePicker section={modal.section} />}
        {modal.type === "date" && modal.section && <DatePicker section={modal.section} />}
        {modal.type === "dateSelect" && modal.section && <DateSelector section={modal.section} />}
        {modal.type === "select" && modal.section && <SelectList section={modal.section} />}
        <PageLoading isLoading={isModalLoading} />
      </PageLayout>
    </>
  )
}

export default EditPage
