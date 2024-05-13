import { toast } from "sonner"

export const toastError = (key: string) =>
  toast.error(key, {
    className: "toast-error",
    position: "top-center",
    duration: 3000,
    cancel: {
      label: "OK",
      onClick: () => {},
    },
  })

export const toastSuccess = (key: string) =>
  toast.success(key, {
    className: "toast-success",
    position: "top-center",
    duration: 3000,
    cancel: {
      label: "OK",
      onClick: () => {},
    },
  })
