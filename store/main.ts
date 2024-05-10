import { SectionListTypes, SectionType } from "@/types/Edit"
import { UserType } from "@/types/User"

import { create } from "zustand"
import { immer } from "zustand/middleware/immer"

export interface EditStates {
  user: UserType | null
  modal: {
    type: "date" | "time" | "select" | "dateSelect" | null
    section: SectionType | null
  }
  date: {
    selectedStartDate: Date | null | "anyDate"
    selectedEndDate: Date | null
  }
  time: {
    selectedStartTime: string | null | "anytime"
    selectedEndTime: string | null
  }
  userPick: {
    [id: string]: {
      type: SectionListTypes
      data: any
    }
  }
}

type Actions = {
  setUser: ({ user }: { user: UserType | null }) => void
  setModal: ({ section, type }: { section: SectionType | null; type: "date" | "time" | "select" | null }) => void
  setDate: ({
    payload,
  }: {
    payload: {
      selectedStartDate: Date | null | "anyDate"
      selectedEndDate: Date | null
    }
  }) => void
  setTime: ({
    payload,
  }: {
    payload: {
      selectedStartTime: string | null | "anytime"
      selectedEndTime: string | null
    }
  }) => void
  setUserPick: ({ section, payload }: { section: SectionType; payload: any }) => void
}

export const useMainStore = create<EditStates & Actions>()(
  immer((set) => ({
    user: null,
    modal: {
      type: null,
      section: null,
    },
    date: {
      selectedStartDate: null,
      selectedEndDate: null,
    },
    time: {
      selectedStartTime: null,
      selectedEndTime: null,
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
    setDate: ({ payload }) =>
      set((origin) => {
        origin.date = payload
      }),
    setTime: ({ payload }) =>
      set((origin) => {
        origin.time = payload
      }),
    setUserPick: ({ section, payload }) =>
      set((origin) => {
        origin.userPick[section.id] = {
          type: section.type,
          data: payload,
        }
      }),
  }))
)
