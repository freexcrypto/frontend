import React from "react";
import Header from "@/components/layouts/dashboard/header";
import TestnetBanner from "@/components/layouts/dashboard/TestnetBanner";
export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="m-5 xl:mx-20 2xl:mx-40 space-y-5 relative">
      <TestnetBanner />
      <Header />
      {children}
    </div>
  );
}
