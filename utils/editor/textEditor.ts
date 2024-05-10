import { SectionType } from "@/types/Edit"
import { EditorState, convertFromRaw } from "draft-js"

export const convertStringToEditorState = (v: SectionType): any => {
  const a = EditorState.createWithContent(convertFromRaw(JSON.parse(v.text as any)))
  return {
    ...v,
    text: EditorState.createWithContent(convertFromRaw(JSON.parse(v.text as any))),
  }
}

// export const convertEditorStateToString = (v: SectionType): any => {
//   return {
//     ...v,
//     text: JSON.stringify(convertToRaw(v.text.getCurrentContent())),
//   }
// }
