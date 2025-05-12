"use client";

import { ConnectButton } from "@xellar/kit";
import { Button } from "./ui/button";

export const ConnectButtonCustom = () => {
  return (
    <ConnectButton.Custom>
      {({
        isConnected,
        account,
        chain,
        openConnectModal,
        openChainModal,
        openProfileModal,
      }) => {
        if (!isConnected) {
          return (
            <Button onClick={openConnectModal} type="button" size="lg">
              Connect Account
            </Button>
          );
        }

        // if (!chain?.id) {
        //   return (
        //     <button onClick={openChainModal} type="button">
        //       Wrong network
        //     </button>
        //   );
        // }

        return (
          <div style={{ display: "flex", gap: 12 }}>
            <Button
              onClick={openChainModal}
              // style={{ display: "flex", alignItems: "center" }}
              type="button"
            >
              {/* {chain?.iconUrl && (
                <div
                  style={{
                    background: chain. || "transparent",
                    width: 12,
                    height: 12,
                    borderRadius: 999,
                    overflow: "hidden",
                    marginRight: 4,
                  }}
                >
                  <img
                    alt={chain.name ?? "Chain icon"}
                    src={chain.iconUrl}
                    style={{ width: 12, height: 12 }}
                  />
                </div>
              )} */}
              {chain?.name}
            </Button>
            <Button onClick={openProfileModal} type="button">
              {account?.address.slice(0, 6)}...
              {account?.address.slice(-4)}
              {account?.balanceFormatted
                ? `(${account.balanceFormatted} ${account.balanceSymbol})`
                : ""}
            </Button>
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
};
