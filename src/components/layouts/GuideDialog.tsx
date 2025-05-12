import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AirdropToken } from "@/config/Airdrop";
import { useWaitForTransactionReceipt } from "wagmi";
import { useWriteContract } from "wagmi";
import { toast } from "sonner";
import { AirdropABI } from "@/config/Airdrop";

export default function GuideDialog() {
  const {
    data: hash,
    writeContractAsync,
    isPending,
    isSuccess,
    failureReason,
  } = useWriteContract();

  const {
    isLoading: confirming,
    isSuccess: confirmed,
    isError: isReceiptError,
    failureReason: receiptFailureReason,
  } = useWaitForTransactionReceipt({
    hash: hash,
  });

  React.useEffect(() => {
    if (isPending) {
      toast.loading("Airdrop Send...");
    }
    if (confirming) {
      toast.loading("Confirming...");
    }

    if (confirmed) {
      toast.success("Airdrop Send Success");
    }
    if (isReceiptError) {
      toast.error(
        `Transaction failed: ${
          receiptFailureReason?.message || "Unknown error"
        }`
      );
    }
  }, [confirmed, isReceiptError, receiptFailureReason, confirming, isPending]);

  async function transferAirdrop() {
    // if (parseFloat(balanceNative?.formatted || "0") === 0) {
    //   toast.error("Please add ETH balance first");
    //   return;
    // }
    try {
      if (isSuccess) {
        toast.success("Previous transaction successful");
      }
      await writeContractAsync({
        abi: AirdropABI,
        address: AirdropToken,
        functionName: "claim",
      });
    } catch (error) {
      toast.error(`Error Airdrop Send: ${error}`);
      if (failureReason) {
        toast.error(`Airdrop Send failed: ${failureReason.message}`);
      }
    }
  }

  return (
    <Dialog>
      <DialogTrigger>Guidelines </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>How to Use This App</DialogTitle>
          <DialogDescription>
            Follow these steps to get started:
          </DialogDescription>
          <ol className="list-decimal pl-4 space-y-2 mt-2">
            <li>
              Make sure you have <b>ETH on Lisk Sepolia</b>. You can get it{" "}
              <a
                href="https://sepolia-faucet.lisk.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                here
              </a>
              .
            </li>
            <li>
              Make sure you have <b>IDRX (testnet)</b>. To claim, use this{" "}
              <span
                className="text-blue-600 underline cursor-pointer"
                onClick={transferAirdrop}
              >
                Claim
              </span>
            </li>
          </ol>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
