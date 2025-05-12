"use client";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { NumberTicker } from "@/components/magicui/number-ticker";
import useGetBalance from "@/hooks/getBalance";
import { formatUnits } from "viem";
import useGetBusinessByUser from "@/hooks/getBusinessbyUser";
import useGetRecentPayment from "@/hooks/getRecentPayment";
import useGetCompanyBalance from "@/hooks/getCompanyBalance";
export default function BalanceUser() {
  const { balanceIdrx } = useGetBalance();
  const { business } = useGetBusinessByUser();
  const { paymentLinks } = useGetRecentPayment(business?.id);
  const { balanceIdrx: companyBalanceIdrx } = useGetCompanyBalance(
    business?.address_wallet
  );

  const total = paymentLinks
    ? paymentLinks.reduce((sum, p) => sum + Number(p.amount), 0)
    : 0;
  return (
    <div className="flex items-center gap-10">
      <section>
        <h1 className="text-lg font-bold">IDRX Total payments</h1>
        <div className="flex items-center gap-2">
          <NumberTicker
            value={total}
            className="whitespace-pre-wrap text-5xl font-medium tracking-tighter text-black dark:text-white"
          />
          <Avatar>
            <AvatarImage src="/images/idrx.svg" />
            <AvatarFallback>IDRX</AvatarFallback>
          </Avatar>
        </div>
      </section>
      <section>
        <h1 className="text-lg font-bold">IDRX company balance</h1>
        <div className="flex items-center gap-2">
          <NumberTicker
            value={
              companyBalanceIdrx
                ? parseFloat(formatUnits(companyBalanceIdrx as bigint, 2))
                : 0
            }
            className="whitespace-pre-wrap text-5xl font-medium tracking-tighter text-black dark:text-white"
          />
          <Avatar>
            <AvatarImage src="/images/idrx.svg" />
            <AvatarFallback>IDRX</AvatarFallback>
          </Avatar>
        </div>
      </section>
      <section>
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
      </section>
    </div>
  );
}
