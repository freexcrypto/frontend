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
import useGetOrderbyBusinessId, { Order } from "@/hooks/getOrderbyBusinessId";
import useGetBusinessByUser from "@/hooks/getBusinessbyUser";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import moment from "moment";
import Link from "next/link";
export default function RecentOrders() {
  const { business } = useGetBusinessByUser();
  const { order } = useGetOrderbyBusinessId(business?.id);
  const orders: Order[] = Array.isArray(order) ? order : [];
  return (
    <Card className="p-5">
      <h1 className="text-lg font-bold">Recent Orders</h1>
      <Table>
        <TableCaption>A list of your recent orders.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">ID</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>ID Client</TableHead>
            <TableHead>Sender Wallet</TableHead>
            <TableHead>Items</TableHead>
            <TableHead>Total Price (USDC)</TableHead>
            <TableHead>Hash</TableHead>
            <TableHead>Expired At</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Updated At</TableHead>
            <TableHead>Order Link</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order: Order) => (
            <TableRow key={order.id}>
              <TableCell className="font-medium">
                {order.id.slice(0, 6)}...{order.id.slice(-6)}
              </TableCell>
              <TableCell>
                <Badge
                  variant={
                    order.status_message === "paid" ? "default" : "secondary"
                  }
                >
                  {order.status_message}
                </Badge>
              </TableCell>
              <TableCell>{order.client_id}</TableCell>
              <TableCell>
                {order.sender_address_wallet?.slice(0, 6)}...
                {order.sender_address_wallet?.slice(-4)}
              </TableCell>
              <TableCell>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size={"sm"} variant={"outline"}>
                      View Items
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Items</DialogTitle>
                      <DialogDescription></DialogDescription>
                    </DialogHeader>
                    <div className="space-y-5">
                      {order.items.map((item: Order["items"][number]) => (
                        <div key={item.id} className="border p-5 rounded-md">
                          <p className="font-bold">{item.product_name}</p>
                          <div className="flex items-center gap-5">
                            <p>$ {item.product_price}</p>
                            <p className="text-sm text-muted-foreground">
                              x{item.quantity}
                            </p>
                          </div>
                        </div>
                      ))}
                      <p className="font-bold">Total: $ {order.total_price}</p>
                    </div>
                  </DialogContent>
                </Dialog>
              </TableCell>
              <TableCell>{order.total_price}</TableCell>
              <TableCell>
                {order.transaction_hash?.slice(0, 6)}...
                {order.transaction_hash?.slice(-4)}
              </TableCell>
              <TableCell>{moment(order.expired_at).format("LLLL")}</TableCell>
              <TableCell>{moment(order.created_at).format("LLLL")}</TableCell>
              <TableCell>{moment(order.updated_at).format("LLLL")}</TableCell>
              <TableCell>
                <Link href={order.payment_url} target="_blank">
                  <Button size={"sm"}>Open</Button>
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
