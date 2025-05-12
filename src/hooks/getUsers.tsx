"use client";
import React from "react";
import { useAccount } from "wagmi";

type User = {
  id: string;
  fullname: string;
  email: string;
  address: string;
  id_number: string;
  id_file: string;
  status: string;
  api_key: string;
  secret_key: string;
  createdAt: string;
  updatedAt: string;
};
export default function useGetUsers() {
  const { address } = useAccount();
  const [users, setUsers] = React.useState<User | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<Error | null>(null);

  React.useEffect(() => {
    if (!address) return; // Only fetch if address exists
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/users/${address}`,
          {
            cache: "no-store",
          }
        );
        const data = await response.json();
        setUsers(data.data);
        setLoading(false);
      } catch (error) {
        setError(error as Error);
        setLoading(false);
      }
    };
    fetchUsers();
  }, [address]);

  return { users, loading, error };
}
