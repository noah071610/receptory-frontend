import { SectionType } from "@/types/Edit"
import { Langs, ModalActiveType, UserPickType, UserPickValueType } from "@/types/Main"
import { UserType } from "@/types/User"

import { create } from "zustand"
import { immer } from "zustand/middleware/immer"

export interface EditStates {
  user: UserType | null
  modal: {
    type: ModalActiveType
    section: SectionType | null
    payload?: any
  }
  userPick: {
    [id: string]: UserPickType
  }
  curConfirmationId: string | null
  confirmDate: string | null
  pageLang: Langs | null
}

type Actions = {
  setUser: ({ user }: { user: UserType | null }) => void
  setPageLang: (lang: Langs) => void
  setModal: ({ section, type, payload }: { section: SectionType | null; type: ModalActiveType; payload?: any }) => void
  setUserPick: ({ section, value }: { section: SectionType; value: UserPickValueType[] }) => void
  loadUserPick: (data: { [id: string]: UserPickType }) => void
  setUserPickText: ({ section, text }: { section: SectionType; text: string }) => void
  setConfirmation: ({
    curConfirmationId,
    confirmDate,
  }: {
    curConfirmationId: string | null
    confirmDate: string | null
  }) => void
}

export const useMainStore = create<EditStates & Actions>()(
  immer((set) => ({
    user: null,
    modal: {
      type: null,
      section: null,
      payload: null,
    },
    userPick: {},
    curConfirmationId: null,
    confirmDate: null,
    pageLang: null,

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
    setUserPick: ({ section, value }) =>
      set((origin) => {
        origin.userPick[section.id] = {
          title: section.data.title as string,
          value,
          index: section.index,
          type: section.type,
        }
      }),
    loadUserPick: (data) =>
      set((origin) => {
        origin.userPick = data
      }),
    setUserPickText: ({ section, text }) =>
      set((origin) => {
        if (!origin.userPick[section.id]) {
          origin.userPick[section.id] = {
            title: section.data.title as string,
            value: [{ key: section.type, text: "" }],
            index: section.index,
            type: section.type,
          }
        }
        origin.userPick[section.id].value[0].text = text
      }),
  }))
)
