"use client"

import { getSave } from "@/actions/save"
import { getUser } from "@/actions/user"
import Loading from "@/components/Loading"
import DatePicker from "@/components/Modal/DatePicker"
import DateSelector from "@/components/Modal/DateSelector"
import ImageSelector from "@/components/Modal/ImageSelector"
import SelectList from "@/components/Modal/SelectList"
import TimePicker from "@/components/Modal/TimePicker"
import Calender from "@/components/Sections/Calender"
import Empty from "@/components/Sections/Empty"
import Thumbnail from "@/components/Sections/Thumbnail"
import SectionLayout from "@/components/Sections/index"
import { queryKey } from "@/config"
import style from "@/containers/edit-page/style.module.scss"
import { useEditorStore } from "@/store/editor"
import { SectionListTypes, SectionType } from "@/types/Edit"
import { Langs } from "@/types/Main"
import { SaveType } from "@/types/Page"
import { UserType } from "@/types/User"
import saveContentFromEditor from "@/utils/saveContentFromEditor"
import { DragDropContext, Draggable, DropResult, Droppable } from "@hello-pangea/dnd"
import { useQuery } from "@tanstack/react-query"
import cs from "classNames/bind"
import { isNaN } from "lodash"
import dynamic from "next/dynamic"
import { useParams, usePathname, useRouter } from "next/navigation"
import { useEffect, useMemo, useState } from "react"
const cx = cs.bind(style)

const Callout = dynamic(() => import("@/components/Sections/Callout/index"), {
  ssr: true,
})
const Album = dynamic(() => import("@/components/Sections/Album/index"), {
  ssr: true,
})
const Contact = dynamic(() => import("@/components/Sections/Contact/index"), {
  ssr: true,
})
const Slider = dynamic(() => import("@/components/Sections/Slider/index"), {
  ssr: true,
})
const Text = dynamic(() => import("@/components/Sections/Text/index"), {
  ssr: true,
})
const Title = dynamic(() => import("@/components/Sections/Title/index"), {
  ssr: true,
})
const Map = dynamic(() => import("@/components/Sections/Map/index"), {
  ssr: true,
})
const QnA = dynamic(() => import("@/components/Sections/QnA/index"), {
  ssr: true,
})
const Time = dynamic(() => import("@/components/Sections/Time/index"), {
  ssr: true,
})
const Select = dynamic(() => import("@/components/Sections/SelectList/index"), {
  ssr: true,
})
const FormInput = dynamic(() => import("@/components/Sections/FormInput/index"), {
  ssr: true,
})
const CheckList = dynamic(() => import("@/components/Sections/CheckList/index"), {
  ssr: true,
})

export const sectionMap: Record<SectionListTypes, (section: SectionType, isDisplayMode?: boolean) => any> = {
  album: (section, isDisplayMode = false) => <Album section={section} isDisplayMode={isDisplayMode} />,
  text: (section, isDisplayMode = false) => <Text section={section} isDisplayMode={isDisplayMode} />,
  title: (section, isDisplayMode = false) => <Title section={section} isDisplayMode={isDisplayMode} />,
  contact: (section, isDisplayMode = false) => <Contact section={section} isDisplayMode={isDisplayMode} />,
  callout: (section, isDisplayMode = false) => <Callout section={section} isDisplayMode={isDisplayMode} />,
  slider: (section, isDisplayMode = false) => <Slider section={section} isDisplayMode={isDisplayMode} />,
  map: (section, isDisplayMode = false) => <Map section={section} isDisplayMode={isDisplayMode} />,
  qna: (section, isDisplayMode = false) => <QnA section={section} isDisplayMode={isDisplayMode} />,
  calender: (section, isDisplayMode = false) => <Calender section={section} isDisplayMode={isDisplayMode} />,
  thumbnail: (section, isDisplayMode = false) => <Thumbnail section={section} isDisplayMode={isDisplayMode} />,
  input: (section, isDisplayMode = false) => <FormInput section={section} isDisplayMode={isDisplayMode} />,
  time: (section, isDisplayMode = false) => <Time section={section} isDisplayMode={isDisplayMode} />,
  select: (section, isDisplayMode = false) => <Select section={section} isDisplayMode={isDisplayMode} />,
  empty: () => <Empty />,
  checkList: (section, isDisplayMode = false) => <CheckList section={section} isDisplayMode={isDisplayMode} />,
}

const EditPage = () => {
  const [isLoading, setIsLoading] = useState(true)
  const pathname = usePathname()
  const { lang } = useParams()
  const { push, back } = useRouter()
  const { userId, pageId } = useParams()
  const queryUserId = parseInt(userId as string)
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
        alert("잘못된 접근입니다.")
        return back()
      }
    }
  }, [user, userId, isFetchedUserQuery])

  useEffect(() => {
    if (isErrorGetSave) {
      alert("데이터를 찾지 못했습니다.")
      return back()
    }
  }, [isErrorGetSave])

  useEffect(() => {
    // 잘못된 url 접근 차단
    if (typeof userId !== "string") return back()
    if (isNaN(queryUserId)) return back()
    if (typeof pageId !== "string") return back()
  }, [userId, pageId, queryUserId])

  const { initSections, stage, formSections, moveSection, active, loadSections, currentUsedImages, currentUsedColors } =
    useEditorStore()

  const sections = useMemo(
    () => (stage === "init" ? initSections : stage === "form" ? formSections : []),
    [initSections, formSections, stage]
  )

  const activeModal = active.modal.type

  const onDragEnd = (result: DropResult) => {
    const { destination, source } = result

    if (!destination || typeof destination.index !== "number") return

    moveSection({ from: source.index, to: destination.index })
  }

  useEffect(() => {
    const handleBeforeUnloadCallback = async (e: any) => {
      await saveContentFromEditor({
        content: { stage, initSections, formSections, currentUsedImages, currentUsedColors },
        pageId,
        lang: lang as Langs,
        event: e,
      })
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
        loadSections(save.content)

        setTimeout(() => {
          setIsLoading(false)
        }, 1000)
      }
    })()
  }, [save])

  return (
    <>
      <div className={cx("loading-cover", { success: !isLoading })}>{isLoading && <Loading />}</div>
      {sections?.length > 0 && (
        <SectionLayout pathname={pathname} noPadding={sections[0].type === "thumbnail"} section={sections[0]}>
          {stage === "init" ? (
            <Thumbnail section={sections[0]} />
          ) : stage === "form" ? (
            <Calender section={sections[0]} />
          ) : (
            <></>
          )}
        </SectionLayout>
      )}
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable">
          {(droppableProvided) => (
            <div {...droppableProvided.droppableProps} ref={droppableProvided.innerRef}>
              {sections.slice(1).map((v, i) => (
                <Draggable index={i + 1} key={v.id} draggableId={v.id}>
                  {(draggableProvided) => {
                    return (
                      <SectionLayout
                        pathname={pathname}
                        noPadding={v.type === "slider"}
                        draggableProvided={draggableProvided}
                        section={v}
                        key={`${v.id}`}
                      >
                        {sectionMap[v.type](v)}
                      </SectionLayout>
                    )
                  }}
                </Draggable>
              ))}
              {droppableProvided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      {activeModal?.includes("image") && <ImageSelector />}
      {activeModal?.includes("time") && <TimePicker />}
      {activeModal === "calender" && <DatePicker />}
      {activeModal === "calender-select" && <DateSelector />}
      {activeModal === "select-list" && <SelectList />}
    </>
  )
}

export default EditPage
