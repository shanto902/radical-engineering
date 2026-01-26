import { LoadingFallback } from "@/components/common/LoadingFallback";
import OrderTrackerPage from "@/components/pages/OrderTrackerPage";
import React, { Suspense } from "react";

const page = () => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <OrderTrackerPage />
    </Suspense>
  );
};

export default page;
