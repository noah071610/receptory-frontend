import SectionLayout from "@/components/Sections"
import { useEditorStore } from "@/store/editor"
import { EditStage, SectionType } from "@/types/Edit"
import { DragDropContext, Draggable, DropResult, Droppable } from "@hello-pangea/dnd"
import cs from "classNames/bind"
import { usePathname } from "next/navigation"
import { sectionMap } from "../sectionMap"
import style from "./style.module.scss"
const cx = cs.bind(style)

export default function SectionList({
  sections,
  stage,
  type,
}: {
  sections: SectionType[]
  stage: EditStage
  type: "init" | "form" | "rending"
}) {
  const pathname = usePathname()
  const { moveSection } = useEditorStore()

  const onDragEnd = (result: DropResult) => {
    const { destination, source } = result

    if (!destination || typeof destination.index !== "number") return

    moveSection({ from: source.index, to: destination.index })
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="droppable">
        {(droppableProvided) => (
          <div
            className={cx("wrapper", { visible: type === stage, hide: type !== stage })}
            {...droppableProvided.droppableProps}
            ref={droppableProvided.innerRef}
          >
            {sections.slice(stage === "rending" ? 2 : 1).map((v, i) => (
              <Draggable index={i + (stage === "rending" ? 2 : 1)} key={v.id} draggableId={v.id}>
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
  )
}
