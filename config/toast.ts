import i18next from "@/i18n/init"
import { toast } from "sonner"

export function t(value: string) {
  return i18next.t(value, {
    ns: ["messages"],
  })
}

export const toastError = (key: string) =>
  toast.error(t(`error.${key}`), {
    className: "toast-error",
    position: "top-center",
    duration: 3000,
    cancel: {
      label: "OK",
      onClick: () => {},
    },
  })

export const toastSuccess = (key: string) =>
  toast.success(t(`success.${key}`), {
    className: "toast-success",
    position: "top-center",
    duration: 3000,
    cancel: {
      label: "OK",
      onClick: () => {},
    },
  })
