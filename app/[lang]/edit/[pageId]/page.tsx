"use client"

import ImageSelector from "@/components/Modal/ImageSelector"
import SectionLayout from "@/components/Sections"
import Empty from "@/components/Sections/Empty"
import Thumbnail from "@/components/Sections/Thumbnail"
import { useEditStore } from "@/store/edit"
import { SectionListTypes, SectionType } from "@/types/Edit"
import { DragDropContext, Draggable, DropResult, Droppable } from "@hello-pangea/dnd"
import dynamic from "next/dynamic"
import { useMemo } from "react"

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

const sectionMap: Record<SectionListTypes, (section: SectionType) => any> = {
  album: (section) => <Album section={section} />,
  text: (section) => <Text section={section} />,
  title: (section) => <Title section={section} />,
  contact: (section) => <Contact section={section} />,
  callout: (section) => <Callout section={section} />,
  slider: (section) => <Slider section={section} />,
  map: (section) => <Map section={section} />,
  qna: (section) => <QnA section={section} />,
  thumbnail: () => <></>,
  empty: () => <Empty />,
}

const EditPage = () => {
  const { sections, moveSection, active } = useEditStore()

  const onDragEnd = (result: DropResult) => {
    const { destination, source } = result

    if (!destination || typeof destination.index !== "number") return

    moveSection({ from: source.index, to: destination.index })
  }

  const openImageSelector = useMemo(
    () => (active.modal ?? active.sectionModal) === "album" || (active.modal ?? active.sectionModal) === "slider",
    [active]
  )

  return (
    <>
      {sections?.length > 0 && (
        <SectionLayout section={sections[0]}>
          <Thumbnail section={sections[0]} />
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
      {openImageSelector && <ImageSelector />}
    </>
  )
}

export default EditPage
