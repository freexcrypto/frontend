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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import useGetAllPaymentLinks from "@/hooks/getAllPaymentLinks";
import Link from "next/link";
import moment from "moment";

export default function RecentPaymentLinks() {
  const { paymentLinks } = useGetAllPaymentLinks();

  return (
    <Card className="p-5">
      <h1 className="text-lg font-bold">Recent payment links</h1>
      <Table>
        <TableCaption>A list of your recent payment links.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">ID</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Amount (USDC)</TableHead>
            <TableHead>Recieve Network</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Link</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paymentLinks && paymentLinks.length > 0 ? (
            paymentLinks.map((link) => (
              <TableRow key={link.id}>
                <TableCell className="font-bold">{link.id.slice(-5)}</TableCell>
                <TableCell>
                  <Badge
                    variant={link.status === "active" ? "default" : "secondary"}
                  >
                    {link.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Tooltip>
                    <TooltipTrigger className="truncate max-w-60">
                      {link.title}
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{link.title}</p>
                    </TooltipContent>
                  </Tooltip>
                </TableCell>
                <TableCell>
                  <Tooltip>
                    <TooltipTrigger className="truncate max-w-60">
                      {link.description}
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{link.description}</p>
                    </TooltipContent>
                  </Tooltip>
                </TableCell>
                <TableCell>{link.amount}</TableCell>
                <TableCell>{link.chain_name}</TableCell>

                <TableCell>{moment(link.created_at).format("LLLL")}</TableCell>
                <TableCell>
                  <Link href={link.payment_link} target="_blank">
                    <Button size={"sm"}>Open</Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="text-center">
                No payment links found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Card>
  );
}
