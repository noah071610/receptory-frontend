import { create } from "zustand"
import { immer } from "zustand/middleware/immer"

export interface EditStates {
  isFilterUpdate: boolean
  curFilter: {
    type: string
    startQuery: string
    endQuery: string
  }
}

type Actions = {
  setCurFilter: ({ key, payload }: { key: "type" | "startQuery" | "endQuery"; payload: string }) => void
  setCurFilterAll: (data: { type: string; startQuery: string; endQuery: string }) => void
  setIsFilterUpdate: (b: boolean) => void
}

export const useInsightStore = create<EditStates & Actions>()(
  immer((set) => ({
    isFilterUpdate: false,
    curFilter: {
      type: "none",
      startQuery: "",
      endQuery: "",
    },

    // SET
    setCurFilter: ({ key, payload }) =>
      set((origin) => {
        origin.curFilter[key] = payload
      }),
    setCurFilterAll: (data) =>
      set((origin) => {
        origin.curFilter = data
      }),
    setIsFilterUpdate: (b) =>
      set((origin) => {
        origin.isFilterUpdate = b
      }),
  }))
)
