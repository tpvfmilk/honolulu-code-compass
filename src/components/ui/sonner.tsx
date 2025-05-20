
// This file is now using our own toast implementation instead of Sonner
import { useToast } from "@/hooks/use-toast"
import { Toaster as CustomToaster } from "@/components/ui/toaster"
import { toast } from "@/hooks/use-toast"

type ToasterProps = React.ComponentProps<typeof CustomToaster>

const Toaster = (props: ToasterProps) => {
  return <CustomToaster {...props} />
}

export { Toaster, toast }
