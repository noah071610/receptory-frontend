import { create } from "zustand"
import { immer } from "zustand/middleware/immer"
import { useShallow } from "zustand/react/shallow"

export interface EditStates {
  isFilterUpdate: boolean
  curFilter: {
    type: string
    startQuery: string
    endQuery: string
  }
  curSort: {
    orderby: string
    sort: string
  }
  searchInput: string
}

type Actions = {
  setCurFilter: ({ key, payload }: { key: "type" | "startQuery" | "endQuery"; payload: string }) => void
  setCurSort: ({ key, payload }: { key: "sort" | "orderby"; payload: string }) => void
  setCurFilterAll: (data: { type: string; startQuery: string; endQuery: string }) => void
  setCurSortAll: (data: { sort: string; orderby: string }) => void
  setSearchInput: (str: string) => void
  setIsFilterUpdate: (b: boolean) => void
}

export const _useInsightStore = create<EditStates & Actions>()(
  immer((set) => ({
    isFilterUpdate: false,
    curFilter: {
      type: "none",
      startQuery: "",
      endQuery: "",
    },
    curSort: {
      sort: "createdAt",
      orderby: "desc",
    },
    searchInput: "",

    // SET
    setCurFilter: ({ key, payload }) =>
      set((origin) => {
        origin.curFilter[key] = payload
      }),
    setCurSort: ({ key, payload }) =>
      set((origin) => {
        origin.curSort[key] = payload
      }),
    setSearchInput: (str) =>
      set((origin) => {
        origin.searchInput = str
      }),
    setCurFilterAll: (data) =>
      set((origin) => {
        origin.curFilter = data
      }),
    setCurSortAll: (data) =>
      set((origin) => {
        origin.curSort = data
      }),
    setIsFilterUpdate: (b) =>
      set((origin) => {
        origin.isFilterUpdate = b
      }),
  }))
)

type CombinedStates = EditStates & Actions
export const useInsightStore = <T extends keyof CombinedStates>(keys: T[]) => {
  return _useInsightStore(
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
