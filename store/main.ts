import { SectionType } from "@/types/Edit"
import { Langs, ModalActiveType, SelectedType, SelectedValueType } from "@/types/Main"
import { UserType } from "@/types/User"
import { create } from "zustand"

import { immer } from "zustand/middleware/immer"
import { useShallow } from "zustand/react/shallow"

export interface EditStates {
  user: UserType | null
  modal: {
    type: ModalActiveType
    section: SectionType | null
    payload?: any
  }
  selected: SelectedType[]
  curConfirmationId: string | null
  confirmDate: string | null
  pageLang: Langs
}

type Actions = {
  setUser: ({ user }: { user: UserType | null }) => void
  setPageLang: (lang: Langs) => void
  setModal: ({ section, type, payload }: { section: SectionType | null; type: ModalActiveType; payload?: any }) => void
  setSelected: ({ section, value }: { section: SectionType; value: SelectedValueType[] }) => void
  loadSelected: (data: SelectedType[]) => void
  setSelectedText: ({ section, text }: { section: SectionType; text: string }) => void
  clearPage: () => void
  setConfirmation: ({
    curConfirmationId,
    confirmDate,
  }: {
    curConfirmationId: string | null
    confirmDate: string | null
  }) => void
}

export const _useMainStore = create<EditStates & Actions>()(
  immer((set) => ({
    user: null,
    modal: {
      type: null,
      section: null,
      payload: null,
    },
    selected: [],
    curConfirmationId: null,
    confirmDate: null,
    pageLang: "ko",

    // SET
    setUser: ({ user }) =>
      set((origin) => {
        origin.user = user
      }),
    setPageLang: (lang) =>
      set((origin) => {
        origin.pageLang = lang
      }),
    setConfirmation: ({ confirmDate, curConfirmationId }) =>
      set((origin) => {
        origin.curConfirmationId = curConfirmationId
        origin.confirmDate = confirmDate
      }),
    setModal: (payload) =>
      set((origin) => {
        origin.modal = payload
      }),
    setSelected: ({ section, value }) =>
      set((origin) => {
        // index에 마이너스인 이유??? 썸네일 때문에
        origin.selected[section.index - 1] = {
          id: section.id,
          title: section.data.title,
          type: section.type,
          value,
        }
      }),
    clearPage: () =>
      set((origin) => {
        origin.selected = []
        origin.curConfirmationId = null
        origin.confirmDate = null
      }),
    loadSelected: (data) =>
      set((origin) => {
        origin.selected = data
      }),
    setSelectedText: ({ section, text }) =>
      set((origin) => {
        // index에 마이너스인 이유??? 썸네일 때문에
        if (!origin.selected[section.index - 1]) {
          origin.selected[section.index - 1] = {
            id: section.id,
            title: section.data.title,
            type: section.type,
            value: [{ key: section.type, text: "" }],
          }
        }
        origin.selected[section.index - 1].value[0].text = text
      }),
  }))
)

type CombinedStates = EditStates & Actions
export const useMainStore = <T extends keyof CombinedStates>(keys: T[]) => {
  return _useMainStore(
    useShallow((state) =>
      keys.reduce(
        (acc, cur) => {
          acc[cur] = state[cur]
          return acc
        },
        {} as EditStates & Actions
      )
    )
  )
}
