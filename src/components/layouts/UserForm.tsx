import React from "react";
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
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "sonner";
import { useAccount } from "wagmi";
type UserFormProps = {
  fullname: string;
  email: string;
};

export default function UserForm() {
  const { address } = useAccount();
  const [loading, setLoading] = React.useState(false);
  const formik = useFormik({
    initialValues: {
      id: address,
      fullname: "",
      email: "",
    },
    validationSchema: Yup.object({
      fullname: Yup.string().required("Fullname is required"),
      email: Yup.string().email("Invalid email").required("Email is required"),
    }),
    onSubmit: handleSubmit,
  });

  async function handleSubmit(values: UserFormProps) {
    setLoading(true);
    try {
      // Simulate API call
      const respone = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/users/onboarding`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        }
      );
      const data = await respone.json();
      if (respone.ok) {
        toast.success("Profile created successfully");
        formik.resetForm();
        window.location.reload();
      } else {
        toast.error(data.error);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <Card className="z-10 w-full max-w-sm">
        <CardHeader>
          <CardTitle>Create your profile</CardTitle>
          <CardDescription>
            Please fill in the form below to create your profile
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={formik.handleSubmit} className="space-y-5">
            <div className="flex flex-col gap-2">
              <Label>Full name</Label>
              <Input
                id="fullname"
                name="fullname"
                type="text"
                placeholder="example: John Doe"
                value={formik.values.fullname}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                aria-invalid={
                  !!(formik.touched.fullname && formik.errors.fullname)
                }
                aria-describedby="fullname-error"
              />
              {formik.touched.fullname && formik.errors.fullname && (
                <p id="fullname-error" className="text-destructive text-sm">
                  {formik.errors.fullname}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <Label>Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="example: john.doe@example.com"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                aria-invalid={!!(formik.touched.email && formik.errors.email)}
                aria-describedby="email-error"
              />
              {formik.touched.email && formik.errors.email && (
                <p id="email-error" className="text-destructive text-sm">
                  {formik.errors.email}
                </p>
              )}
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Creating profile..." : "Create profile"}
            </Button>
          </form>
        </CardContent>
      </Card>
      <RetroGrid />
    </div>
  );
}
