import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { BorderBeam } from "@/components/magicui/border-beam";
import { SparklesText } from "@/components/magicui/sparkles-text";

export function Pricing() {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 gap-8 place-items-center">
      <SparklesText>Pricing Plan</SparklesText>
      {/* Free Plan */}
      <Card className="relative w-[350px] overflow-hidden">
        <CardHeader>
          <CardTitle>Free</CardTitle>
          <CardDescription>Get started with basic features</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            <li>✔️ Interact with AI (limited)</li>
            <li>✔️ API Integration (limited)</li>
            <li>✔️ Access to Dashboard</li>
            <li>✔️ Community Support</li>
          </ul>
        </CardContent>
        <CardFooter className="flex flex-col items-start gap-2">
          <span className="text-2xl font-bold">$0</span>
          <Button asChild variant="outline" className="w-full mt-2">
            <a href="/dashboard">Get Started</a>
          </Button>
        </CardFooter>
        <BorderBeam duration={8} size={100} />
      </Card>

      {/* Paid Plan */}
      <Card className="relative w-[370px] overflow-hidden border-2 border-primary shadow-lg scale-105">
        <CardHeader>
          <CardTitle>Pro</CardTitle>
          <CardDescription>Unlock unlimited power</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            <li>
              🚀 <b>Unlimited</b> AI Interactions
            </li>
            <li>
              🔗 <b>Unlimited</b> API Integration
            </li>
            <li>📈 Priority Support</li>
            <li>🛠️ Early Access to New Features</li>
          </ul>
        </CardContent>
        <CardFooter className="flex flex-col items-start gap-2">
          <span className="text-xl font-bold italic line-through">
            $15
            <span className="text-base font-normal">/month</span>
          </span>
          <span className="text-3xl font-bold">
            $5
            <span className="text-base font-normal">/month</span>
          </span>
          <Button asChild className="w-full mt-2">
            <a href="/dashboard">Upgrade Now</a>
          </Button>
          <a
            href="https://0xkayz.gitbook.io/freex/integrate-api-for-marketplace"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-primary underline mt-1"
          >
            Learn about API Integration
          </a>
        </CardFooter>
        <BorderBeam
          duration={8}
          size={120}
          colorFrom="#9c40ff"
          colorTo="#ffaa40"
        />
      </Card>

      <div className="space-y-5">
        <SparklesText>Explore More?</SparklesText>
      </div>
    </section>
  );
}
