import PaddingContainer from "@/components/common/PaddingContainer";
import { TSettings } from "@/interfaces";
import Link from "next/link";

const TopBar = ({ settings }: { settings: TSettings }) => {
  return (
    <div className="hidden md:block w-full h-12 bg-background ">
      <PaddingContainer className="flex  h-full">
        <div className=" w-full  flex justify-between items-center h-full">
          <p className=" text-sm hover:text-primary hover:underline">
            <span className="font-normal ">Hotline :</span>{" "}
            <a href={`tel:+88${settings.phone}`} className="font-bold">
              {settings.phone}
            </a>
          </p>
          <Link
            href={"/builder"}
            className="w-fit  bg-primary hover:bg-secondary px-4  text-background hover:text-foreground text-xs font-bold py-2 rounded-lg transition"
          >
            Solar IPS / IPS Builder
          </Link>
        </div>
      </PaddingContainer>
    </div>
  );
};

export default TopBar;
