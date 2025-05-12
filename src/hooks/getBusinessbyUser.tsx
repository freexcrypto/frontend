"use client";
import React from "react";
import { useAccount } from "wagmi";

type Business = {
  id: string;
  logo: string;
  nama: string;
  deskripsi: string;
  address_wallet: string;
  createdAt: string;
  updatedAt: string;
};
export default function useGetBusinessByUser() {
  const { address } = useAccount();
  const [business, setBusiness] = React.useState<Business | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<Error | null>(null);

  React.useEffect(() => {
    if (!address) return; // Only fetch if address exists
    const fetchBusiness = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/business/by-user/${address}`,
          {
            cache: "no-store",
          }
        );
        const data = await response.json();
        setBusiness(data.data);
        setLoading(false);
      } catch (error) {
        setError(error as Error);
        setLoading(false);
      }
    };
    fetchBusiness();
  }, [address]);

  return { business, loading, error };
}
