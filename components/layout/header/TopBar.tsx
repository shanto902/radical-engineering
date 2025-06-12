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
                      href={`tel:+88${number.number}`}
                      className="font-bold hover:text-primary hover:underline"
                    >
                      {number.number}
                    </a>
                  </span>
                ))}
            </span>
          </p>
          <div className="space-x-2">
            <Link
              href={"/order-tracker"}
              className="w-fit  px-4  hover:underline underline-offset-4 text-xs font-bold py-2 rounded-lg transition"
            >
              Track Order
            </Link>
            <Link
              href={"/builder"}
              className="w-fit  bg-primary hover:bg-secondary px-4  text-background hover:text-foreground text-xs font-bold py-2 rounded-lg transition"
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
