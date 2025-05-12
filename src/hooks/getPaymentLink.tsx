"use client";
import React from "react";

export type PaymentLink = {
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
};

export default function useGetPaymentLink(id: string) {
  const [paymentLink, setPaymentLink] = React.useState<PaymentLink | null>(
    null
  );
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<Error | null>(null);

  React.useEffect(() => {
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
