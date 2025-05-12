import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import useGetRecentPayment from "@/hooks/getRecentPayment";
import useGetBusinessByUser from "@/hooks/getBusinessbyUser";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import moment from "moment";

export default function RecentPayments() {
  const { business } = useGetBusinessByUser();

  const { paymentLinks } = useGetRecentPayment(business?.id);

  return (
    <Card className="p-5">
      <h1 className="text-lg font-bold">Recent payments</h1>
      <Table>
        <TableCaption>A list of your recent payments.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">ID</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Amount (IDRX)</TableHead>
            <TableHead>Sender</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Transaction Hash</TableHead>
            <TableHead>Updated At</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paymentLinks?.map((paymentLink) => (
            <TableRow key={paymentLink.id}>
              <TableCell className="font-medium">
                {paymentLink.id.slice(0, 6)}...{paymentLink.id.slice(-6)}
              </TableCell>
              <TableCell>
                <Badge
                  variant={
                    paymentLink.status === "paid" ? "secondary" : "default"
                  }
                >
                  {paymentLink.status}
                </Badge>
              </TableCell>
              <TableCell className="font-medium">{paymentLink.title}</TableCell>
              <TableCell className="font-medium">
                {paymentLink.description}
              </TableCell>
              <TableCell className="font-medium">
                {paymentLink.amount}
              </TableCell>
              <TableCell className="font-medium">
                {paymentLink.sender_address_wallet?.slice(0, 6)}...
                {paymentLink.sender_address_wallet?.slice(-6)}
              </TableCell>
              <TableCell>{paymentLink.customer_name}</TableCell>
              <TableCell>
                <Link
                  href={`https://sepolia-blockscout.lisk.com/tx/${paymentLink.transaction_hash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  {paymentLink.transaction_hash.slice(0, 6)}...
                  {paymentLink.transaction_hash.slice(-6)}
                </Link>
              </TableCell>
              <TableCell>
                {moment(paymentLink.updated_at).format("LLLL")}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
