"use client";

import React, { useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useChat, type Message } from "ai/react";
import { useAccount, useSendTransaction } from "wagmi";
import { parseEther } from "viem";
import { Loader2, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import useGetBusinessByUser from "@/hooks/getBusinessbyUser";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

const codeStyle = vscDarkPlus;

interface ChatBubbleProps {
  role: "user" | "assistant";
  children: React.ReactNode;
  logo?: string;
  nameInitial: string;
}

interface ToolInvocationResult {
  to: string;
  amount: string;
}

interface ToolInvocation {
  toolName: string;
  toolCallId: string;
  state: "running" | "result";
  result?: ToolInvocationResult;
  txHash?: string;
}

// Replace all 'any' with explicit types:
type MarkdownComponentProps = React.PropsWithChildren<
  React.HTMLAttributes<HTMLElement>
>;

const ChatBubble: React.FC<ChatBubbleProps> = ({
  role,
  children,
  logo,
  nameInitial,
}) => {
  const isUser = role === "user";
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={`flex mb-5 ${isUser ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`max-w-prose p-4 rounded-lg flex shadow ${
          isUser ? "" : "bg-secondary"
        }`}
      >
        {!isUser && (
          <Avatar className="w-6 h-6 mr-2 inline-block align-top">
            {logo ? (
              <AvatarImage src={logo} alt="Assistant avatar" />
            ) : (
              <AvatarFallback>{nameInitial}</AvatarFallback>
            )}
          </Avatar>
        )}
        <div className="prose prose-sm dark:prose-invert overflow-x-auto">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              code({ inline, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || "");
                return !inline && match ? (
                  <SyntaxHighlighter
                    // @ts-expect-error - Known type mismatch in react-syntax-highlighter
                    style={codeStyle}
                    language={match[1]}
                    PreTag="div"
                    {...props}
                  >
                    {String(children).replace(/\n$/, "")}
                  </SyntaxHighlighter>
                ) : (
                  <code
                    className="bg-gray-100 dark:bg-gray-800 rounded px-1 "
                    {...props}
                  >
                    {children}
                  </code>
                );
              },
              p: (props: MarkdownComponentProps) => (
                <p className="mb-2" {...props} />
              ),
              ul: (props: MarkdownComponentProps) => (
                <ul className="list-disc pl-4 mb-2" {...props} />
              ),
              ol: (props: MarkdownComponentProps) => (
                <ol className="list-decimal pl-4 mb-2" {...props} />
              ),
              li: (props: MarkdownComponentProps) => (
                <li className="mb-1" {...props} />
              ),
              blockquote: (props: MarkdownComponentProps) => (
                <blockquote
                  className="border-l-4 border-gray-300 pl-4 italic my-2"
                  {...props}
                />
              ),
            }}
          >
            {children as string}
          </ReactMarkdown>
        </div>
      </div>
    </motion.div>
  );
};

export const Chat: React.FC = () => {
  const { address, chain } = useAccount();
  const { business } = useGetBusinessByUser();
  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat({
      initialMessages: [
        {
          role: "assistant",
          content: `Hello! I&apos;m ${business?.nama} AI, your payment assistant. wallet address: ${address}. **How can I help today?**`,
          id: "assistant-init",
        },
      ],
    });

  const { data: txHash, sendTransaction } = useSendTransaction();
  const endRef = useRef<HTMLDivElement>(null);
  const [toolInvocations, setToolInvocations] = React.useState<
    Record<string, ToolInvocation>
  >({});
  const [pendingTxId, setPendingTxId] = React.useState<string | null>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Update tool invocations when transaction hash changes
  useEffect(() => {
    if (txHash && pendingTxId) {
      setToolInvocations((prev) => ({
        ...prev,
        [pendingTxId]: {
          ...prev[pendingTxId],
          txHash: txHash,
        },
      }));
      setPendingTxId(null);
    }
  }, [txHash, pendingTxId]);

  // Render any sendTransaction tool invocations
  const renderToolInvocations = (invocations?: ToolInvocation[]) => {
    if (!invocations) return null;
    return invocations.map((inv) => {
      if (
        inv.toolName === "sendTransaction" &&
        inv.state === "result" &&
        inv.result
      ) {
        const currentInv = toolInvocations[inv.toolCallId] || inv;
        return (
          <div key={inv.toolCallId} className="mt-2 max-w-sm ">
            {!currentInv.txHash && (
              <Button
                className="bg-primary py-2 px-5 rounded-sm w-fit "
                onClick={() => {
                  setPendingTxId(inv.toolCallId);
                  setToolInvocations((prev) => ({
                    ...prev,
                    [inv.toolCallId]: { ...inv, state: "running" },
                  }));
                  sendTransaction({
                    to: inv.result!.to as `0x${string}`,
                    value: parseEther(inv.result!.amount || "0"),
                  });
                }}
              >
                Send Transaction
              </Button>
            )}
            {currentInv.txHash && (
              <Link
                href={`${chain?.blockExplorers?.default.url}/tx/${currentInv.txHash}`}
                target="_blank"
                className="mt-2 text-sm text-gray-600 break-all"
              >
                Transaction hash:{" "}
                <strong>{currentInv.txHash.slice(0, 10)}</strong>
              </Link>
            )}
          </div>
        );
      }
      if (inv.state !== "result") {
        return (
          <div key={inv.toolCallId} className="mt-2 text-sm text-gray-600">
            Loading...
          </div>
        );
      }
      return null;
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <Plus className="w-4 h-4" /> Chat Assistant
        </Button>
      </DialogTrigger>
      <DialogContent className="xl:max-w-fit p-0">
        <div className="flex flex-col h-full">
          <DialogHeader className="px-6 py-4 bg-primary text-white rounded-t-lg">
            <DialogTitle className="text-xl font-semibold">
              {business?.nama} AI Assistant
            </DialogTitle>
            <DialogDescription className="text-sm opacity-90">
              Secure payments & smart transactions.
            </DialogDescription>
          </DialogHeader>
          <Card className="flex-1 m-4 p-0 overflow-hidden">
            <ScrollArea className="h-[60vh] p-4">
              <AnimatePresence initial={false} mode="wait">
                {messages.map((msg: Message, idx: number) => (
                  <React.Fragment key={msg.id ?? idx}>
                    <ChatBubble
                      role={msg.role as "user" | "assistant"}
                      logo={business?.logo}
                      nameInitial={business?.nama?.charAt(0) ?? ""}
                    >
                      {msg.content}
                    </ChatBubble>
                    {renderToolInvocations(
                      (msg as Message & { toolInvocations?: ToolInvocation[] })
                        .toolInvocations
                    )}
                  </React.Fragment>
                ))}
                <div ref={endRef} />
              </AnimatePresence>
            </ScrollArea>
          </Card>
          <form
            onSubmit={handleSubmit}
            className="flex items-center gap-3 p-4 border-t"
          >
            <Input
              aria-label="Type your message"
              placeholder="Type a message..."
              value={input}
              onChange={handleInputChange}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e as React.FormEvent);
                }
              }}
              className="flex-1"
            />
            <Button
              type="submit"
              disabled={isLoading}
              aria-label={isLoading ? "Sending..." : "Send message"}
              className="h-10"
            >
              {isLoading ? (
                <div className="flex items-center gap-1">
                  <Loader2 className="animate-spin" />
                  <p className="animate-pulse">Sending</p>
                </div>
              ) : (
                "Send"
              )}
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};
