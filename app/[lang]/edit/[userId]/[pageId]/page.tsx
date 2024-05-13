"use client"

import { getSave } from "@/actions/save"
import { getUser } from "@/actions/user"
import Loading from "@/components/Loading"
import ImageSelector from "@/components/Modal/ImageSelector"
import SectionLayout from "@/components/Sections/index"
import { queryKey } from "@/config"
import style from "@/containers/edit-page/style.module.scss"
import { useEditorStore } from "@/store/editor"
import { SaveType } from "@/types/Page"
import { UserType } from "@/types/User"
import { useQuery } from "@tanstack/react-query"
import cs from "classNames/bind"
import { isNaN } from "lodash"
import { useParams, usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"

import ModalLoading from "@/components/Modal/ModalLoading"
import { toastError } from "@/config/toast"
import EditorFooter from "@/containers/edit-page/EditorFooter"
import PageLayout from "@/containers/edit-page/PageLayout"
import Preview from "@/containers/edit-page/Preview"
import Rending from "@/containers/edit-page/Rending"
import SectionList from "@/containers/edit-page/SectionList"
import { sectionMap } from "@/containers/edit-page/sectionMap"
import Header from "@/containers/global/Header"
import { useMainStore } from "@/store/main"
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
  const pathname = usePathname()
  const { lang } = useParams()
  const { push, back } = useRouter()
  const { userId, pageId } = useParams()
  const queryUserId = parseInt(userId as string)
  const { modal } = useMainStore()
  const { data: user, isFetched: isFetchedUserQuery } = useQuery<UserType>({
    queryKey: queryKey.user,
    queryFn: getUser,
  })
  const { data: save, isError: isErrorGetSave } = useQuery<SaveType>({
    queryKey: queryKey.save.edit,
    queryFn: () => getSave(pageId as string),
    enabled: user?.userId === queryUserId && !!pageId && typeof pageId === "string",
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
    if (isErrorGetSave) {
      toastError("데이터를 찾지 못했습니다.")
      return back()
    }
  }, [isErrorGetSave])

  useEffect(() => {
    // 잘못된 url 접근 차단
    if (typeof userId !== "string") return back()
    if (isNaN(queryUserId)) return back()
    if (typeof pageId !== "string") return back()
  }, [userId, pageId, queryUserId])

  const {
    initSections,
    stage,
    formSections,
    active,
    loadSections,
    currentUsedImages,
    currentUsedColors,
    rendingSections,
    pageOptions,
  } = useEditorStore()

  const activeModal = active.modal.type

  useEffect(() => {
    const handleBeforeUnloadCallback = async (e: any) => {
      // await saveContentFromEditor({
      //   content: {
      //     stage,
      //     initSections,
      //     formSections,
      //     rendingSections,
      //     currentUsedImages,
      //     currentUsedColors,
      //     pageOptions,
      //   },
      //   pageId,
      //   lang: lang as Langs,
      //   event: e,
      // })
    }
    window.addEventListener("beforeunload", handleBeforeUnloadCallback)

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnloadCallback)
    }
  }, [initSections, formSections, currentUsedImages, currentUsedColors, lang, stage])

  useEffect(() => {
    !(async function () {
      if (save) {
        // 완전 처음
        if (save.content?.initSections && save.content?.initSections?.length <= 0) return setIsLoading(false)

        // 아니면 로드 어짜피 store에서도 reducer들이 걸러줌
        loadSections(save.content, save.lang, save.format)

        setTimeout(() => {
          setIsLoading(false)
        }, 1000)
      }
    })()
  }, [save])

  const topSections =
    stage === "rending" ? rendingSections.slice(0, 2) : (stage === "init" ? initSections : formSections).slice(0, 1)

  return (
    <>
      <Header />
      <PageLayout>
        <div className={cx("main")}>
          <div className={cx("loading-cover", { success: !isLoading })}>{isLoading && <Loading />}</div>
          <div className={cx("editor")}>
            {topSections?.map((v, i) => (
              <SectionLayout key={`top-${stage}-${i}`} pathname={pathname} isTopSection={true} section={v}>
                {sectionMap[v.type](v)}
              </SectionLayout>
            ))}

            <SectionList sections={initSections} stage={stage} type="init" />
            <SectionList sections={formSections} stage={stage} type="form" />
            <SectionList sections={rendingSections} stage={stage} type="rending" />
            {stage === "rending" && <Rending />}

            <EditorFooter />
          </div>
          <Preview />
        </div>

        {activeModal?.includes("image") && <ImageSelector />}
        {modal.type === "time" && modal.section && <TimePicker section={modal.section} />}
        {modal.type === "date" && modal.section && <DatePicker section={modal.section} />}
        {modal.type === "dateSelect" && modal.section && <DateSelector section={modal.section} />}
        {modal.type === "select" && modal.section && <SelectList section={modal.section} />}
      </PageLayout>
    </>
  )
}

export default EditPage
