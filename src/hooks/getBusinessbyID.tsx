"use client";
import React from "react";

type Business = {
  id: string;
  logo: string;
  nama: string;
  deskripsi: string;
  address_wallet: string;
  createdAt: string;
  updatedAt: string;
};
export default function useGetBusinessbyID(business_id: string | undefined) {
  const [business, setBusiness] = React.useState<Business | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<Error | null>(null);

  React.useEffect(() => {
    if (!business_id) return; // Only fetch if business_id is valid
    const fetchBusiness = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/business/${business_id}`,
          { cache: "no-store" }
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
  }, [business_id]);

  return { business, loading, error };
}
