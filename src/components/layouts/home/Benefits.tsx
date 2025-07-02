import React from "react";

export default function Benefits() {
  return (
    <div className="space-y-5">
      <section className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <div className="border p-5 rounded-md ">
          <h1 className="text-2xl font-bold">Ultra-Low Fees</h1>
          <p>0% processing fee per transaction—keep more of your earnings.</p>
        </div>
        <div className="border p-5 rounded-md ">
          <h1 className="text-2xl font-bold">Global & Instant</h1>
          <p>Accept payments from anyone, anywhere—no borders, no delays.</p>
        </div>
        <div className="border p-5 rounded-md ">
          <h1 className="text-2xl font-bold">Stable Value</h1>
          <p>
            Payments with more <strong>Stablecoins</strong> mean you never worry
            about crypto crashes.
          </p>
        </div>
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-2 gap-5 max-w-2xl mx-auto">
        <div className="border p-5 rounded-md ">
          <h1 className="text-2xl font-bold">Full Control</h1>
          <p>
            Track every payment, manage every payment, and growth for the
            future.
          </p>
        </div>
        <div className="border p-5 rounded-md ">
          <h1 className="text-2xl font-bold">Effortless Crypto</h1>
          <p>We handle the blockchain stuff. You focus on your business.</p>
        </div>
      </section>
    </div>
  );
}
