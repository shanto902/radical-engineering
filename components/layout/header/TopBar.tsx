import PaddingContainer from "@/components/common/PaddingContainer";
import { TSettings } from "@/interfaces";
import Link from "next/link";

const TopBar = ({ settings }: { settings: TSettings }) => {
  return (
    <div className="hidden md:block w-full h-12 bg-background ">
      <PaddingContainer className="flex  h-full">
        <div className=" w-full  flex justify-between items-center h-full">
          <p className=" text-sm  flex items-center gap-2">
            <span className="font-normal ">Hotline :</span>{" "}
            <span className="flex flex-wrap">
              {settings.phone_numbers &&
                settings.phone_numbers.map((number, i) => (
                  <span key={i} className="flex  items-center gap-1">
                    {i > 0 && <span>,</span>}
                    <a
                      href={`tel:${number.number}`}
                      className="font-bold hover:text-primary hover:underline"
                    >
                      {number.number}
                    </a>
                  </span>
                ))}
            </span>
          </p>
          <div className="flex items-center gap-4">
            <Link
              href={"/order-tracker"}
              className="text-foreground/80 hover:text-primary text-xs font-semibold transition-colors"
            >
              Track Order
            </Link>
            <span className="h-3.5 w-px bg-foreground/10" />
            <Link
              href={"/solar-roof-planer"}
              className="bg-primary hover:bg-primary/95 text-background px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm"
            >
              Solar Roof Planner
            </Link>
            <Link
              href={"/builder"}
              className="bg-primary hover:bg-primary/95 text-background px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm"
            >
              Solar IPS / IPS Builder
            </Link>
          </div>
        </div>
      </PaddingContainer>
    </div>
  );
};

export default TopBar;
