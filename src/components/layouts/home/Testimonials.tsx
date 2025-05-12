/* eslint-disable @next/next/no-img-element */
import { cn } from "@/lib/utils";
import { Marquee } from "@/components/magicui/marquee";

const reviews = [
  {
    name: "Jack",
    username: "@jack",
    body: "The platform's transaction speed is incredible. I was able to complete my crypto exchange in under 2 minutes, and the fees were much lower than other services I've used. The interface is intuitive and secure.",
    img: "https://avatar.vercel.sh/jack",
  },
  {
    name: "Jill",
    username: "@jill",
    body: "As someone new to crypto, I was worried about the complexity. But this gateway made it so simple! The step-by-step process and real-time support helped me make my first transaction with confidence.",
    img: "https://avatar.vercel.sh/jill",
  },
  {
    name: "John",
    username: "@john",
    body: "The security features give me peace of mind. I've been using this platform for my business transactions, and the multi-factor authentication and transaction monitoring have been excellent.",
    img: "https://avatar.vercel.sh/john",
  },
  {
    name: "Sarah",
    username: "@sarah_crypto",
    body: "The mobile app is a game-changer! I can manage my crypto portfolio on the go, and the real-time price alerts have helped me make better trading decisions. Customer support is always responsive.",
    img: "https://avatar.vercel.sh/sarah",
  },
  {
    name: "Michael",
    username: "@mike_trader",
    body: "As a day trader, I need reliable and fast execution. This platform's advanced trading features and low latency have significantly improved my trading efficiency. The API integration is seamless.",
    img: "https://avatar.vercel.sh/michael",
  },
  {
    name: "Emma",
    username: "@emma_investor",
    body: "The educational resources and market analysis tools are invaluable. I've learned so much about crypto investing through their platform, and the portfolio tracking features are exactly what I needed.",
    img: "https://avatar.vercel.sh/emma",
  },
  {
    name: "David",
    username: "@david_tech",
    body: "The platform's integration with my existing financial tools is perfect. I can easily track my crypto investments alongside traditional assets, and the reporting features are comprehensive.",
    img: "https://avatar.vercel.sh/david",
  },
  {
    name: "Lisa",
    username: "@lisa_developer",
    body: "The developer documentation and API are top-notch. I've integrated the payment gateway into my e-commerce platform, and the transaction success rate has been impressive.",
    img: "https://avatar.vercel.sh/lisa",
  },
];

const firstRow = reviews.slice(0, reviews.length / 2);
const secondRow = reviews.slice(reviews.length / 2);

const ReviewCard = ({
  img,
  name,
  username,
  body,
}: {
  img: string;
  name: string;
  username: string;
  body: string;
}) => {
  return (
    <figure
      className={cn(
        "relative h-full w-full cursor-pointer overflow-hidden rounded-xl border p-4",
        // light styles
        "border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]",
        // dark styles
        "dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]"
      )}
    >
      <div className="flex flex-row items-center gap-2">
        <img className="rounded-full" width="32" height="32" alt="" src={img} />
        <div className="flex flex-col">
          <figcaption className="text-sm font-medium dark:text-white">
            {name}
          </figcaption>
          <p className="text-xs font-medium dark:text-white/40">{username}</p>
        </div>
      </div>
      <blockquote className="mt-2 text-sm">{body}</blockquote>
    </figure>
  );
};

export function Testimonials() {
  return (
    <div className="relative flex h-[500px] w-full flex-row items-center justify-center overflow-hidden">
      <Marquee pauseOnHover vertical className="[--duration:20s]">
        {firstRow.map((review) => (
          <ReviewCard key={review.username} {...review} />
        ))}
      </Marquee>
      <Marquee pauseOnHover vertical className="[--duration:20s]">
        {secondRow.map((review) => (
          <ReviewCard key={review.username} {...review} />
        ))}
      </Marquee>
      {/* <Marquee pauseOnHover vertical className="[--duration:20s]">
        {firstRow.map((review) => (
          <ReviewCard key={review.username} {...review} />
        ))}
      </Marquee> */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-1/4 bg-gradient-to-b from-background"></div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-background"></div>
      {/* <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-background"></div> */}
    </div>
  );
}
