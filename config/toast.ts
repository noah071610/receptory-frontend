import { toast } from "sonner"

const option: any = {
  className: "toast-error",
  position: "top-center",
  duration: 5000,
}
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

export const toastSuccess = (key: string) => toast.success(key, option)
