import PaddingContainer from "@/components/common/PaddingContainer";
import { TSettings } from "@/interfaces";
import { Mail, Phone, MapPin } from "lucide-react";

const PortalTopbar = ({ settings }: { settings: TSettings }) => {
  return (
    <div className="w-full bg-primary text-background text-xs md:text-sm py-2">
      <PaddingContainer className="flex flex-col md:flex-row items-center justify-between gap-2">
        <div className="flex flex-wrap justify-center md:justify-start items-center gap-4">
          {settings.phone_numbers && settings.phone_numbers.length > 0 && (
            <a
              href={`tel:${settings.phone_numbers[0].number}`}
              className="flex items-center gap-2 hover:underline"
            >
              <Phone size={14} />
              <span>{settings.phone_numbers[0].number}</span>
            </a>
          )}
          {settings.email && (
            <a
              href={`mailto:${settings.email}`}
              className="flex items-center gap-2 hover:underline"
            >
              <Mail size={14} />
              <span>{settings.email}</span>
            </a>
          )}
        </div>
        <div className="hidden md:flex items-center gap-4">
          {settings.address && (
            <div className="flex items-center gap-2">
              <MapPin size={14} />
              <span>{settings.address}</span>
            </div>
          )}
        </div>
      </PaddingContainer>
    </div>
  );
};

export default PortalTopbar;
