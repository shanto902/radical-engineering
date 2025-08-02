"use client";
import React from "react";
import { useSelector } from "react-redux";
import { ReactGoogleReviews } from "react-google-reviews";
import { RootState } from "@/store";

import "react-google-reviews/dist/index.css";
import PaddingContainer from "../common/PaddingContainer";

const GoogleReviewBlock = () => {
  const theme = useSelector((state: RootState) => state.theme.mode);

  return (
    <PaddingContainer className="py-10">
      <h2 className="text-2xl md:text-3xl font-bold mb-8">
        {"What Our Customers Say"}
      </h2>
      <ReactGoogleReviews
        layout="carousel"
        brandName="Radical Engineering"
        theme={` ${theme === "dark" ? "dark" : "light"}` as "dark"}
        showDots={false}
        carouselBtnIconStyle={{
          color: theme === "dark" ? "#fff" : "#000",
        }}
        carouselBtnStyle={{
          backgroundColor: theme === "dark" ? "#333" : "#f0f0f0",
          borderRadius: "50%",
          width: "30px",
          height: "30px",
        }}
        logoVariant="icon"
        loaderSpinnerStyle={{
          display: "none",
        }}
        productDescription="Radical Engineering is a leading provider of solar panels, batteries, inverters, and accessories in Bangladesh. We are committed to delivering high-quality products at competitive prices with fast delivery and reliable warranty support."
        nameDisplay="fullNames"
        hideEmptyReviews={true}
        carouselSpeed={4000}
        dateDisplay="relative"
        featurableId={`8f46be43-b855-4151-b5d7-4b4cc943d027`}
      />
    </PaddingContainer>
  );
};

export default GoogleReviewBlock;
