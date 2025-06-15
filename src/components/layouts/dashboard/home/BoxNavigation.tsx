import PaymentForm from "@/components/PaymentForm";
import { Button } from "@/components/ui/button";
import { CreditCard, Plus, Link2, Bot } from "lucide-react";
import Link from "next/link";
import React from "react";
import { Chat } from "../Chat";

export default function BoxNavigation() {
  return (
    <section className="grid xl:grid-cols-3 gap-5">
      <div className="border rounded-md p-5 space-y-5">
        <Link2 strokeWidth={2} size={30} />
        <div>
          <h1 className="text-lg font-bold">Payment Link</h1>
          <p className="text-sm text-muted-foreground">
            Receive crypto payments for anything you want with easier.
          </p>
        </div>
        <PaymentForm />
      </div>
      <div className="border rounded-md p-5 space-y-5">
        <Bot strokeWidth={2} size={30} />
        <div>
          <h1 className="text-lg font-bold">Payment Assistants</h1>
          <p className="text-sm text-muted-foreground">
            manage optimization and handle transactions with a powerful AI Agent
            from Freex.
          </p>
        </div>
        <Chat />
      </div>
      <div className="border rounded-md p-5 space-y-5">
        <CreditCard strokeWidth={2} size={30} />
        <div>
          <h1 className="text-lg font-bold">Payment Integration</h1>
          <p className="text-sm text-muted-foreground">
            Powered your app with crypto payments through a powerful API
          </p>
        </div>
        <Link
          href="https://0xkayz.gitbook.io/freex/integrate-api-for-marketplace"
          target="_blank"
        >
          <Button size={"sm"} className="cursor-pointer">
            <Plus /> Start integration
          </Button>
        </Link>
      </div>
    </section>
  );
}
