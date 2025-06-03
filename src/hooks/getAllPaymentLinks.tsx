"use client";
import React from "react";
import useGetBusinessByUser from "./getBusinessbyUser";

export type PaymentLink = {
  id: string;
  title: string;
  description: string;
  payment_link: string;
  amount: number;
  sender_address_wallet: string;
  customer_name: string;
  transaction_hash: string;
  status: string;
  created_at: string;
  chain_name: string;
};

export default function useGetAllPaymentLinks() {
  const { business } = useGetBusinessByUser();
  const [paymentLinks, setPaymentLinks] = React.useState<PaymentLink[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<Error | null>(null);

  React.useEffect(() => {
    if (!business?.id) return; // Only fetch if business_id is valid
    const fetchBusiness = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/payment-link/by-business/${business?.id}`,
          {
            cache: "no-store",
          }
        );
        const data = await response.json();
        setPaymentLinks(data.data);
        setLoading(false);
      } catch (error) {
        setError(error as Error);
        setLoading(false);
      }
    };
    fetchBusiness();
  }, [business?.id]);

  return { paymentLinks, loading, error };
}
