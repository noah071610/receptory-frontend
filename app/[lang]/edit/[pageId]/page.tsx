"use client"

import SectionLayout from "@/containers/edit-page/Sections"
import Text from "@/containers/edit-page/Sections/Text"
import style from "@/containers/edit-page/style.module.scss"
import { useEditStore } from "@/store/edit"
import { SectionType } from "@/types/Edit"
import { DragDropContext, Draggable, DropResult, Droppable } from "@hello-pangea/dnd"
import classNames from "classNames"
const cx = classNames.bind(style)

const getSection = (section: SectionType) => {
  switch (section.type) {
    case "text":
      return <Text id={section.id} />
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
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="section-drop-zone">
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            <div>
              {sections.map((v, i) => (
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
  )
}

export default EditPage
