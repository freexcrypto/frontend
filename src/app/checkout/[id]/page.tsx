import Information from "@/components/layouts/checkout/Information";
import Transaction from "@/components/layouts/checkout/Transaction";
import React from "react";

export default async function page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <main className="grid grid-cols-1 md:grid-cols-2 max-w-7xl mx-auto place-content-center min-h-screen p-5">
      <div className="col-span-1">
        <Information id={id} />
      </div>
      <div className="col-span-1">
        <Transaction id={id} />
      </div>
    </main>
  );
}
