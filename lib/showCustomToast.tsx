// lib/toast/showCustomToast.ts
import { toast } from "react-hot-toast";
import { LucideIcon } from "lucide-react";

interface ShowCustomToastProps {
  icon: LucideIcon;
  message: string;
  id: string;
  duration?: number;

  iconClass?: string;
}

export const showCustomToast = ({
  icon: Icon,
  message,
  id,
  duration = 5000,
  iconClass = "text-primary",
}: ShowCustomToastProps) => {
  toast.custom(
    (t) => (
      <div
        className={`${
          t.visible ? "animate-enter" : "animate-leave"
        } w-fit backdrop-blur-2xl text-foreground shadow-xl rounded-xl pointer-events-auto flex ring-1 ring-primary`}
      >
        <div className="p-4 flex items-center gap-3">
          <Icon className={`w-5 h-5 ${iconClass} animate-bounce`} />
          <p className="text-sm w-fit text-center font-semibold">{message}</p>
        </div>
      </div>
    ),
    { id, duration }
  );
};
