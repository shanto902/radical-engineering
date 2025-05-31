import PaddingContainer from "@/components/common/PaddingContainer";
import { TSettings } from "@/interfaces";

const TopBar = ({ settings }: { settings: TSettings }) => {
  return (
    <div className="hidden md:block w-full h-12 bg-background ">
      <PaddingContainer className="flex  h-full">
        <div className=" w-full  flex justify-end items-center h-full">
          <p className=" text-sm hover:text-primary hover:underline">
            <span className="font-normal ">Hotline :</span>{" "}
            <a href={`tel:+88${settings.phone}`} className="font-bold">
              {settings.phone}
            </a>
          </p>
        </div>
      </PaddingContainer>
    </div>
  );
};

export default TopBar;
