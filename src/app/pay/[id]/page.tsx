import Information from "@/components/layouts/pay/Information";
import Payment from "@/components/layouts/pay/Payment";
// import Transaction from "@/components/layouts/pay/Transaction";
import React from "react";

export default async function page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <main className="grid grid-cols-1 md:grid-cols-2 min-h-screen max-w-7xl mx-auto place-content-center">
      <div className="col-span-1">
        <Information id={id} />
      </div>
      {/* <div className="col-span-1">
        <Transaction id={id} />
      </div> */}
      <div>
        <Payment id={id} />
      </div>
    </main>
  );
}
