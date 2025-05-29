import InvoicePage from "@/components/pages/invoice/InvoicePage";
import React, { Suspense } from "react";

const page = () => {
  return (
    <Suspense>
      <InvoicePage />
    </Suspense>
  );
};

export default page;
