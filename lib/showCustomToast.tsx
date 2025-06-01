// lib/toast/showCustomToast.ts
import { toast } from "react-hot-toast";
import { LucideIcon } from "lucide-react";

interface ShowCustomToastProps {
  icon: LucideIcon;
  message: string;
  id: string;
  duration?: number;
}

export const showCustomToast = ({
  icon: Icon,
  message,
  id,
  duration = 2000,
}: ShowCustomToastProps) => {
  toast.custom(
    (t) => (
      <div
        className={`${
          t.visible ? "animate-enter" : "animate-leave"
        } w-fit border-primary backdrop-blur-2xl border bg-primary text-background shadow-xl rounded-xl pointer-events-auto flex`}
      >
        <div className="p-4 flex items-center gap-3">
          <Icon className={`w-5 h-5 text-background animate-bounce`} />
          <p className="text-sm w-fit text-center font-semibold">{message}</p>
        </div>
      </div>
    ),
    { id, duration }
  );
};
