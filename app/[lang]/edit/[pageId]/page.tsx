"use client"

import ImageSelector from "@/components/Modal/ImageSelector"
import SelectList from "@/components/Modal/SelectList"
import TimePicker from "@/components/Modal/TimePicker"
import Calender from "@/components/Sections/Calender"
import Empty from "@/components/Sections/Empty"
import Thumbnail from "@/components/Sections/Thumbnail"
import SectionLayout from "@/components/Sections/index"
import style from "@/containers/edit-page/style.module.scss"
import { useEditorStore } from "@/store/editor"
import { SectionListTypes, SectionType } from "@/types/Edit"
import { DragDropContext, Draggable, DropResult, Droppable } from "@hello-pangea/dnd"
import classNames from "classNames"
import { convertToRaw } from "draft-js"
import dynamic from "next/dynamic"
import { useEffect, useMemo } from "react"
const cx = classNames.bind(style)

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

const handleBeforeUnload = async ({ initSections }: any, event?: any) => {
  if (process.env.NODE_ENV === "development") {
    localStorage.setItem(
      "save",
      JSON.stringify({
        initSections: initSections.map((v: SectionType) => {
          switch (v.type) {
            case "callout":
              return { ...v, text: JSON.stringify(convertToRaw(v.text.getCurrentContent())) }
            case "text":
              return { ...v, text: JSON.stringify(convertToRaw(v.text.getCurrentContent())) }
            case "qna":
              return {
                ...v,
                list: v.list.map((k) => ({ ...k, text: JSON.stringify(convertToRaw(k.text.getCurrentContent())) })),
              }

            default:
              return v
          }
        }),
      })
    )
  } else {
    // await savePost(data)
  }
  if (event) {
    event.returnValue = "Are you sure you want to leave?"
  }
}

const EditPage = () => {
  const { initSections, isEditStart, stage, formSections, moveSection, active, loadSections, selectedSection } =
    useEditorStore()

  const onDragEnd = (result: DropResult) => {
    const { destination, source } = result

    if (!destination || typeof destination.index !== "number") return

    moveSection({ from: source.index, to: destination.index })
  }

  useEffect(() => {
    if (!isEditStart) return
    // const handleBeforeUnloadCallback = (e: any) => {
    //   handleBeforeUnload({ initSections }, e)
    // }
    // window.addEventListener("beforeunload", handleBeforeUnloadCallback)

    // return () => {
    //   window.removeEventListener("beforeunload", handleBeforeUnloadCallback)
    // }
  }, [initSections, isEditStart])

  useEffect(() => {
    const _save = localStorage.getItem("save")

    if (_save) {
      const save = JSON.parse(_save ?? "{}")
      // loadSections(save)
    }
  }, [])

  const sections = useMemo(
    () => (stage === "init" ? initSections : stage === "form" ? formSections : []),
    [initSections, formSections, stage]
  )

  const activeModal = active.modal.type

  return (
    <>
      {sections?.length > 0 && (
        <SectionLayout noPadding={sections[0].type === "thumbnail"} section={sections[0]}>
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
      {activeModal === "select-list" && <SelectList />}
    </>
  )
}

export default EditPage
