import Information from "@/components/layouts/pay/Information";
import Transaction from "@/components/layouts/pay/Transaction";
import React from "react";

export default async function page({ params }: { params: { id: string } }) {
  const { id } = await params;
  return (
    <main className="grid grid-cols-1 md:grid-cols-2 max-w-7xl mx-auto">
      <div className="col-span-1">
        <Information id={id} />
      </div>
      <div className="col-span-1">
        <Transaction id={id} />
      </div>
    </main>
  );
}
