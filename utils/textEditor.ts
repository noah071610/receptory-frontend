import { SectionType } from "@/types/Edit"
import { EditorState, convertFromRaw, convertToRaw } from "draft-js"

export const convertStringToEditorState = (v: SectionType): any => {
  return {
    ...v,
    text: EditorState.createWithContent(convertFromRaw(JSON.parse(v.text as any))) as EditorState,
  }
}

export const convertEditorStateToString = (v: SectionType): any => {
  return {
    ...v,
    text: JSON.stringify(convertToRaw(v.text.getCurrentContent())),
  }
}
