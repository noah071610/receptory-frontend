import { SectionType } from "@/types/Edit"
import { UserPickType, UserPickValueType } from "@/types/Main"
import { UserType } from "@/types/User"

import { create } from "zustand"
import { immer } from "zustand/middleware/immer"

export interface EditStates {
  user: UserType | null
  modal: {
    type: "date" | "time" | "select" | "dateSelect" | null
    section: SectionType | null
  }
  userPick: {
    [id: string]: UserPickType
  }
}

type Actions = {
  setUser: ({ user }: { user: UserType | null }) => void
  setModal: ({
    section,
    type,
  }: {
    section: SectionType | null
    type: "date" | "time" | "select" | "dateSelect" | null
  }) => void
  setUserPick: ({ section, value }: { section: SectionType; value: UserPickValueType[] }) => void
  setUserPickText: ({ section, text }: { section: SectionType; text: string }) => void
}

export const useMainStore = create<EditStates & Actions>()(
  immer((set) => ({
    user: null,
    modal: {
      type: null,
      section: null,
    },
    userPick: {},

    // SET
    setUser: ({ user }) =>
      set((origin) => {
        origin.user = user
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
