"use client";
import React, { useState } from "react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "./ui/button";
import { Plus } from "lucide-react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "sonner";
import useGetBusinessByUser from "@/hooks/getBusinessbyUser";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useAccount } from "wagmi";
import { useGetReceiveToken } from "@/hooks/getRecieveToken";

type PaymentFormProps = {
  title: string;
  description: string;
  amount: number;
};

export default function PaymentForm() {
  const { chain } = useAccount();
  const { business } = useGetBusinessByUser();
  const { receiveToken } = useGetReceiveToken();
  console.log(receiveToken);

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      amount: 0,
    },
    validationSchema: Yup.object({
      title: Yup.string().required("Title is required"),
      description: Yup.string(),
      amount: Yup.number()
        .required("Amount is required")
        .positive("Amount must be positive")
        .min(1, "Minimum amount is 1 USDC"),
    }),
    onSubmit: handleSubmit,
  });

  async function handleSubmit(values: PaymentFormProps) {
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/payment-link/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            business_id: business?.id,
            title: values.title,
            description: values.description,
            amount: values.amount,
            chain_id: chain?.id,
            chain_name: chain?.name,
            recieve_token: receiveToken?.address,
          }),
        }
      );
      const data = await response.json();
      console.log(data);
      toast.success("Payment link created successfully", {
        action: (
          <Link href={`/pay/${data.data.id}`} target="_blank">
            <Button>View link</Button>
          </Link>
        ),
      });
      setOpen(false); // Optionally close dialog on submit
      formik.resetForm();
    } finally {
      setLoading(false);
    }
  }

  function handleDialogChange(isOpen: boolean) {
    setOpen(isOpen);
    if (!isOpen) {
      formik.resetForm();
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={handleDialogChange}>
      <AlertDialogTrigger asChild>
        <Button size={"sm"} className="cursor-pointer">
          <Plus /> Create link
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Create a payment link</AlertDialogTitle>
          <AlertDialogDescription>
            Create a payment link to receive crypto payments for anything
          </AlertDialogDescription>
        </AlertDialogHeader>
        <form onSubmit={formik.handleSubmit} className="space-y-2">
          <div className="flex flex-col gap-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              type="text"
              placeholder="example: Logo Design"
              value={formik.values.title}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              aria-invalid={!!(formik.touched.title && formik.errors.title)}
              aria-describedby="title-error"
            />
            {formik.touched.title && formik.errors.title && (
              <p id="title-error" className="text-destructive text-sm">
                {formik.errors.title}
              </p>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              name="description"
              type="text"
              placeholder="example: Logo design for company website - 2 revisions included"
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              aria-invalid={
                !!(formik.touched.description && formik.errors.description)
              }
              aria-describedby="description-error"
            />
            {formik.touched.description && formik.errors.description && (
              <p id="description-error" className="text-destructive text-sm">
                {formik.errors.description}
              </p>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="amount">Amount (USDC)</Label>
            <div className="flex items-center gap-2 max-w-42 relative">
              <Input
                id="amount"
                name="amount"
                type="text"
                min={1}
                placeholder="example: 1"
                value={formik.values.amount === 0 ? "" : formik.values.amount}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                aria-invalid={!!(formik.touched.amount && formik.errors.amount)}
                aria-describedby="amount-error"
              />
              <Avatar className="absolute right-0">
                <AvatarImage src="https://s3.coinmarketcap.com/static-gravity/image/5a8229787b5e4c809b5914eef709b59a.png" />
                <AvatarFallback>IDRX</AvatarFallback>
              </Avatar>
            </div>
            <span className="text-muted-foreground text-sm">
              1 USDC = 1 USD
            </span>
            {formik.touched.amount && formik.errors.amount && (
              <p id="amount-error" className="text-destructive text-sm">
                {formik.errors.amount}
              </p>
            )}
            <p className="">
              Recieve USDC in <strong>{chain?.name} Network</strong>
            </p>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
            <Button type="submit" disabled={loading}>
              {loading ? "Processing..." : "Continue"}
            </Button>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
