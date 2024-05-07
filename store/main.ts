import { UserType } from "@/types/Main"

import { create } from "zustand"
import { immer } from "zustand/middleware/immer"

export interface EditStates {
  user: UserType | null
}

type Actions = {
  setUser: ({ user }: { user: UserType | null }) => void
}

export const useMainStore = create<EditStates & Actions>()(
  immer((set) => ({
    user: null,

    // SET
    setUser: ({ user }) =>
      set((origin) => {
        origin.user = user
      }),
  }))
)
