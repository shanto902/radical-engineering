"use client";

import { X, PhoneCall } from "lucide-react";
import React, { useEffect, useState } from "react";

interface CallForPriceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CallForPriceModal: React.FC<CallForPriceModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [phoneNumbers, setPhoneNumbers] = useState<{ number: string }[] | null>(
    null
  );

  useEffect(() => {
    if (isOpen && !phoneNumbers) {
      const fetchSettings = async () => {
        try {
          const res = await fetch("/api/settings");
          const data = await res.json();
          if (data && data.phone_numbers) {
            setPhoneNumbers(data.phone_numbers);
          }
        } catch (error) {
          console.error("Failed to fetch settings", error);
        }
      };
      fetchSettings();
    }
  }, [isOpen, phoneNumbers]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="bg-background border border-foreground/10 rounded-2xl p-6 w-full max-w-sm shadow-xl relative animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-full text-foreground/60 hover:text-foreground hover:bg-muted transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col items-center text-center mt-2">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 text-primary">
            <PhoneCall className="w-8 h-8" />
          </div>

          <h2 className="text-2xl font-bold mb-2">Contact for Price</h2>
          <p className="text-foreground/70 mb-6">
            Contact us to get the best price for this product.
          </p>

          <div className="bg-muted w-full py-4 rounded-xl mb-6">
            <span className="text-sm font-medium text-foreground/60 block mb-4">
              Available Phone Numbers
            </span>
            {phoneNumbers ? (
              <div className="flex flex-col gap-3">
                {phoneNumbers.map((numObj, index) => (
                  <a
                    key={index}
                    href={`tel:${numObj.number}`}
                    className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-secondary text-background hover:text-foreground py-3 px-4 rounded-xl font-bold transition-colors"
                  >
                    <PhoneCall className="w-5 h-5" />
                    {numObj.number}
                  </a>
                ))}
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <div className="animate-pulse h-12 bg-primary/20 w-full rounded-xl" />
                <div className="animate-pulse h-12 bg-primary/20 w-full rounded-xl" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CallForPriceModal;
