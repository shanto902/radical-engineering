import { Heart } from "lucide-react";

export default function NoticeBar() {
  return (
    <div className="w-full bg-yellow-100 border-b my-5 border-yellow-300 text-yellow-900 flex gap-2 justify-center items-center text-sm text-center py-2 px-4 ">
      🚧 Our shop is still in development. You may experience limited
      functionality. Thank you <Heart />
    </div>
  );
}
