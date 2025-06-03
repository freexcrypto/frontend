"use client";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { NumberTicker } from "@/components/magicui/number-ticker";
import useGetBalance from "@/hooks/getBalance";
import { formatUnits } from "viem";
import useGetBusinessByUser from "@/hooks/getBusinessbyUser";
import useGetRecentPayment from "@/hooks/getRecentPayment";
import useGetCompanyBalance from "@/hooks/getCompanyBalance";
import useGetOrderbyBusinessId from "@/hooks/getOrderbyBusinessId";
export default function BalanceUser() {
  const { business } = useGetBusinessByUser();
  const { paymentLinks } = useGetRecentPayment(business?.id);
  const { balanceUSDC: companyBalanceUSDC } = useGetCompanyBalance(
    business?.address_wallet
  );

  const { order } = useGetOrderbyBusinessId(business?.id);

  const totalOrder = Array.isArray(order)
    ? order
        .filter((p) => p.status_message === "paid")
        .reduce((sum, p) => sum + Number(p.total_price), 0)
    : 0;

  const totalPayment = paymentLinks
    ? paymentLinks
        .filter((p) => p.status === "paid")
        .reduce((sum, p) => sum + Number(p.amount), 0)
    : 0;

  return (
    <div className="flex flex-col xl:flex-row xl:items-center gap-5 xl:gap-10">
      <section>
        <h1 className="text-lg font-bold">Total Payments</h1>
        <div className="flex items-center gap-2">
          <NumberTicker
            value={totalPayment + totalOrder}
            className="whitespace-pre-wrap text-5xl font-medium tracking-tighter text-black dark:text-white"
          />
          <Avatar>
            <AvatarImage src="https://s3.coinmarketcap.com/static-gravity/image/5a8229787b5e4c809b5914eef709b59a.png" />
            <AvatarFallback>USDC</AvatarFallback>
          </Avatar>
        </div>
      </section>
      <section>
        <h1 className="text-lg font-bold">Company Balance</h1>
        <div className="flex items-center gap-2">
          <NumberTicker
            value={
              companyBalanceUSDC
                ? parseFloat(formatUnits(companyBalanceUSDC as bigint, 18))
                : 0
            }
            className="whitespace-pre-wrap text-5xl font-medium tracking-tighter text-black dark:text-white"
          />
          <Avatar>
            <AvatarImage src="https://s3.coinmarketcap.com/static-gravity/image/5a8229787b5e4c809b5914eef709b59a.png" />
            <AvatarFallback>IDRX</AvatarFallback>
          </Avatar>
        </div>
      </section>
      {/* <section>
        <h1 className="text-lg font-bold">IDRX user balance</h1>
        <div className="flex items-center gap-2">
          <NumberTicker
            value={
              balanceIdrx
                ? parseFloat(formatUnits(balanceIdrx as bigint, 2))
                : 0
            }
            className="whitespace-pre-wrap text-5xl font-medium tracking-tighter text-black dark:text-white"
          />
          <Avatar>
            <AvatarImage src="/images/idrx.svg" />
            <AvatarFallback>IDRX</AvatarFallback>
          </Avatar>
        </div>
      </section> */}
    </div>
  );
}
