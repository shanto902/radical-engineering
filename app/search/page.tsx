import { LoadingFallback } from "@/components/common/LoadingFallback";
import SearchPage from "@/components/pages/SearchPage";
import React, { Suspense } from "react";

const page = () => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <SearchPage />
    </Suspense>
  );
};

export default page;
