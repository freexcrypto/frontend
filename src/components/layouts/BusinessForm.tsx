import React, { useState } from "react";
import { RetroGrid } from "@/components/magicui/retro-grid";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import * as Yup from "yup";
import { toast } from "sonner";
import { useFormik } from "formik";
import { useAccount } from "wagmi";
import Image from "next/image";
import { pinata } from "@/config/PinataConfig";
type BusinessFormProps = {
  user_id: string;
  nama: string;
  deskripsi: string;
  address_wallet: string;
};

export default function BusinessForm() {
  const { address } = useAccount();
  const [file, setFile] = useState<File>();
  const [uploading, setUploading] = React.useState<boolean>(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const formik = useFormik({
    initialValues: {
      user_id: address as `0x${string}`,
      nama: "",
      deskripsi: "",
      address_wallet: "",
    },
    validationSchema: Yup.object({
      nama: Yup.string().required("Name is required"),
      deskripsi: Yup.string().required("Description is required"),
      address_wallet: Yup.string().required("Address wallet is required"),
    }),
    onSubmit: handleSubmit,
  });

  async function handleSubmit(values: BusinessFormProps) {
    setLoading(true);
    setError(null);
    let upload: string | undefined = undefined;
    try {
      if (!file) {
        toast.error("No file selected");
        setLoading(false);
        return;
      }

      try {
        setUploading(true);
        const urlRequest = await fetch("/api/url"); // Fetches the temporary upload URL
        const urlResponse = await urlRequest.json(); // Parse response
        const uploadResponse = await pinata.upload.public
          .file(file)
          .url(urlResponse.url); // Upload the file with the signed URL
        // Construct the public gateway URL for the uploaded file
        upload = `${process.env.NEXT_PUBLIC_GATEWAY_URL}/ipfs/${uploadResponse.cid}`;
        setUploading(false);
      } catch {
        setUploading(false);
        setError("Trouble uploading file");
        toast.error("Trouble uploading file");
        setLoading(false);
        return;
      }

      // Submit business data with logo URL
      if (upload) {
        const respone = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/business/onboarding`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              user_id: values.user_id,
              logo: upload,
              nama: values.nama,
              deskripsi: values.deskripsi,
              address_wallet: values.address_wallet,
            }),
          }
        );
        const data = await respone.json();
        if (respone.ok) {
          toast.success("Business created successfully");
          formik.resetForm();
          setFile(undefined);
          setUploading(false);
          window.location.reload();
        } else {
          setError(data.error || "Failed to create business");
          toast.error(data.error || "Failed to create business");
        }
      }
    } catch (err: unknown) {
      let message = "Something went wrong";
      if (err instanceof Error) message = err.message;
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFile(file);
    } else {
      setFile(undefined);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <Card className="z-10 w-full max-w-sm">
        <CardHeader>
          <CardTitle>Create your business</CardTitle>
          <CardDescription>
            Please fill in the form below to create your business
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Show general error message */}
          {error && (
            <div className="mb-2 text-destructive text-sm">{error}</div>
          )}
          <form onSubmit={formik.handleSubmit} className="space-y-5">
            <div className="flex flex-col gap-2">
              <Label htmlFor="logo">Business logo</Label>
              <Input
                id="logo"
                name="logo"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                disabled={loading}
              />
              {/* Image preview */}
              {file && (
                <Image
                  src={URL.createObjectURL(file)}
                  alt="Logo preview"
                  className="mt-2 w-24 h-24 object-contain p-1 rounded border bg-primary"
                  width={24}
                  height={24}
                  priority={true}
                />
              )}
              {uploading && (
                <p className="text-sm text-gray-500">Uploading...</p>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="nama">Business name</Label>
              <Input
                id="nama"
                name="nama"
                type="text"
                placeholder="example: John Doe"
                value={formik.values.nama}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                aria-invalid={!!(formik.touched.nama && formik.errors.nama)}
                aria-describedby="nama-error"
                disabled={loading}
              />
              {formik.touched.nama && formik.errors.nama && (
                <p id="nama-error" className="text-destructive text-sm">
                  {formik.errors.nama}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="deskripsi">Business description</Label>
              <Input
                id="deskripsi"
                name="deskripsi"
                type="text"
                placeholder="example: John Doe"
                value={formik.values.deskripsi}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                aria-invalid={
                  !!(formik.touched.deskripsi && formik.errors.deskripsi)
                }
                aria-describedby="deskripsi-error"
                disabled={loading}
              />
              {formik.touched.deskripsi && formik.errors.deskripsi && (
                <p id="deskripsi-error" className="text-destructive text-sm">
                  {formik.errors.deskripsi}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="address_wallet">Business Address Wallet</Label>
              <Input
                id="address_wallet"
                name="address_wallet"
                type="text"
                placeholder="example: 0x1234567890123456789012345678901234567890"
                value={formik.values.address_wallet}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                aria-invalid={
                  !!(
                    formik.touched.address_wallet &&
                    formik.errors.address_wallet
                  )
                }
                aria-describedby="address_wallet-error"
                disabled={loading}
              />
              {formik.touched.address_wallet &&
                formik.errors.address_wallet && (
                  <p
                    id="address_wallet-error"
                    className="text-destructive text-sm"
                  >
                    {formik.errors.address_wallet}
                  </p>
                )}
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={loading || uploading}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    />
                  </svg>
                  Creating...
                </span>
              ) : (
                "Create business"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
      <RetroGrid />
    </div>
  );
}
