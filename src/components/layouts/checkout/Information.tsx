"use client";
import React, { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import useGetBusinessbyID from "@/hooks/getBusinessbyID";
import moment from "moment";
import { Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import useGetOrderbyId from "@/hooks/getOrderbyId";

export default function Information({ id }: { id: string }) {
  const {
    order,
    loading: orderLoading,
    error: orderError,
  } = useGetOrderbyId(id);

  console.log(order);

  // Only fetch business if paymentLink is available
  const {
    business,
    error: businessError,
    loading: businessLoading,
  } = useGetBusinessbyID(order?.business_id);

  const [usdRate, setUsdRate] = useState<number | null>(null);
  const [usdValue, setUsdValue] = useState<number | null>(null);

  // Fetch USD/IDR rate on mount
  useEffect(() => {
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

  // Calculate IDRX value when order or rate changes
  useEffect(() => {
    if (usdRate && order?.total_price) {
      setUsdValue(Number(order.total_price) * usdRate); // USD to IDRX
    } else {
      setUsdValue(null);
    }
  }, [usdRate, order?.total_price]);

  const paymentProcessingFee = order ? (Number(usdValue) * 0.1) / 100 : 0;
  const totalAmount = order ? Number(usdValue) + paymentProcessingFee : 0;

  // Loading state: show spinner if paymentLink is loading or not yet available
  if (orderLoading || !order) {
    return (
      <div className="flex items-center justify-center h-40">
        <Loader2 className="size-5 animate-spin" />
        <span className="ml-2 text-muted-foreground">
          Loading transaction details...
        </span>
      </div>
    );
  }

  // Error state
  if (orderError || businessError) {
    return (
      <div className="p-5 text-destructive">
        {orderError && <div>Error loading order: {orderError.message}</div>}
        {businessError && (
          <div>Error loading business: {businessError.message}</div>
        )}
      </div>
    );
  }

  return (
    <div className="col-span-1 bg-secondary p-5 rounded-b-md space-y-6 shadow-md max-w-md mx-auto ">
      <h1 className="text-2xl font-bold text-center mb-2">
        Transaction Information
      </h1>
      <div className="flex items-center justify-between">
        <span className="text-muted-foreground text-sm">Transaction ID</span>
        <span className="font-mono text-primary text-xs">{id}</span>
      </div>
      <hr />
      {/* Only render business info if paymentLink is available */}
      <div className="space-y-2">
        <h2 className="text-lg font-bold flex items-center gap-2">Business</h2>
        {businessLoading ? (
          <div className="flex items-center gap-2">
            <Loader2 className="size-5 animate-spin" />
            <span>Loading business info...</span>
          </div>
        ) : !business ? (
          <div className="text-destructive">Business not found.</div>
        ) : (
          <div className="flex items-center gap-4">
            <Avatar className="size-12 bg-black">
              <AvatarImage
                src={business.logo || "/images/default-business.png"}
              />
              <AvatarFallback>{business.nama?.charAt(0) || "?"}</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-bold text-base">{business.nama || "-"}</div>
              <div className="text-xs mt-1">
                <span className="text-muted-foreground">Business Wallet:</span>{" "}
                <span className="text-primary font-mono">
                  {business.address_wallet || "-"}
                </span>
              </div>
            </div>
          </div>
        )}
        <div className="text-muted-foreground text-xs">
          {business?.deskripsi || "-"}
        </div>
      </div>
      <hr />
      <div className="space-y-2">
        <h2 className="text-lg font-bold flex items-center gap-2">
          Payment Details
        </h2>
        <div className="flex flex-col gap-1 text-sm">
          <div className="space-y-2">
            {order?.items.map((item) => (
              <div key={item.id}>
                <p className="font-bold">{item.product_name || "-"}</p>
                <div className="flex gap-3">
                  <p>$ {item.product_price.toLocaleString() || "-"}</p>
                  <p className="text-muted-foreground">
                    x{item.quantity || "-"}
                  </p>
                </div>
              </div>
            ))}
            <p>
              Total Order{" "}
              <strong>
                $ {order?.total_price.toLocaleString()} ={" "}
                {usdValue !== null
                  ? `${usdValue.toLocaleString()} IDRX`
                  : "... IDRX"}
              </strong>
            </p>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Amount</span>
            <span className="flex items-center gap-1 font-bold">
              {usdValue?.toLocaleString() || 0} IDRX
              <Avatar className="size-5">
                <AvatarImage src="/images/idrx.svg" />
                <AvatarFallback>IDRX</AvatarFallback>
              </Avatar>
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Processing Fee (0.1%)</span>
            <span className="flex items-center gap-1">
              {paymentProcessingFee.toLocaleString()} IDRX
              <Avatar className="size-5">
                <AvatarImage src="/images/idrx.svg" />
                <AvatarFallback>IDRX</AvatarFallback>
              </Avatar>
            </span>
          </div>
        </div>
      </div>
      <hr />
      <div className="flex justify-between items-center text-lg font-bold">
        <span>Total Payable</span>
        <span className="flex items-center gap-1 text-primary">
          {totalAmount.toLocaleString()} IDRX
          <Avatar className="size-5">
            <AvatarImage src="/images/idrx.svg" />
            <AvatarFallback>IDRX</AvatarFallback>
          </Avatar>
        </span>
      </div>
      <div className="flex flex-col gap-1 text-xs text-muted-foreground mt-2">
        <Badge
        // variant={paymentLink?.status === "active" ? "outline" : "default"}
        >
          {" "}
          {order?.status_message === "active"
            ? "Waiting for payment"
            : "Payment already confirmed"}
        </Badge>
        <span>
          Created:{" "}
          {order?.created_at ? moment(order.created_at).format("LLLL") : "-"}
        </span>
      </div>
    </div>
  );
}
