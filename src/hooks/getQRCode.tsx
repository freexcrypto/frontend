"use client";
import React from "react";

export default function useGetQRCode(
  id: string,
  businessId: string,
  chainId: string
) {
  const [qrCode, setQRCode] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<Error | null>(null);

  React.useEffect(() => {
    const fetchBusiness = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/payment-link/qr/${id}/${businessId}/${chainId}`,
          {
            cache: "no-store",
          }
        );
        const data = await response.json();
        setQRCode(data.data);
        setLoading(false);
      } catch (error) {
        setError(error as Error);
        setLoading(false);
      }
    };
    fetchBusiness();
  }, [id, businessId, chainId]);

  return { qrCode, loading, error };
}
