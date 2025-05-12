import React from "react";
import Header from "@/components/layouts/dashboard/header";

export default function layout({ children }: { children: React.ReactNode }) {
  
  return (
    <div className="m-5 xl:mx-20 2xl:mx-40 space-y-5">
      <Header />
      {children}
    </div>
  );
}
