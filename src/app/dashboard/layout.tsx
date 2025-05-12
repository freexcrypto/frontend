import React from "react";
import Header from "@/components/layouts/dashboard/header";
import { StickyBanner } from "@/components/ui/sticky-banner";

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="m-5 xl:mx-20 2xl:mx-40 space-y-5 relative">
      <StickyBanner
        className="bg-gradient-to-b from-blue-500 to-blue-600"
        hideOnScroll={true}
      >
        <p className="mx-0 max-w-[90%] text-white drop-shadow-md">
          You are currently in testnet mode using the Lisk Sepolia Network. All
          transactions and operations are for testing purposes only.
        </p>
      </StickyBanner>
      <Header />
      {children}
    </div>
  );
}
