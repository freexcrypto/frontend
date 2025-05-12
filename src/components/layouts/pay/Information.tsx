"use client";
import React from "react";
import useGetPaymentLink from "@/hooks/getPaymentLink";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import useGetBusinessbyID from "@/hooks/getBusinessbyID";
import moment from "moment";
import { Loader2 } from "lucide-react";
export default function Information({ id }: { id: string }) {
  const {
    paymentLink,
    loading: paymentLinkLoading,
    error: paymentLinkError,
  } = useGetPaymentLink(id);

  // Only fetch business if paymentLink is available
  const {
    business,
    error: businessError,
    loading: businessLoading,
  } = useGetBusinessbyID(paymentLink?.business_id);

  const paymentProcessingFee = paymentLink
    ? (Number(paymentLink.amount) * 0.1) / 100
    : 0;
  const totalAmount = paymentLink
    ? Number(paymentLink.amount) + paymentProcessingFee
    : 0;

  // Loading state: show spinner if paymentLink is loading or not yet available
  if (paymentLinkLoading || !paymentLink) {
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
  if (paymentLinkError || businessError) {
    return (
      <div className="p-5 text-destructive">
        {paymentLinkError && (
          <div>Error loading payment link: {paymentLinkError.message}</div>
        )}
        {businessError && (
          <div>Error loading business: {businessError.message}</div>
        )}
      </div>
    );
  }

  return (
    <div className="col-span-1 bg-secondary p-5 rounded-b-md space-y-6 shadow-md max-w-md mx-auto">
      <h1 className="text-2xl font-bold text-center mb-2">
        Transaction Receipt
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
          <div className="flex justify-between">
            <span className="text-muted-foreground">Title</span>
            <span>{paymentLink?.title || "-"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Description</span>
            <span>{paymentLink?.description || "-"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Amount</span>
            <span className="flex items-center gap-1 font-bold">
              {Number(paymentLink?.amount) || 0} IDRX
              <Avatar className="size-5">
                <AvatarImage src="/images/idrx.svg" />
                <AvatarFallback>IDRX</AvatarFallback>
              </Avatar>
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Processing Fee (0.1%)</span>
            <span className="flex items-center gap-1">
              {paymentProcessingFee} IDRX
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
          {totalAmount} IDRX
          <Avatar className="size-5">
            <AvatarImage src="/images/idrx.svg" />
            <AvatarFallback>IDRX</AvatarFallback>
          </Avatar>
        </span>
      </div>
      <div className="flex flex-col gap-1 text-xs text-muted-foreground mt-2">
        <span>
          Created:{" "}
          {paymentLink?.created_at
            ? moment(paymentLink.created_at).format("LLLL")
            : "-"}
        </span>
      </div>
    </div>
  );
}
