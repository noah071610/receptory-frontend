"use client"

import SectionLayout from "@/components/Sections"
import Contact from "@/components/Sections/Contact"
import Text from "@/components/Sections/Text"
import Thumbnail from "@/components/Sections/Thumbnail"
import style from "@/containers/edit-page/style.module.scss"
import { useEditStore } from "@/store/edit"
import { SectionType } from "@/types/Edit"
import { DragDropContext, Draggable, DropResult, Droppable } from "@hello-pangea/dnd"
import classNames from "classNames"
const cx = classNames.bind(style)

const getSection = (section: SectionType) => {
  switch (section.type) {
    case "text":
      return <Text section={section} />
    case "contact":
      return <Contact section={section} />
    default:
      return <></>
  }
}

const EditPage = () => {
  const { sections, moveSection, setSelectedSection, selectedSection } = useEditStore()

  const onDragEnd = (result: DropResult) => {
    const { destination, source } = result

    if (!destination || typeof destination.index !== "number") return

    moveSection({ from: source.index, to: destination.index })
  }

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
                  <Draggable index={i} key={v.id} draggableId={v.id}>
                    {(draggableProvided) => {
                      return (
                        <SectionLayout draggableProvided={draggableProvided} section={v} key={`${v.id}`}>
                          {getSection(v)}
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
    </>
  )
}

export default EditPage
