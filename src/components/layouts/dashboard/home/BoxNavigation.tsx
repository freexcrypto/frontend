import PaymentForm from "@/components/PaymentForm";
import { Button } from "@/components/ui/button";
import { Link, CreditCard, ScrollText, Plus } from "lucide-react";
import React from "react";

export default function BoxNavigation() {
  return (
    <section className="grid xl:grid-cols-3 gap-5">
      <div className="border rounded-md p-5 space-y-5">
        <Link strokeWidth={2} size={30} />
        <div>
          <h1 className="text-lg font-bold">Create a payment link</h1>
          <p className="text-sm text-muted-foreground">
            Receive crypto payments for anything
          </p>
        </div>
        <PaymentForm />
      </div>
      <div className="border rounded-md p-5 space-y-5">
        <ScrollText strokeWidth={2} size={30} />
        <div>
          <h1 className="text-lg font-bold">Create an invoice</h1>
          <p className="text-sm text-muted-foreground">
            Create and send crypto invoices to your customers or clients
          </p>
        </div>
        <Button size={"sm"} disabled>
          <Plus /> Create invoice
        </Button>
      </div>
      <div className="border rounded-md p-5 space-y-5">
        <CreditCard strokeWidth={2} size={30} />
        <div>
          <h1 className="text-lg font-bold">Integrate payments</h1>
          <p className="text-sm text-muted-foreground">
            Powered your app with crypto payments through a powerful API
          </p>
        </div>
        <Button size={"sm"}>
          <Plus /> Start integration
        </Button>
      </div>
    </section>
  );
}
