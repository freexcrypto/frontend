"use client";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import useGetTokens from "@/hooks/getTokens";
import { useAccount } from "wagmi";

export default function TokensList() {
  const { chainId } = useAccount();
  const { tokens, loading } = useGetTokens(String(chainId));

  if (loading) {
    return null;
  }

  console.log();
  return (
    <Dialog>
      <DialogTrigger>Open</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </DialogDescription>
        </DialogHeader>
        <p> {tokens?.[0].name}</p>
      </DialogContent>
    </Dialog>
  );
}
