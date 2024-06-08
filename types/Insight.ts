import { PageType } from "./Page"

export interface SelectChartLabel {
  id: string
  title: string
  description?: string
  src?: string
  count: number
}

export interface SelectChartType {
  title: string
  labels: SelectChartLabel[]
}

export interface DateAnalyserType {
  [yearMonth: string]: number[]
}
export interface SelectAnalyserType {
  [sectionId: string]: {
    [itemKey: string]: number
  }
}
export interface TimeAnalyserType {
  AM: number[]
  PM: number[]
}

export interface AnalyserType {
  submit: DateAnalyserType
  calendar: DateAnalyserType
  time: TimeAnalyserType
  select: SelectAnalyserType
  choices: SelectAnalyserType
}

export interface AnalyserConfirmation {
  confirmId: string
  content: string
  createdAt: Date
  isConfirm: number
}

export interface InsightPageType extends PageType {
  confirmation: any[]
  analyser: AnalyserType
}
