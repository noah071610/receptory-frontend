"use client"

import ImageSelector from "@/components/Modal/ImageSelector"
import TimePicker from "@/components/Modal/TimePicker"
import SectionLayout from "@/components/Sections"
import Empty from "@/components/Sections/Empty"
import Thumbnail from "@/components/Sections/Thumbnail"
import { useEditorStore } from "@/store/editor"
import { SectionListTypes, SectionType } from "@/types/Edit"
import { DragDropContext, Draggable, DropResult, Droppable } from "@hello-pangea/dnd"
import { convertToRaw } from "draft-js"
import dynamic from "next/dynamic"
import { useEffect, useMemo } from "react"

const Callout = dynamic(() => import("@/components/Sections/Callout"), {
  ssr: true,
})
const Album = dynamic(() => import("@/components/Sections/Album"), {
  ssr: true,
})
const Contact = dynamic(() => import("@/components/Sections/Contact"), {
  ssr: true,
})
const Slider = dynamic(() => import("@/components/Sections/Slider"), {
  ssr: true,
})
const Text = dynamic(() => import("@/components/Sections/Text"), {
  ssr: true,
})
const Title = dynamic(() => import("@/components/Sections/Title"), {
  ssr: true,
})
const Map = dynamic(() => import("@/components/Sections/Map"), {
  ssr: true,
})
const QnA = dynamic(() => import("@/components/Sections/QnA"), {
  ssr: true,
})
const Calender = dynamic(() => import("@/components/Sections/Calender"), {
  ssr: true,
})
const Time = dynamic(() => import("@/components/Sections/Time"), {
  ssr: true,
})

const sectionMap: Record<SectionListTypes, (section: SectionType) => any> = {
  album: (section) => <Album section={section} />,
  text: (section) => <Text section={section} />,
  title: (section) => <Title section={section} />,
  contact: (section) => <Contact section={section} />,
  callout: (section) => <Callout section={section} />,
  slider: (section) => <Slider section={section} />,
  map: (section) => <Map section={section} />,
  qna: (section) => <QnA section={section} />,
  calender: () => <></>,
  thumbnail: () => <></>,
  time: (section) => <Time section={section} />,
  list: () => <></>,
  empty: () => <Empty />,
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
  const { initSections, isEditStart, stage, formSections, moveSection, active, loadSections } = useEditorStore()

  const onDragEnd = (result: DropResult) => {
    const { destination, source } = result

    if (!destination || typeof destination.index !== "number") return

    moveSection({ from: source.index, to: destination.index })
  }

  useEffect(() => {
    if (!isEditStart) return
    const handleBeforeUnloadCallback = (e: any) => {
      handleBeforeUnload({ initSections }, e)
    }
    window.addEventListener("beforeunload", handleBeforeUnloadCallback)

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnloadCallback)
    }
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

  return (
    <>
      {sections?.length > 0 && (
        <SectionLayout section={sections[0]}>
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
        <Droppable droppableId="section-drop-zone">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              <div>
                {sections.slice(1).map((v, i) => (
                  <Draggable index={i + 1} key={v.id} draggableId={v.id}>
                    {(draggableProvided) => {
                      return (
                        <SectionLayout draggableProvided={draggableProvided} section={v} key={`${v.id}`}>
                          {sectionMap[v.type](v)}
                        </SectionLayout>
                      )
                    }}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            </div>
          )}
        </Droppable>
      </DragDropContext>
      {(active.modal === "slide" || active.modal === "album") && <ImageSelector />}
      {active.modal?.includes("time") && <TimePicker />}
    </>
  )
}

export default EditPage
