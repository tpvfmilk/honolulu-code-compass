
import { Toast, ToastActionElement, ToastProps } from "@/components/ui/toast"

type ToastActionProps = React.ComponentPropsWithoutRef<typeof ToastActionElement>

export type ToastFunction = {
  (props: ToastProps): void
  dismiss: (toastId?: string) => void
  update: (id: string, props: ToastProps) => void
}

export const useToast = () => {
  // This is a proxy to the actual implementation
  // We're only adding types here
  return { toast: window.toast as ToastFunction };
}

export { toast } from "@/components/ui/use-toast"
