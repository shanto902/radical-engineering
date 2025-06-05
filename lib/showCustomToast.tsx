import { toast } from "react-hot-toast";
import { Toast } from "@capacitor/toast";
import { Haptics, ImpactStyle } from "@capacitor/haptics";
import { LucideIcon } from "lucide-react";
import { isNativeApp } from "@/components/common/isNativeApp";

interface ShowCustomToastProps {
  icon: LucideIcon;
  message: string;
  id: string;
  duration?: number;
}

export const showCustomToast = async ({
  icon: Icon,
  message,
  id,
  duration = 2000,
}: ShowCustomToastProps) => {
  if (isNativeApp()) {
    // Trigger light haptic feedback
    await Haptics.impact({ style: ImpactStyle.Light });

    // Show native toast
    await Toast.show({
      text: message,
      duration: "short",
    });
  } else {
    // Web toast fallback
    toast.custom(
      (t) => (
        <div
          className={`${
            t.visible ? "animate-enter" : "animate-leave"
          } w-fit border-primary backdrop-blur-2xl border bg-primary text-background shadow-xl rounded-xl pointer-events-auto flex`}
        >
          <div className="p-4 flex items-center gap-3">
            <Icon className="w-5 h-5 text-background animate-bounce" />
            <p className="text-sm w-fit text-center font-semibold">{message}</p>
          </div>
        </div>
      ),
      { id, duration }
    );
  }
};
