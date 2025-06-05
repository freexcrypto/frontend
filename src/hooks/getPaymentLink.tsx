"use client";
import React from "react";

export type PaymentLinkType = {
  id: string;
  business_id: string;
  title: string;
  description: string;
  payment_link: string;
  amount: number;
  sender_address_wallet: string;
  customer_name: string;
  transaction_hash: string;
  status: string;
  created_at: string;
  chain_id: string;
  chain_name: string;
  recieve_token: string;
};

export default function useGetPaymentLink(id: string) {
  const [paymentLink, setPaymentLink] = React.useState<PaymentLinkType | null>(
    null
  );
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<Error | null>(null);

  React.useEffect(() => {
    if (!id) return; // Only fetch if id is valid
    const fetchBusiness = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/payment-link/${id}`,
          {
            cache: "no-store",
          }
        );
        const data = await response.json();
        setPaymentLink(data.data);
        setLoading(false);
      } catch (error) {
        setError(error as Error);
        setLoading(false);
      }
    };
    fetchBusiness();
  }, [id]);

  return { paymentLink, loading, error };
}
