import React from "react";
import { RetroGrid } from "@/components/magicui/retro-grid";
import { ConnectButtonCustom } from "../ConnectButtonCustom";
import { LineShadowText } from "@/components/magicui/line-shadow-text";
export default function DisconnectPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <section className="text-center z-10 space-y-5">
        <div className="space-y-2">
          <h1 className="text-balance text-7xl font-semibold leading-none tracking-tighter">
            Connect your{" "}
            <LineShadowText className="italic" shadowColor="red">
              account
            </LineShadowText>
          </h1>
          <h2 className="text-xl text-muted-foreground">
            Freex is available on <strong>Lisk Network</strong> using{" "}
            <strong>IDRX</strong> stablecoin
          </h2>
        </div>
        <ConnectButtonCustom />
      </section>
      <RetroGrid />
    </div>
  );
}
