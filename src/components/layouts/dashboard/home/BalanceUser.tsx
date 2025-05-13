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
  const { balanceIdrx } = useGetBalance();
  const { business } = useGetBusinessByUser();
  const { paymentLinks } = useGetRecentPayment(business?.id);
  const { balanceIdrx: companyBalanceIdrx } = useGetCompanyBalance(
    business?.address_wallet
  );

  const { order } = useGetOrderbyBusinessId(business?.id);

  // Calculate payment processing fee
  const [usdRate, setUsdRate] = React.useState<number | null>(null);
  const [usdValue, setUsdValue] = React.useState<number | null>(null);

  // Fetch USD/IDR rate on mount
  React.useEffect(() => {
    async function fetchRate() {
      try {
        const res = await fetch(
          "https://api.exchangerate-api.com/v4/latest/USD"
        );
        const data = await res.json();
        setUsdRate(data.rates.IDR); // USD to IDR
      } catch {
        setUsdRate(null);
      }
    }
    fetchRate();
  }, []);

  const totalOrder = Array.isArray(order)
    ? order
        .filter((p) => p.status_message === "paid")
        .reduce((sum, p) => sum + Number(p.total_price), 0)
    : 0;

  // Calculate IDRX value when order or rate changes
  React.useEffect(() => {
    if (usdRate && totalOrder) {
      setUsdValue(totalOrder * usdRate); // USD to IDRX
    } else {
      setUsdValue(null);
    }
  }, [usdRate, totalOrder]);

  const totalPayment = paymentLinks
    ? paymentLinks
        .filter((p) => p.status === "paid")
        .reduce((sum, p) => sum + Number(p.amount), 0)
    : 0;

  const totalBalance = (usdValue ?? 0) + totalPayment;
  return (
    <div className="flex items-center gap-10">
      <section>
        <h1 className="text-lg font-bold">IDRX Total payments</h1>
        <div className="flex items-center gap-2">
          <NumberTicker
            value={totalBalance}
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
