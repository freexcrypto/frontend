"use client";
import React from "react";
import useGetPaymentLink from "@/hooks/getPaymentLink";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import useGetBusinessbyID from "@/hooks/getBusinessbyID";
import moment from "moment";
import { Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
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
    <div className="col-span-1 p-5 rounded-b-md space-y-5">
      <h1 className="text-2xl font-bold mb-2">Transaction Information</h1>
      <div className="flex items-center gap-5 text-sm">
        <span className="text-muted-foreground">Transaction ID</span>
        <span className="text-primary font-bold">{id}</span>
      </div>
      <hr />
      {/* Only render business info if paymentLink is available */}
      <div className="space-y-2">
        <h2 className="text-lg font-bold flex items-center gap-2">
          Business Details
        </h2>
        {businessLoading ? (
          <div className="flex items-center gap-2">
            <Loader2 className="size-5 animate-spin" />
            <span>Loading business info...</span>
          </div>
        ) : !business ? (
          <div className="text-destructive">Business not found.</div>
        ) : (
          <div className="flex items-center gap-4">
            <Avatar className="size-12 bg-primary">
              <AvatarImage
                src={business.logo || "/images/default-business.png"}
              />
              <AvatarFallback>{business.nama?.charAt(1) || "?"}</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-bold text-base">{business.nama || "-"}</div>
              <div className="text-sm mt-1">
                <span className="text-muted-foreground">Business Wallet:</span>{" "}
                <span className="text-primary font-medium">
                  {business.address_wallet || "-"}
                </span>
              </div>
            </div>
          </div>
        )}
        <div className="text-muted-foreground text-sm max-w-xl">
          {business?.deskripsi || "-"}
        </div>
      </div>
      <hr />
      <div className="space-y-2">
        <h2 className="text-lg font-bold flex items-center gap-2">
          Payment Details
        </h2>
        <div className="flex flex-col gap-1 text-sm">
          <div>
            <p className="text-muted-foreground">Title</p>
            <p className="text-lg">{paymentLink?.title || "-"}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Description</p>
            <p className="text-lg">{paymentLink?.description || "-"}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Amount</p>
            <span className="flex items-center gap-1 font-bold text-lg">
              {Number(paymentLink?.amount).toLocaleString()} USDC
              <Avatar className="size-6">
                <AvatarImage src="https://s3.coinmarketcap.com/static-gravity/image/5a8229787b5e4c809b5914eef709b59a.png" />
                <AvatarFallback>IDRX</AvatarFallback>
              </Avatar>
            </span>
          </div>
          <div>
            <p className="text-muted-foreground">Network</p>
            <p className="text-lg">{paymentLink?.chain_name}</p>
          </div>
          {/* <div>
            <p className="text-muted-foreground">Processing Fee (0.1%)</p>
            <span className="flex items-center gap-1 font-bold text-lg">
              {Number(paymentLink?.amount).toLocaleString()} IDRX
              <Avatar className="size-6">
                <AvatarImage src="/images/idrx.svg" />
                <AvatarFallback>IDRX</AvatarFallback>
              </Avatar>
            </span>
          </div> */}
        </div>
      </div>
      <hr />
      <div className="flex justify-between items-center text-lg font-bold">
        <span>Total Amount</span>
        <span className="flex items-center gap-1 text-primary">
          {Number(paymentLink?.amount).toLocaleString()} USDC
          <Avatar className="size-6">
            <AvatarImage src="https://s3.coinmarketcap.com/static-gravity/image/5a8229787b5e4c809b5914eef709b59a.png" />
            <AvatarFallback>IDRX</AvatarFallback>
          </Avatar>
        </span>
      </div>
      <div className="flex flex-col gap-1 text-muted-foreground mt-2">
        <Badge
        // variant={paymentLink?.status === "active" ? "outline" : "default"}
        >
          {" "}
          {paymentLink?.status === "active"
            ? "Waiting for payment"
            : "Payment already confirmed"}
        </Badge>
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
